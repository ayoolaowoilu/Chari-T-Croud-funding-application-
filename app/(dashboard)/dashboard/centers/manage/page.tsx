'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { uploadImage } from '@/app/lib/upload'
import { compressImageIfNeeded, validateImageFile, formatFileSize, CompressionResult } from "@/app/lib/imageCompression"
import { FetchBanks, getSubAccountCode, SubAccountPayload, VerifyBankDetails } from "@/app/lib/paystack"
import NavBar from '@/app/components/layout/NavBar'
import { CenterRegistrationPayload } from '@/app/lib/types'
import { FetchProfile, GetCenter, UploadCenter } from '@/app/lib/fetchRequests'
import { useSession } from 'next-auth/react'
import { DualRingSpinner } from '@/app/components/ui/loading'
import Footer from '@/app/components/layout/footer'
import { CheckCircle2, XCircle } from 'lucide-react'
import Button from '@/app/components/ui/button'
import { redirect } from 'next/navigation'

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

interface Center {
  id: number
  name: string
  registration_number: string
  email: string
  phone: string
  address: string
  website: string
  about: string
  geo_location: string
  is_verified_status: string
  logourl: string
  recived: string
  total_donators?: number
  total_campaigns?: number
  bank_details: any
  verification_documents: any[]
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

  const [banks, setBanks] = useState<PaystackBank[]>([])
  const [filteredBanks, setFilteredBanks] = useState<PaystackBank[]>([])
  const [bankSearchQuery, setBankSearchQuery] = useState('')
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [isFetchingBanks, setIsFetchingBanks] = useState(false)
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false)
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null)
  const [bankError, setBankError] = useState<string | null>(null)
  const [isEdit,setIsEdit] =  useState(false)

  const bankDropdownRef = useRef<HTMLDivElement>(null)
  const bankInputRef = useRef<HTMLInputElement>(null)
  const {data:session,status} = useSession()
  const [loading,setLoading] = useState(false)
  const [loadError , setLoadError] = useState(false)
  const [centers,setCenters] = useState<Center[]>([])
  const [stages , setStages] = useState<1 | 2 | 3 | 4 >(1)
  const [id , setID] = useState<number>()
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)

  const fetchUserData = async () => {
    if (status !== 'authenticated') return;
    if (!session?.user?.email) return;
    setLoading(true)
    setLoadError(false)
    try {
      const resp = await FetchProfile(session.user.email as string)
      if (resp.error) {
        setLoadError(true)
      } else {
        if (!resp.kyc) {
          window.location.href = "/dashboard/kyc?redir=/dashboard/centers/add"
        }
        const resp1 = await GetCenter("OWNED",session.user.email as string)
        if(resp.error){
          setLoadError(true)
        }
        const centersWithStats = resp1.map((c: Center) => ({
          ...c,
          total_donators: c.total_donators ,
          total_campaigns: c.total_campaigns
        }))
        setCenters(centersWithStats)
      }
    } catch (error) {
      console.error(error)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchUserData()
  },[session])

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
    setErrors({}) 
    try {
      const subAccountpayload: SubAccountPayload = {
        business_name: form.bank_details.account_name,
        account_number: form.bank_details.account_number,
        settlement_bank: form.bank_details.bank_name,
        percentage_charge: 4
      }
      let subAccountCode: string | null = null
      try {
        subAccountCode = await getSubAccountCode(subAccountpayload)
      } catch (subError: any) {
        console.error('Sub-account creation failed:', subError)
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to create payment sub-account. Please check your bank details and try again.'
        }))
        setSubmitting(false)
        return
      }
      const payload: CenterRegistrationPayload & {type:string , id:number} = {
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
        })),
        userEmail:session?.user.email as string,type:isEdit ? "EDIT" : "NO_EDIT" , id:Number(id)
      }
   
      const resp = await UploadCenter(payload)
      if (resp.error) {
        setErrors(prev => ({
          ...prev,
          submit: resp.message || 'Registration failed. Please try again.'
        }))
        return
      }
      setStages(4)
    } catch (err: any) {
      console.error('Registration submission error:', err)
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'An unexpected error occurred. Please try again later.'
      }))
    } finally {
      setSubmitting(false)
    }
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

  const getStatusBadge = (status: string) => {
    if (status?.toLowerCase() === "verified") {
        return (
            <span className="inline-flex items-center transition-transform duration-300 hover:scale-110" title="Verified Charity">
                <svg className="h-5 w-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                </svg>
            </span>
        )
    }
    if (status?.toLowerCase() === "pending") {
        return (
            <span className="inline-flex items-center transition-transform duration-300 hover:scale-110" title="Pending Verification">
                <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        )
    }
    if (status?.toLowerCase() === "rejected") {
        return (
            <span className="inline-flex items-center transition-transform duration-300 hover:scale-110" title="Not Approved">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        )
    }
    return null
  }

  if(loading){
      return <div className='w-screen h-screen bg-white'>
         <NavBar />
        <div className="my-50">
           <DualRingSpinner />
        </div>
         <Footer />
      </div>
  }

  if(loadError){
       return <div className='w-screen h-screen bg-white'>
            <NavBar />
            <main className="my-50 mx-auto w-full flex flex-col justify-center items-center " >
                 <XCircle className='mx-auto' color='red' size={40} />
                 <br />
                 <p className='text-black font-bold my-6 text-center'>Error Loading User Data Check Connection</p>
                 <Button details="Retry"  size='md' />
            </main>
        <Footer />
       </div>
  }

  if(stages == 1){
    return <>
      <NavBar />
      <div className="w-full min-h-screen bg-slate-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Your Centers</h1>
                <p className="mt-1 text-sm text-slate-500">You can register a maximum of 5 centers</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">{centers.length} / 5</span>
                <div className="w-24 h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-slate-800 rounded-full transition-all duration-300" style={{ width: `${(centers.length / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {centers.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
              <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
              <h3 className="text-base font-semibold text-slate-800">No centers yet</h3>
              <p className="text-sm text-slate-400 mt-1">Add your first center to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {centers.map((item, index) => {
                const isVerified = item.is_verified_status?.toLowerCase() === "verified"

                return (
                  <div 
                    key={index} 
                    onClick={() => {
                      setSelectedCenter(item)
                      setStages(2)
                    }}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group"
                  >
                    {/* Card Header with Logo & Status */}
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                            {item.logourl ? (
                              <img 
                                src={item.logourl} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} 
                              />
                            ) : null}
                            <svg className={`w-5 h-5 text-slate-300 ${item.logourl ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900 truncate">{item.name || 'Unnamed Center'}</h3>
                              {getStatusBadge(item.is_verified_status)}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{item.registration_number || 'No reg. number'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                          <div className="text-lg font-bold text-slate-900">{item.total_campaigns ?? 0}</div>
                          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Campaigns</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                          <div className="text-lg font-bold text-slate-900">{item.total_donators ?? 0}</div>
                          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Donors</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                          <div className="text-lg font-bold text-slate-900">₦{item.recived || '0'}</div>
                          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Received</div>
                        </div>
                      </div>

                      {/* Address & Website */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <span className="truncate">{item.address || 'No address provided'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                          </svg>
                          <span className="truncate">{item.website || 'No website provided'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer - Click to view */}
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Click to view details</span>
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button onClick={() => {
              setIsEdit(false)
              setForm({
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
              setLogo(null)
              setDocuments([])
              setVerifiedAccountName(null)
              setBankSearchQuery('')
              setStages(3)
            }} disabled={centers.length >= 5} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${centers.length >= 5 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-900'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Center
            </button>
          </div>
          {centers.length >= 5 && <p className="text-center mt-2 text-xs text-red-500">Maximum limit reached</p>}
        </main>
      </div>
      <Footer />
    </>
  }


  else if(stages == 2 && selectedCenter){
    const item = selectedCenter
    const isVerified = item.is_verified_status?.toLowerCase() === "verified"

    return <>
      <NavBar />
      <div className="w-full min-h-screen bg-slate-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button 
            onClick={() => {
              setSelectedCenter(null)
              setStages(1)
            }}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Centers
          </button>

          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Logo */}
                <div className="shrink-0 w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {item.logourl ? (
                    <img 
                      src={item.logourl} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} 
                    />
                  ) : null}
                  <svg className={`w-8 h-8 text-slate-300 ${item.logourl ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-xl font-bold text-slate-900">{item.name || 'Unnamed Center'}</h1>
                    {getStatusBadge(item.is_verified_status)}
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{item.registration_number || 'No registration number'}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-3">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {item.email || 'No email'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {item.phone || 'No phone'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 border-t border-slate-100">
              <div className="p-4 text-center border-r border-slate-100">
                <div className="text-2xl font-bold text-slate-900">{item.total_campaigns ?? 0}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">Total Campaigns</div>
              </div>
              <div className="p-4 text-center border-r border-slate-100">
                <div className="text-2xl font-bold text-slate-900">{item.total_donators ?? 0}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">Total Donors</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">₦{item.recived || '0'}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">Total Received</div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {/* About */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">About</h3>
              <div className="relative">
                <div 
                  className="text-sm text-slate-600 leading-relaxed overflow-y-auto max-h-40 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                >
                  {item.about || 'No description provided.'}
                </div>
                {(item.about?.length || 0) > 300 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Location</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Address</p>
                    <p className="text-sm text-slate-600">{item.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Geo Location</p>
                    <p className="text-sm text-slate-600">{item.geo_location || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Website</p>
                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      {item.website || 'Not provided'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Bank Name</p>
                <p className="text-sm text-slate-900 mt-0.5">{item.bank_details?.bank_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Account Number</p>
                <p className="text-sm text-slate-900 mt-0.5">{item.bank_details?.account_number || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Account Name</p>
                <p className="text-sm text-slate-900 mt-0.5">{item.bank_details?.account_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Branch</p>
                <p className="text-sm text-slate-900 mt-0.5">{item.bank_details?.branch || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (isVerified) {
                  redirect(`/dashboard/centers/campaign?id=${item.id}`)
                }
              }}
              disabled={!isVerified}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 ${
                isVerified 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-900' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Run Campaign
            </button>

            <button
              onClick={() => {
                setIsEdit(true)
                setForm({
                  name: item.name,
                  website: item.website,
                  address: item.address,
                  geo_location: item.geo_location,
                  bank_details: item.bank_details,
                  about: item.about,
                  email: item.email,
                  phone: item.phone,
                  registration_number: item.registration_number
                })
                setLogo({ 
                  cloudinary: { url: item.logourl, publicId: "", width: 200, height: 200 },
                  originalName: "Logo"
                })
                setID(item.id)
                setDocuments(item.verification_documents?.map((d: any) => ({
                  cloudinary: { 
                    url: d.url, 
                    publicId: d.public_id, 
                    width: d.width, 
                    height: d.height 
                  },
                  originalName: d.originalname,
                  compression: d.compressed ? {
                    wasCompressed: true,
                    compressionRatio: d.compression_ratio,
                    originalSize: 0,
                    compressedSize: 0,
                    file: new File([], "")
                  } : undefined
                })) || [])
                setVerifiedAccountName(item.bank_details?.account_name || null)
                setBankSearchQuery(item.bank_details?.bank_name || '')
                setStages(3)
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit Center Details
            </button>
          </div>

          {!isVerified && (
            <p className="mt-3 text-xs text-amber-600 text-center">
              Campaign creation is only available for verified centers.
            </p>
          )}
        </main>
      </div>
      <Footer />
    </>
  }


  else if(stages == 3){
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-black">

              <div className="px-8 py-6 border-b border-gray-100">
                <h1 className="text-2xl font-semibold text-gray-900">{isEdit ? "Manage" : "Register"} Charity Center</h1>
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
                            <span className="text-sm">Uploading...</span>
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
                              <div className="text-xs text-gray-500 mt-0.5">Code: {bank.code} &middot; {bank.type}</div>
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
      </>
    )
  }

  // STAGE 4: Success
  else {
    return <>
      <NavBar />
      <div className= 'w-screen h-full bg-white' >
        <main className='my-50 flex flex-col justify-center items-center  bg-white '>
          <CheckCircle2 size={50} color='green' className='mx-auto my-10' />
          <p className="text-gray-600  text-center font-bold">Your Center has been {isEdit ? "Updated" : "Added"} , Pending Verification. </p>
          <Button variant='secondary' onClick={()=>redirect("/dashboard/donor?goto=charity")} size='lg' className='my-8' details="Go to Dashboard" />
        </main>
      </div>
      <Footer />
    </>
  }
}