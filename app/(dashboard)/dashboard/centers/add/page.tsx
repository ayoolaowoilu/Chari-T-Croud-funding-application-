'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { uploadImage } from '@/app/lib/upload'
import { compressImageIfNeeded, validateImageFile, formatFileSize, CompressionResult } from "@/app/lib/imageCompression"
import { FetchBanks, getSubAccountCode, SubAccountPayload, VerifyBankDetails } from "@/app/lib/paystack"
import NavBar from '@/app/components/layout/NavBar'
import { CenterRegistrationPayload } from '@/app/lib/types'
import { UploadCenter } from '@/app/lib/fetchRequests'

interface FormData {
  name: string
  registration_number: string
  email: string
  phone: string
  address: string
  website: string
  about: string
  geo_location: string
  bank_details: {
    account_name: string
    account_number: string
    bank_name: string
    bank_code: string
    branch: string
    swift_code: string
  }
}

interface CloudinaryResult {
  url: string
  publicId: string
  width: number
  height: number
}

interface UploadFile {
  cloudinary: CloudinaryResult
  originalName: string
  compression?: CompressionResult
}

interface PaystackBank {
  name: string
  code: string
  type: string
}

export default function CenterRegistration() {
  const [form, setForm] = useState<FormData>({
    name: '',
    registration_number: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    about: '',
    geo_location: '',
    bank_details: {
      account_name: '',
      account_number: '',
      bank_name: '',
      bank_code: '',
      branch: '',
      swift_code: ''
    }
  })

  const [logo, setLogo] = useState<UploadFile | null>(null)
  const [documents, setDocuments] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState<'logo' | 'doc' | null>(null)
  const [compressionProgress, setCompressionProgress] = useState<number>(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Bank verification state
  const [banks, setBanks] = useState<PaystackBank[]>([])
  const [filteredBanks, setFilteredBanks] = useState<PaystackBank[]>([])
  const [bankSearchQuery, setBankSearchQuery] = useState('')
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [isFetchingBanks, setIsFetchingBanks] = useState(false)
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false)
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null)
  const [bankError, setBankError] = useState<string | null>(null)

  const bankDropdownRef = useRef<HTMLDivElement>(null)
  const bankInputRef = useRef<HTMLInputElement>(null)

  
  useEffect(() => {
    const loadBanks = async () => {
      setIsFetchingBanks(true)
      try {
        const data = await FetchBanks()
        if (data.status && data.data) {
          setBanks(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch banks:', err)
      } finally {
        setIsFetchingBanks(false)
      }
    }
    loadBanks()
  }, [])

  // Filter banks based on search
  useEffect(() => {
    if (bankSearchQuery.trim() === '') {
      setFilteredBanks([])
      return
    }
    const query = bankSearchQuery.toLowerCase()
    const filtered = banks.filter(bank =>
      bank.name.toLowerCase().includes(query) ||
      bank.code.includes(query)
    ).slice(0, 8)
    setFilteredBanks(filtered)
  }, [bankSearchQuery, banks])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(event.target as Node) &&
        bankInputRef.current &&
        !bankInputRef.current.contains(event.target as Node)
      ) {
        setShowBankDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-verify when account number reaches 10 digits and bank is selected
  useEffect(() => {
    const accountNumber = form.bank_details.account_number
    const bankName = form.bank_details.bank_name

    if (bankName && accountNumber.length === 10 && !verifiedAccountName && !isVerifyingAccount) {
      const timeoutId = setTimeout(() => {
        handleVerifyAccount()
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [form.bank_details.account_number, form.bank_details.bank_name])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith('bank_')) {
      const field = name.replace('bank_', '')
      setForm(prev => ({
        ...prev,
        bank_details: { ...prev.bank_details, [field]: value }
      }))
      setBankError(null)
      if (field === 'account_number' || field === 'bank_name') {
        setVerifiedAccountName(null)
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleBankSelect = (bank: PaystackBank) => {
    setForm(prev => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        bank_name: bank.name,
        bank_code: bank.code
      }
    }))
    setBankSearchQuery(bank.name)
    setShowBankDropdown(false)
    setVerifiedAccountName(null)
    setBankError(null)
  }

  const handleBankSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBankSearchQuery(value)
    setShowBankDropdown(true)
    if (value === '') {
      setForm(prev => ({
        ...prev,
        bank_details: { ...prev.bank_details, bank_name: '', bank_code: '' }
      }))
    }
  }

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setForm(prev => ({
      ...prev,
      bank_details: { ...prev.bank_details, account_number: value }
    }))
    setVerifiedAccountName(null)
    setBankError(null)
  }

  const handleVerifyAccount = async () => {
    const { bank_name, account_number, bank_code } = form.bank_details

    if (!bank_name || !account_number || account_number.length < 10) {
      setBankError('Please select a bank and enter a valid 10-digit account number')
      return
    }

    setIsVerifyingAccount(true)
    setBankError(null)
    setVerifiedAccountName(null)

    try {
      const data = await VerifyBankDetails(account_number, bank_code)

      if (data.status && data.data) {
        setVerifiedAccountName(data.data.account_name)
        setForm(prev => ({
          ...prev,
          bank_details: {
            ...prev.bank_details,
            account_name: data.data.account_name
          }
        }))
      } else {
        setBankError(data.message || 'Account verification failed')
      }
    } catch (err) {
      setBankError('Network error. Please try again.')
    } finally {
      setIsVerifyingAccount(false)
    }
  }

  const processFile = async (file: File): Promise<File> => {
    const validation = validateImageFile(file)
    if (!validation.valid) throw new Error(validation.error)

    if (file.size > 1024 * 1024) {
      const result = await compressImageIfNeeded(file, (progress) => {
        setCompressionProgress(Math.round(progress))
      })
      return result.file
    }
    return file
  }

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'doc') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(type)
    setCompressionProgress(0)
    setErrors(prev => { const n = { ...prev }; delete n[type === 'logo' ? 'logo' : 'documents']; return n })

    try {
      const processedFile = await processFile(file)
      const data = new FormData()
      data.append('file', processedFile)
      const result = await uploadImage(data)

      const uploadFile: UploadFile = {
        cloudinary: result,
        originalName: file.name,
        compression: file.size > 1024 * 1024 ? {
          file: processedFile,
          originalSize: file.size,
          compressedSize: processedFile.size,
          compressionRatio: `${(((file.size - processedFile.size) / file.size) * 100).toFixed(1)}%`,
          wasCompressed: true
        } : undefined
      }

      if (type === 'logo') {
        setLogo(uploadFile)
      } else {
        setDocuments(prev => [...prev, uploadFile])
      }
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        [type === 'logo' ? 'logo' : 'documents']: err.message || 'Upload failed. Try again.'
      }))
    } finally {
      setUploading(null)
      setCompressionProgress(0)
      e.target.value = ''
    }
  }, [])

  const removeDocument = (publicId: string) => {
    setDocuments(prev => prev.filter(d => d.cloudinary.publicId !== publicId))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) newErrors.name = 'Center name is required'
    if (!form.registration_number.trim()) newErrors.registration_number = 'Registration number is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.website.trim()) newErrors.website = 'Website is required'
    if (!form.geo_location.trim()) newErrors.geo_location = 'Geo location is required'
    if (!form.about.trim()) newErrors.about = 'About description is required'
    if (!logo) newErrors.logo = 'Logo is required'
    if (documents.length === 0) newErrors.documents = 'At least one verification document is required'

    // Bank validation - all fields required via auto-verification
    if (!form.bank_details.bank_name) newErrors.bank_bank_name = 'Please select a bank'
    if (!form.bank_details.account_number || form.bank_details.account_number.length < 10) {
      newErrors.bank_account_number = 'Valid 10-digit account number is required'
    }
    if (!verifiedAccountName) newErrors.bank_verification = 'Please verify your account before submitting'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    const subAccountpayload: SubAccountPayload = {
      business_name: form.bank_details.account_name,
      account_number: form.bank_details.account_number,
      settlement_bank: form.bank_details.bank_name,
      percentage_charge: 4
    }
    const subAccountCode = await getSubAccountCode(subAccountpayload)

    const payload:CenterRegistrationPayload = {
      name: form.name,
      registration_number: form.registration_number,
      email: form.email,
      phone: form.phone,
      address: form.address,
      website: form.website,
      is_verified_status: 'pending',
      about: form.about,
      logourl: logo?.cloudinary.url || null,
      geo_location: form.geo_location,
      bank_details: {
        account_name: form.bank_details.account_name,
        account_number: form.bank_details.account_number,
        bank_name: form.bank_details.bank_name,
        bank_code: form.bank_details.bank_code,
        branch: form.bank_details.branch,
        swift_code: form.bank_details.swift_code,
        subAccountCode: subAccountCode
      },
      verification_documents: documents.map(d => ({
        url: d.cloudinary.url,
        public_id: d.cloudinary.publicId,
        width: d.cloudinary.width,
        height: d.cloudinary.height,
        original_name: d.originalName,
        compressed: d.compression?.wasCompressed || false,
        compression_ratio: d.compression?.compressionRatio || null
      }))
    }
;
    console.log('=== CENTER REGISTRATION PAYLOAD ===')
    console.log(JSON.stringify(payload, null, 2))
    console.log('===================================')

    const resp = await UploadCenter(payload)
    if(resp.error){
        
    }
    setSubmitting(false)
  
  }

  const inputClass = (field: string) => `
    w-full px-4 py-2.5 bg-white border rounded-lg text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
  `

  const renderUploadStatus = (file: UploadFile) => (
    <div className="mt-1.5 text-xs text-gray-500 flex items-center gap-2">
      <span>{formatFileSize(file.compression?.originalSize || 0)}</span>
      {file.compression?.wasCompressed && (
        <>
          <span className="text-green-600">compressed to {formatFileSize(file.compression.compressedSize)}</span>
          <span className="text-green-600">({file.compression.compressionRatio} saved)</span>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <NavBar />
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-black">

          <div className="px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-900">Register Charity Center</h1>
            <p className="mt-1 text-sm text-gray-500">Complete the form below to register your organization</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">

            {/* Basic Information */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Center Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Hope Foundation"
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="registration_number"
                    value={form.registration_number}
                    onChange={handleChange}
                    placeholder="e.g., REG-2024-001"
                    className={inputClass('registration_number')}
                  />
                  {errors.registration_number && <p className="mt-1 text-xs text-red-500">{errors.registration_number}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contact@organization.org"
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={inputClass('phone')}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://www.organization.org"
                    className={inputClass('website')}
                  />
                  {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website}</p>}
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Location</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full street address"
                    className={inputClass('address')}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Geo Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="geo_location"
                    value={form.geo_location}
                    onChange={handleChange}
                    placeholder="Latitude, Longitude or City, Country"
                    className={inputClass('geo_location')}
                  />
                  {errors.geo_location && <p className="mt-1 text-xs text-red-500">{errors.geo_location}</p>}
                </div>
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">About</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your organization's mission, activities, and impact..."
                  className={`${inputClass('about')} resize-none`}
                />
                {errors.about && <p className="mt-1 text-xs text-red-500">{errors.about}</p>}
                <p className="mt-1.5 text-xs text-gray-400 text-right">{form.about.length} characters</p>
              </div>
            </section>

            {/* Logo Upload */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Organization Logo</h2>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading === 'logo'}
                    />
                    {uploading === 'logo' ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        {compressionProgress > 0 && compressionProgress < 100 ? (
                          <>
                            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${compressionProgress}%` }}
                              />
                            </div>
                            <span className="text-sm">Compressing... {compressionProgress}%</span>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="text-sm">Uploading....</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Click to upload logo</p>
                        <p className="text-xs text-gray-400">JPG, PNG, WEBP, GIF (max 1MB, auto-compressed)</p>
                      </>
                    )}
                  </div>
                  {errors.logo && <p className="mt-1.5 text-xs text-red-500">{errors.logo}</p>}
                </div>

                {logo && (
                  <div className="w-32 shrink-0">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 relative group">
                      <img src={logo.cloudinary.url} alt="Logo preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setLogo(null)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {renderUploadStatus(logo)}
                  </div>
                )}
              </div>
            </section>

            {/* Verification Documents */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Verification Documents <span className="text-red-500">*</span>
              </h2>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors relative mb-4">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => handleFileUpload(e, 'doc')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading === 'doc'}
                />
                {uploading === 'doc' ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    {compressionProgress > 0 && compressionProgress < 100 ? (
                      <>
                        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${compressionProgress}%` }}
                          />
                        </div>
                        <span className="text-sm">Compressing... {compressionProgress}%</span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm">Uploading to Cloudinary...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Upload registration certificate, tax docs, etc.</p>
                    <p className="text-xs text-gray-400">Images only, max 1MB (auto-compressed)</p>
                  </>
                )}
              </div>
              {errors.documents && <p className="mb-3 text-xs text-red-500">{errors.documents}</p>}

              {documents.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {documents.map((doc) => (
                    <div key={doc.cloudinary.publicId} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                      <img src={doc.cloudinary.url} alt={doc.originalName} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 truncate">
                        {doc.originalName}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.cloudinary.publicId)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {doc.compression?.wasCompressed && (
                        <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {doc.compression.compressionRatio}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bank Details Section - Auto Verify Only */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Bank Details <span className="text-red-500">*</span>
                </h2>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Auto-verified via Paystack</span>
              </div>

              {errors.bank_verification && (
                <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600">{errors.bank_verification}</p>
                </div>
              )}

              {bankError && (
                <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600">{bankError}</p>
                </div>
              )}

              {verifiedAccountName && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-green-800 mb-1">Account Verified</div>
                  <div className="text-sm text-green-700">{verifiedAccountName}</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative" ref={bankDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={bankInputRef}
                      type="text"
                      value={bankSearchQuery}
                      onChange={handleBankSearchChange}
                      onFocus={() => bankSearchQuery.trim() !== '' && setShowBankDropdown(true)}
                      placeholder="Type to search banks..."
                      disabled={isVerifyingAccount}
                      className={`${inputClass('bank_bank_name')} pr-10`}
                      autoComplete="off"
                    />
                    {isFetchingBanks && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                  </div>

                  {showBankDropdown && filteredBanks.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredBanks.map((bank) => (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => handleBankSelect(bank)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className="font-medium text-sm text-gray-900">{bank.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">Code: {bank.code} · {bank.type}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showBankDropdown && bankSearchQuery.trim() !== '' && filteredBanks.length === 0 && !isFetchingBanks && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
                      No banks found matching &quot;{bankSearchQuery}&quot;
                    </div>
                  )}
                  {errors.bank_bank_name && <p className="mt-1 text-xs text-red-500">{errors.bank_bank_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.bank_details.account_number}
                    onChange={handleAccountNumberChange}
                    placeholder="Enter 10-digit account number"
                    disabled={isVerifyingAccount}
                    maxLength={10}
                    className={inputClass('bank_account_number')}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{form.bank_details.account_number.length}/10 digits</span>
                    {isVerifyingAccount && <span className="text-xs text-blue-500 animate-pulse">Verifying...</span>}
                  </div>
                  {errors.bank_account_number && <p className="mt-1 text-xs text-red-500">{errors.bank_account_number}</p>}
                </div>

                {/* Manual verify button as fallback */}
                {form.bank_details.bank_name && form.bank_details.account_number.length === 10 && !verifiedAccountName && !isVerifyingAccount && (
                  <button
                    type="button"
                    onClick={handleVerifyAccount}
                    className="w-full py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Verify Account Now
                  </button>
                )}
              </div>
            </section>

            {/* Submit */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className={`
                  w-full md:w-auto px-8 py-3 rounded-lg text-sm font-medium text-white
                  transition-all duration-200
                  ${submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow'
                  }
                `}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit Registration'
                )}
              </button>
              <p className="mt-3 text-xs text-gray-400">
                Your application will be reviewed within 2-3 business days.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}