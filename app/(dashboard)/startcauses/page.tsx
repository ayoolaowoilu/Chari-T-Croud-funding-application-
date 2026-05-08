"use client"

import NavBar from "@/app/components/layout/NavBar"
import Button from "@/app/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { redirect } from "next/navigation"
import { uploadImage } from "@/app/lib/upload"
import { 
  ArrowRight, 
  FileText, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  Calendar, 
  Type,
  ChevronRight,
  Sparkles,
  Trash2,
  Globe,
  Wallet,
  Clock,
  Loader2,
  XCircleIcon,
  ImagePlus,
  Compass,
  Info,
  RotateCcw,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { FetchProfile, uploadCause} from "@/app/lib/fetchRequests"
import { getAll, remove, save } from "@/app/lib/indexedDb"
import { CloudinaryImage, UserData } from "@/app/lib/types"
import BankVerification from "@/app/components/layout/bankVerification"
import { DualRingSpinner } from "@/app/components/ui/loading"
import LocationAutocomplete from "@/app/components/locationAutoComplete"
import Footer from "@/app/components/layout/footer"
import { compressImageIfNeeded, validateImageFile, formatFileSize, MAX_FILE_SIZE } from "@/app/lib/imageCompression"


interface UploadingImage extends CloudinaryImage {
  compressionStatus?: 'checking' | 'compressing' | 'compressed' | 'original' | 'failed';
  originalSize?: number;
  compressedSize?: number;
  compressionError?: string;
}

export default function Page() {
  const [stages, setStages] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [Did, setDid] = useState<number | null>(null)
  const [drafts, setDrafts] = useState<any[]>([])
 
  // Form state
  const [causeName, setCauseName] = useState("")
  const [details, setDetails] = useState("")
  const [story, setStory] = useState("")
  const [goal, setGoal] = useState<number | undefined>()
  const [currency, setCurrency] = useState<"NG">("NG")
  const [deadline, setDeadline] = useState<number | undefined>()
  const [category, setCategory] = useState<"Education" | "Community" | "CroudFunding" | "Business" | "Health">()
  const [images, setImages] = useState<UploadingImage[]>([])
  const [mainImage, setMainImage] = useState<UploadingImage | undefined>()
  const [location, setLocation] = useState("")

  // Error & loading state
  const [errorType, setErrorType] = useState<"M_IMG" | "IMGS" | "NET" | "UPLOAD_IMG" | "UPLOAD_ERR" | "LOAD" | "IVP" | "C404" | "UVF" | "FOR" | "UEX">()
  const [errorMsg, setErrorMsg] = useState("")
  const [error, SetError] = useState(false)
  const [Edit, setEdit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData>()
  
  // Upload-specific state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<string[]>([])
  const [compressionStats, setCompressionStats] = useState<{total: number, compressed: number, saved: number} | null>(null)

  const { data: session , status } = useSession();


  const fetchUserData = async () => {
if (status !== 'authenticated') return;
  if (!session?.user?.email) return;
    setLoading(true)
    SetError(false)
    try {
      console.log(session)
      const resp = await FetchProfile(session.user.email as string)
      console.log(resp)
      if (resp.error) {
        setErrorMsg(resp.error)
        SetError(true)
      } else {
        
        setUserData(resp.userData)
        if (!resp.userData.bank_details) {
          setEdit(true)
        } else if (!resp.kyc) {
          window.location.href = "/dashboard/kyc?redir=/startcauses"
        }
      }
    } catch (error) {
      console.error(error)
      setErrorMsg("Failed to fetch user data. Please check your network connection and try again.")
      SetError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(status !== "authenticated") return;
    fetchUserData()
  }, [session])

 
  useEffect(() => {
    const getDrafts = async () => {
      const saved = await getAll()
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setDrafts(Array.isArray(parsed) ? parsed : [parsed])
        } catch {
          setDrafts(Array.isArray(saved) ? saved : [saved])
        }
      }
    }
    getDrafts()
  }, [])


  const saveToStorage = useCallback(async (data?: any) => {
    const draftData = {
      id: Did || Math.floor(Math.random() * 1000000),
      updatedAt: Date.now(),
      causeName, details, story, goal, currency, deadline,
      images, mainImage, category, location,
      ...data
    }

    if (Did) {
      await remove(Did)
      await save(draftData)
      setDrafts(prev => {
        const filtered = prev.filter((d: any) => d.id !== Did)
        return [...filtered, draftData]
      })
    } else {
      setDid(draftData.id)
      await save(draftData)
    }
  }, [Did, causeName, details, story, goal, currency, deadline, images, mainImage, category, location])

  useEffect(() => {
    if (causeName && details && Did) {
      const timeout = setTimeout(() => saveToStorage(), 2000)
      return () => clearTimeout(timeout)
    }
  }, [images, mainImage, causeName, details, story, goal, deadline, category, location, saveToStorage, Did])


  const handleNext = () => {
    if (stages < 6) {
      if (stages === 2 || stages === 3) saveToStorage()
      setStages(prev => (prev + 1) as 2 | 3 | 4 | 5 | 6)
    }
  }

  const handleBack = () => {
    if (stages > 1) {
      setStages(prev => (prev - 1) as 1 | 2 | 3 | 4 | 5)
    }
  }

  document.title = "Start A Cause | Chari-T"
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setCompressionStats(null)
    let totalSaved = 0
    let compressedCount = 0
    const newQueue: string[] = []

    for (const file of Array.from(files)) {
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      newQueue.push(uploadId)
      
   
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setErrorType("UPLOAD_IMG")
        setErrorMsg(validation.error!)
        setIsUploading(false)
        e.target.value = ''
        return
      }

      setImages(prev => [...prev, {
        url: '',
        publicId: uploadId,
        isUploading: true,
        uploadProgress: 0,
        compressionStatus: 'checking',
      }])

      try {
        let fileToUpload = file
        let compressionResult: any = null

        if (file.size > MAX_FILE_SIZE) {
          setImages(prev => 
            prev.map(img => 
              img.publicId === uploadId
                ? { ...img, compressionStatus: 'compressing', uploadProgress: 5 }
                : img
            )
          )

          compressionResult = await compressImageIfNeeded(file, (progress) => {
            setImages(prev => 
              prev.map(img => 
                img.publicId === uploadId
                  ? { ...img, uploadProgress: 5 + (progress * 0.35) }
                  : img
              )
            )
          })

          fileToUpload = compressionResult.file
          totalSaved += (compressionResult.originalSize - compressionResult.compressedSize)
          compressedCount++

          setImages(prev => 
            prev.map(img => 
              img.publicId === uploadId
                ? { 
                    ...img, 
                    compressionStatus: 'compressed', 
                    uploadProgress: 40,
                    originalSize: compressionResult.originalSize,
                    compressedSize: compressionResult.compressedSize,
                  }
                : img
            )
          )
        } else {
          setImages(prev => 
            prev.map(img => 
              img.publicId === uploadId
                ? { ...img, compressionStatus: 'original', uploadProgress: 40 }
                : img
            )
          )
        }


        setImages(prev => 
          prev.map(img => 
            img.publicId === uploadId
              ? { ...img, uploadProgress: 45 }
              : img
          )
        )

        const formData = new FormData()
        formData.append('file', fileToUpload)
        formData.append('originalName', file.name)

        const result = await uploadImage(formData)


        setImages(prev => 
          prev.map(img => 
            img.publicId === uploadId
              ? { 
                  url: result.url, 
                  publicId: result.publicId, 
                  isUploading: false, 
                  uploadProgress: 100,
                  compressionStatus: compressionResult?.wasCompressed ? 'compressed' : 'original',
                  originalSize: compressionResult?.originalSize,
                  compressedSize: compressionResult?.compressedSize,
                }
              : img
          )
        )

    
        setMainImage(prev => prev || {
          url: result.url,
          publicId: result.publicId,
          isUploading: false,
          uploadProgress: 100,
        })

      } catch (error: any) {
        
        setImages(prev => prev.filter(img => img.publicId !== uploadId))
        
        const errorMessage =  `Failed to upload ${file.name}`
        setErrorType("UPLOAD_IMG")
        setErrorMsg(errorMessage)
        
        // Auto-clear error after 8 seconds
        setTimeout(() => {
          setErrorType(undefined)
          setErrorMsg("")
        }, 8000)
      }
    }


    if (compressedCount > 0) {
      setCompressionStats({
        total: files.length,
        compressed: compressedCount,
        saved: totalSaved,
      })
    }

    setUploadQueue([])
    setIsUploading(false)
    e.target.value = ''
  }


  const removeImage = (idx: number) => {
    const removed = images[idx]
    const filtered = images.filter((_, i) => i !== idx)
    setImages(filtered)
    
    if (mainImage?.publicId === removed.publicId) {
      setMainImage(filtered.length > 0 ? { ...filtered[0] } : undefined)
    }
  }


  const setAsMain = (img: UploadingImage) => {
    if (img.isUploading) return
    setMainImage({ ...img })
  }

  const generateDeadlineNumber = (days: number): number => {
    const oneDay = 60 * 60 * 24 * 1000
    return (oneDay * days) + Date.now()
  }

  useEffect(()=>{
     window.scrollTo({ top: 0, behavior: 'smooth' })
  },[stages])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const uploadingImages = images.filter(img => img.isUploading)
      if (uploadingImages.length > 0) {
        setErrorType("UPLOAD_IMG")
        setErrorMsg("Please wait for all images to finish uploading.")
        setStages(3)
        return
      }

      if (!mainImage) {
        setErrorType("M_IMG")
        setErrorMsg("Please select a main cover image.")
        setStages(3)
        return
      }

      const uploadPayload = {
        name: causeName,
        details: details,
        story: story,
        goal: Number(goal),
        currency: currency,
        deadline: generateDeadlineNumber(deadline as number),
        mainImage: mainImage,
        images: images,
        user_email: session?.user?.email,
        category: category as "Education" | "Community" | "CroudFunding" | "Business" | "Health",
        location: location,
        bank_details: userData?.bank_details as UserData["bank_details"],  
      }
     
      const resp = await uploadCause(uploadPayload)
   
      if (Did) {
        await remove(Did as number)
      }
      
      if (resp.error) {
        throw new Error(resp.error)
      }
      
      setStages(5)
    } catch (error: any) {
      setErrorType("UPLOAD_ERR")
      setErrorMsg(`Failed to submit cause. ${error?.message || "Please try again"}`)
      setStages(6)
    } finally {
      setIsSubmitting(false)
    }
  }


  const renderStage1 = () => (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Drafts</h1>
        <p className="text-gray-500">Continue where you left off or start a new cause</p>
      </div>

      {drafts.length === 0 ? (
        <div className="border-dashed border-4 border-gray-500 rounded-xl">
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No drafts yet</h3>
              <p className="text-gray-500 mb-8">Start creating your first fundraising cause</p>
              <Button variant="primary" size="lg" onClick={() => setStages(2)} details="Create New Cause"/>
            </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(draft.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 truncate text-lg">
                {draft.causeName || "Untitled Cause"}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
                {draft.details || "No description provided"}
              </p>
              <div className="flex justify-between items-center">
                <div 
                  onClick={() => loadDraft(draft)}
                  className="flex items-center text-sm text-blue-600 font-semibold cursor-pointer hover:text-blue-700"
                >
                  Continue Editing <ChevronRight className="w-4 h-4 ml-1" />
                </div>
                <button 
                  onClick={async () => {
                    await remove(draft.id)
                    setDrafts(drafts.filter((d: any) => d.id !== draft.id))
                  }}
                  className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          
          <div 
            className="flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 hover:bg-gray-100 transition-all cursor-pointer min-h-60"
            onClick={() => setStages(2)}
          >
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
              <Sparkles className="w-5 h-5 text-gray-600" />
            </div>
            <span className="font-semibold text-gray-700">Create New Cause</span>
            <span className="text-sm text-gray-400 mt-1">Start fresh campaign</span>
          </div>
        </div>
      )}
    </div>
  )

  // Helper to load draft
  const loadDraft = (draft: any) => {
    setCauseName(draft.causeName || "")
    setDetails(draft.details || "")
    setStory(draft.story || "")
    setGoal(draft.goal)
    setCurrency(draft.currency || "NG")
    setDeadline(draft.deadline)
    setImages(draft.images || [])
    setMainImage(draft.mainImage)
    setDid(draft.id)
    setCategory(draft.category)
    setLocation(draft.location)
    setStages(2)
  }

  // ─── Stage 2: Cause Details ─────────────────────────────────────
  const renderStage2 = () => (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cause Details</h2>
        <p className="text-gray-500">Provide the essential information about your campaign</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
        {/* Cause Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Type className="w-4 h-4 text-gray-500" />
            Cause Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={causeName}
            onChange={(e) => setCauseName(e.target.value)}
            placeholder="e.g., Build a Community Library"
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
          />
          <p className="text-xs text-gray-400 text-right">{causeName.length}/100</p>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4 text-gray-500" />
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Brief overview of your cause..."
            rows={3}
            maxLength={300}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400 text-gray-900"
          />
          <p className="text-xs text-gray-400 text-right">{details.length}/300</p>
        </div>

        {/* Full Story */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Globe className="w-4 h-4 text-gray-500" />
            Full Story <span className="text-red-500">*</span>
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Share the complete story behind your cause, why it matters, and how funds will be used..."
            rows={6}
            maxLength={5000}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400 text-gray-900"
          />
          <p className="text-xs text-gray-400 text-right">{story.length}/5000</p>
        </div>

        {/* Location */}
        <LocationAutocomplete onChange={setLocation} value={location} />

        {/* Category */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Globe className="w-4 h-4 text-gray-500" />
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="px-3 py-3 rounded-lg border border-gray-300 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-700"
          >
            <option value="">Select a category</option>
            <option value="CroudFunding">Crowdfunding</option>
            <option value="Education">Education</option>
            <option value="Community">Community</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
          </select>
        </div>
         
        {/* Goal & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Wallet className="w-4 h-4 text-gray-500" />
              Funding Goal <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "NG")}
                className="px-3 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-700"
              >
                <option value="NG">NGN (₦)</option>
              </select>
              <input
                type="number"
                value={goal || ""}
                onChange={(e) => setGoal(Number(e.target.value))}
                placeholder="0.00"
                min={1000}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>
          </div> 

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Clock className="w-4 h-4 text-gray-500" />
              Campaign Duration <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={deadline || ""}
                onChange={(e) => setDeadline(Number(e.target.value))}
                placeholder="30"
                min={1}
                max={365}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleNext}
          disabled={!causeName || !details || !goal || !story || !location || !category || !deadline}
          details="Continue"
        />
      </div>
    </div>
  )

  // ─── Stage 3: Image Upload ──────────────────────────────────────
  const renderStage3 = () => (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Images</h2>
        <p className="text-gray-500">Add compelling visuals to support your cause</p>
      </div>

      {/* Compression Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Smart Image Compression</h4>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Images larger than <strong>1MB</strong> are automatically compressed before upload. 
            Your image quality is preserved while ensuring fast uploads.
          </p>
        </div>
      </div>

      {/* Error Toast */}
      {errorType === "UPLOAD_IMG" && errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">{errorMsg}</p>
            {errorMsg.includes('too large') && (
              <p className="text-xs text-red-600 mt-1">
                💡 Tip: Try resizing your image to under 1920px wide, or use JPG instead of PNG.
              </p>
            )}
          </div>
          <button 
            onClick={() => { setErrorType(undefined); setErrorMsg(""); }}
            className="text-red-400 hover:text-red-600"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Compression Stats */}
      {compressionStats && compressionStats.compressed > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Compass className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">
            <strong>{compressionStats.compressed}</strong> image(s) compressed, saving{' '}
            <strong>{formatFileSize(compressionStats.saved)}</strong> of upload data.
          </p>
          <button 
            onClick={() => setCompressionStats(null)}
            className="ml-auto text-green-400 hover:text-green-600"
          >
            <XCircleIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                mainImage?.publicId === img.publicId && !img.isUploading
                  ? 'border-blue-500 ring-2 ring-blue-100' 
                  : img.isUploading 
                    ? 'border-gray-200 opacity-80' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => !img.isUploading && setAsMain(img)}
            >
              {img.isUploading ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-3">
                  {img.compressionStatus === 'compressing' ? (
                    <>
                      <Compass className="w-6 h-6 text-amber-500 animate-pulse mb-2" />
                      <span className="text-xs text-amber-600 font-semibold text-center">
                        Compressing...
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1 text-center">
                        {img.originalSize ? formatFileSize(img.originalSize) : 'Large image'} → &lt;1MB
                      </span>
                    </>
                  ) : img.compressionStatus === 'checking' ? (
                    <>
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                      <span className="text-xs text-blue-600 font-semibold">Checking size...</span>
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                      <span className="text-xs text-blue-600 font-semibold">Uploading...</span>
                    </>
                  )}
                  
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(img.uploadProgress, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">{Math.round(Math.min(img.uploadProgress, 100))}%</span>
                </div>
              ) : (
                <>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  
                  {/* Compression badge */}
                  {img.compressionStatus === 'compressed' && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <Compass className="w-3 h-3" />
                      Compressed
                    </div>
                  )}

                  {/* Main image badge */}
                  {mainImage?.publicId === img.publicId && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> Main
                    </div>
                  )}
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(idx)
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white text-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 shadow-sm border border-gray-200"
                    style={mainImage?.publicId === img.publicId ? { top: '2.5rem' } : {}}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Size info tooltip */}
                  {img.compressedSize && img.originalSize && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      {formatFileSize(img.originalSize)} → {formatFileSize(img.compressedSize)}
                    </div>
                  )}

                  {/* Set as main overlay */}
                  {mainImage?.publicId !== img.publicId && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                      <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
                        Set as Main
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Upload Button */}
          <label className={`aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all group ${
            isUploading ? 'opacity-50 pointer-events-none' : ''
          }`}>
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
            ) : (
              <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
            )}
            <span className="text-sm text-gray-500 group-hover:text-blue-600 font-medium">
              {isUploading ? 'Processing...' : 'Upload'}
            </span>
            <span className="text-[10px] text-gray-400 mt-1">Max 1MB each</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Helper Text */}
        {images.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>
              {images.some(img => img.isUploading) 
                ? "Please wait for all images to finish uploading..." 
                : images.length > 1 
                  ? `Click any image to set as the main cover photo. ${images.length} image(s) uploaded.`
                  : "Click the image to set as main cover photo."
              }
            </span>
          </div>
        )}

        {/* Empty state hint */}
        {images.length === 0 && !isUploading && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No images yet. Upload at least one image to continue.</p>
            <p className="text-gray-400 text-xs mt-1">Supported: JPG, PNG, WEBP, GIF (max 1MB each)</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" size="lg" onClick={handleBack} details="Back" />
      
        <button 
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors"
          onClick={handleNext}
          disabled={images.length === 0 || images.some(img => img.isUploading) || !mainImage}
        >
          {images.some(img => img.isUploading) ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>
      </div>
    </div>
  )

  // ─── Stage 4: Review ────────────────────────────────────────────
  const renderStage4 = () => (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Review Your Cause</h2>
        
        <div className="space-y-8">
          {/* Main Image */}
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {mainImage ? (
              <img src={mainImage.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Cause Name */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cause Name</h3>
            <p className="text-xl font-bold text-gray-900">{causeName || "Untitled Cause"}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Target className="w-3 h-3" /> Funding Goal
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {currency === "NG" && "₦"}
                {goal?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Duration
              </h3>
              <p className="text-2xl font-bold text-gray-900">{deadline || "0"} days</p>
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                {category}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h3>
              <p className="text-gray-900 font-medium">{location}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{details || "No description provided"}</p>
          </div>

          {/* Story */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Story</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story || "No story provided"}</p>
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Image Gallery ({images.length})</h3>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${
                    mainImage?.publicId === img.publicId ? 'border-blue-500' : 'border-gray-200'
                  }`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
          <Button variant="secondary" size="md" onClick={() => setStages(2)} details="Edit Details" />
          <Button variant="secondary" size="md" onClick={() => setStages(3)} details="Edit Images" />

          <button 
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Publish Cause <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  
  const renderStage5 = () => (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl border border-green-200 shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cause Published!</h2>
        <p className="text-gray-600 mb-8">
          Your cause <span className="font-semibold text-gray-900">"{causeName}"</span> has been successfully created and is now live.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Funding Goal</span>
            <span className="font-semibold text-gray-900">
              {currency === "NG" && "₦"}
              {goal?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duration</span>
            <span className="font-semibold text-gray-900">{deadline} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Images</span>
            <span className="font-semibold text-gray-900">{images.length} uploaded</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Category</span>
            <span className="font-semibold text-gray-900">{category}</span>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={() => redirect("/dashboard/donor")} details="Go to Dashboard"/>
      </div>
    </div>
  )

  const renderStage6 = () => (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Submission Error</h2>
        
        {errorType === "UPLOAD_IMG" && errorMsg?.includes('compress') ? (
          <>
            <p className="text-gray-600 mb-2 font-medium">Image too large to compress</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-left">
              <p className="text-sm text-amber-800">{errorMsg}</p>
              <p className="text-xs text-amber-600 mt-2">
                💡 Tip: Try resizing your image to under 1920px wide, or use a JPG instead of PNG.
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-600 mb-2 font-medium">
            {errorType === "M_IMG" && "Main image is required"}
            {errorType === "IMGS" && "At least one image is required"}
            {errorType === "NET" && "Network connection error"}
            {errorType === "UPLOAD_IMG" && "Failed to upload images"}
            {errorType === "UPLOAD_ERR" && "Upload failed"}
            {errorType === "LOAD" && "Failed to load data"}
            {errorType === "IVP" && "Invalid parameters"}
            {errorType === "C404" && "Cause not found"}
            {errorType === "UVF" && "User verification failed"}
            {errorType === "FOR" && "Forbidden"}
            {errorType === "UEX" && "Unknown error"}
          </p>
        )}
        
        {errorMsg && !errorMsg.includes('compress') && (
          <p className="text-gray-500 text-sm">{errorMsg}</p>
        )}
        
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" size="md" onClick={handleBack} details="Go Back" />
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => {
              setErrorType(undefined)
              setErrorMsg("")
              setStages(errorType === "UPLOAD_IMG" ? 3 : 4)
            }}
            details="Try Again"
          />
        </div>
      </div>
    </div>
  )


  const renderProgress = () => {
    const steps = [
      { num: 1, label: 'Drafts' },
      { num: 2, label: 'Details' },
      { num: 3, label: 'Images' },
      { num: 4, label: 'Review' },
      { num: 5, label: 'Publish' },
    ]

    const currentStep = stages === 6 ? 4 : stages

    return (
      <div className="w-full fixed top-14">
        <div className="flex items-center justify-between relative">
       
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 -translate-y-1/2 " />
          
        
          <div 
            className="absolute top-1/2 left-0 h-2 bg-blue-600 -translate-y-1/2  transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
         
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <BankVerification 
        isOpen={Edit} 
        onClick={() => {}}
        bankName=""
        accountNumber=""
      />

      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <DualRingSpinner />
        </div>
      ) : error ? (
        <div className="w-full h-60 flex flex-col items-center justify-center px-4">
          <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4 text-center max-w-md">{errorMsg}</p>
          <Button variant="primary" size="md" onClick={fetchUserData} details="Retry" />
        </div>
      ) : (
        <main className="pt-10 pb-16">
          {stages !== 1 && stages !== 5 && stages !== 6 && renderProgress()}
          
          {stages === 1 && renderStage1()}
          {stages === 2 && renderStage2()}
          {stages === 3 && renderStage3()}
          {stages === 4 && renderStage4()}
          {stages === 5 && renderStage5()}
          {stages === 6 && renderStage6()}
        </main>
      )}
       
      <Footer />
    </div>
  )
}
