"use client"

import NavBar from "@/app/components/layout/NavBar"
import Button from "@/app/components/ui/button"
import { useState, useEffect, useCallback, useRef } from "react"
import { redirect } from "next/navigation"
import { uploadImage } from "@/app/lib/upload"
import { 
  ArrowRight, 
  FileText, 
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
  XCircle,
  ImagePlus,
  Compass,
  Info,
  MapPin,
  Tag,
  BookOpen,
  Banknote,
  Layers,
  RotateCcw,
  ExternalLink,
  Eye,
  Pencil,
  Save,
  Zap,
  Upload,
  X,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { FetchProfile, uploadCause } from "@/app/lib/fetchRequests"
import { getAll, remove, save } from "@/app/lib/indexedDb"
import { CloudinaryImage, UserData } from "@/app/lib/types"
import BankVerification from "@/app/components/layout/bankVerification"
import { DualRingSpinner } from "@/app/components/ui/loading"
import LocationAutocomplete from "@/app/components/locationAutoComplete"
import Footer from "@/app/components/layout/footer"
import { compressImageIfNeeded, validateImageFile, formatFileSize, MAX_FILE_SIZE } from "@/app/lib/imageCompression"
import { CampaignPayload } from "../dashboard/centers/campaign/page"

interface UploadingImage extends CloudinaryImage {
  compressionStatus?: 'checking' | 'compressing' | 'compressed' | 'original' | 'failed';
  originalSize?: number;
  compressedSize?: number;
  compressionError?: string;
}

interface DraftData {
  id: number;
  updatedAt: number;
  causeName: string;
  details: string;
  story: string;
  goal: number | undefined;
  currency: string;
  deadline: number | undefined;
  images: UploadingImage[];
  mainImage: UploadingImage | undefined;
  category: string;
  location: string;
}

type ErrorType = "M_IMG" | "IMGS" | "NET" | "UPLOAD_IMG" | "UPLOAD_ERR" | "LOAD" | "IVP" | "C404" | "UVF" | "FOR" | "UEX" | null;

const CATEGORIES = [
  { value: "Education", label: "Education", icon: BookOpen, description: "Schools, scholarships & training programs", color: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300" },
  { value: "Community", label: "Community", icon: Globe, description: "Local development & community support", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300" },
  { value: "Crowdfunding", label: "Crowdfunding", icon: Zap, description: "General fundraising projects", color: "bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-300" },
  { value: "Business", label: "Business", icon: Banknote, description: "Startups & economic growth initiatives", color: "bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-300" },
  { value: "Health", label: "Health", icon: Target, description: "Medical aid & wellness programs", color: "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300" },
];

const STEPS = [
  { id: 1, label: "Drafts", description: "Continue or start new" },
  { id: 2, label: "Details", description: "Name, story & goal" },
  { id: 3, label: "Images", description: "Upload visuals" },
  { id: 4, label: "Review", description: "Verify everything" },
  { id: 5, label: "Publish", description: "Go live" },
];

export default function StartCausePage() {
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [draftId, setDraftId] = useState<number | null>(null)
  const [drafts, setDrafts] = useState<DraftData[]>([])
  

  const [causeName, setCauseName] = useState("")
  const [details, setDetails] = useState("")
  const [story, setStory] = useState("")
  const [goal, setGoal] = useState<number | undefined>()
  const [currency, setCurrency] = useState<"NG">("NG")
  const [deadline, setDeadline] = useState<number | undefined>()
  const [category, setCategory] = useState<string>("")
  const [images, setImages] = useState<UploadingImage[]>([])
  const [mainImage, setMainImage] = useState<UploadingImage | undefined>()
  const [location, setLocation] = useState("")

  const [errorType, setErrorType] = useState<ErrorType>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [hasError, setHasError] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [copied, setCopied] = useState(false)

  const [isUploading, setIsUploading] = useState(false)
  const [compressionStats, setCompressionStats] = useState<{total: number, compressed: number, saved: number} | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())

  const { data: session, status } = useSession();
    const [link ,setLink]= useState(``)

 
  useEffect(() => {
    return () => {
      abortControllersRef.current.forEach(ctrl => ctrl.abort())
      abortControllersRef.current.clear()
    }
  }, [])


  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = link
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  } , [link])


  const fetchUserData = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.email) {
      if (status === 'unauthenticated') setLoading(false)
      return
    }

    setLoading(true)
    setHasError(false)

    try {
      const resp = await FetchProfile(session.user.email)
      if (resp?.error) {
        setErrorMsg(resp.error)
        setHasError(true)
      } else {
        setUserData(resp.userData)
        if (!resp.userData?.bank_details) {
          setShowBankModal(true)
        } else if (!resp.kyc) {
          window.location.href = "/dashboard/kyc?redir=/startcauses"
        }
      }
    } catch (err) {
      setErrorMsg("Failed to fetch user data. Please check your connection and try again.")
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }, [session, status])

  useEffect(() => {
    if (status !== "loading") {
      fetchUserData()
    }
  }, [fetchUserData, status])

  // Load drafts
  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const saved = await getAll()
        if (saved) {
          let parsed: any[]
          try {
            parsed = JSON.parse(saved)
            if (!Array.isArray(parsed)) parsed = [parsed]
          } catch {
            parsed = Array.isArray(saved) ? saved : [saved]
          }
          setDrafts(parsed.filter(d => d && typeof d === 'object'))
        }
      } catch (err) {
        console.error("Failed to load drafts:", err)
      }
    }
    loadDrafts()
  }, [])

  const saveToStorage = useCallback(async (data?: Partial<DraftData>) => {
    if (!causeName.trim() && !details.trim()) return

    setAutoSaveStatus("saving")

    const draftData: DraftData = {
      id: draftId || Math.floor(Math.random() * 1000000),
      updatedAt: Date.now(),
      causeName,
      details,
      story,
      goal,
      currency,
      deadline,
      images,
      mainImage,
      category,
      location,
      ...data,
    }

    try {
      if (draftId) {
        await remove(draftId)
      }
      await save(draftData)
      if (!draftId) setDraftId(draftData.id)

      setDrafts(prev => {
        const filtered = prev.filter((d: any) => d.id !== draftData.id)
        return [...filtered, draftData]
      })
      setAutoSaveStatus("saved")
      setTimeout(() => setAutoSaveStatus("idle"), 2000)
    } catch (err) {
      console.error("Auto-save failed:", err)
      setAutoSaveStatus("idle")
    }
  }, [draftId, causeName, details, story, goal, currency, deadline, images, mainImage, category, location])

  // Auto-save debounce
  useEffect(() => {
    if (stage === 2 && (causeName || details)) {
      const timeout = setTimeout(() => saveToStorage(), 3000)
      return () => clearTimeout(timeout)
    }
  }, [causeName, details, story, goal, deadline, category, location, saveToStorage, stage])

  const handleNext = () => {
    if (stage < 5) {
      if (stage === 2 || stage === 3) saveToStorage()
      setStage(prev => (prev + 1) as 2 | 3 | 4 | 5 | 6)
    }
  }

  const handleBack = () => {
    if (stage > 1) {
      setStage(prev => (prev - 1) as 1 | 2 | 3 | 4 | 5)
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stage])

  useEffect(() => {
    document.title = "Start A Cause | Chari-T"
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setCompressionStats(null)
    let totalSaved = 0
    let compressedCount = 0

    for (const file of Array.from(files)) {
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const validation = validateImageFile(file)
      if (!validation.valid) {
        setErrorType("UPLOAD_IMG")
        setErrorMsg(validation.error || "Invalid image file")
        setIsUploading(false)
        e.target.value = ''
        return
      }

 
      const abortCtrl = new AbortController()
      abortControllersRef.current.set(uploadId, abortCtrl)

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
            if (abortCtrl.signal.aborted) throw new Error("Upload cancelled")
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

        if (abortCtrl.signal.aborted) throw new Error("Upload cancelled")

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

        if (abortCtrl.signal.aborted) throw new Error("Upload cancelled")

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
        if (error.message === "Upload cancelled") {
          setImages(prev => prev.filter(img => img.publicId !== uploadId))
          continue
        }

        setImages(prev => prev.filter(img => img.publicId !== uploadId))
        setErrorType("UPLOAD_IMG")
        setErrorMsg(`Failed to upload "${file.name}". ${"Check internet connection"}`)

        setTimeout(() => {
          setErrorType(null)
          setErrorMsg("")
        }, 8000)
      } finally {
        abortControllersRef.current.delete(uploadId)
      }
    }

    if (compressedCount > 0) {
      setCompressionStats({
        total: files.length,
        compressed: compressedCount,
        saved: totalSaved,
      })
    }

    setIsUploading(false)
    e.target.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (!files?.length) return

    const dt = new DataTransfer()
    for (const file of Array.from(files)) {
      dt.items.add(file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setHasError(false)

    try {
      const uploadingImages = images.filter(img => img.isUploading)
      if (uploadingImages.length > 0) {
        setErrorType("UPLOAD_IMG")
        setErrorMsg("Please wait for all images to finish uploading before publishing.")
        setStage(3)
        return
      }

      if (!mainImage) {
        setErrorType("M_IMG")
        setErrorMsg("Please select a main cover image for your cause.")
        setStage(3)
        return
      }

      if (!goal || goal < 1000) {
        setErrorType("IVP")
        setErrorMsg("Funding goal must be at least ₦1,000.")
        setStage(2)
        return
      }

      if (!deadline || deadline < 1) {
        setErrorType("IVP")
        setErrorMsg("Campaign duration must be at least 1 day.")
        setStage(2)
        return
      }

      const uploadPayload = {
        name: causeName.trim(),
        details: details.trim(),
        story: story.trim(),
        goal: Number(goal),
        currency: currency,
        deadline: generateDeadlineNumber(deadline),
        mainImage: mainImage,
        images: images,
        user_email: session?.user?.email,
        category: category as CampaignPayload["category"],
        location: location.trim(),
        bank_details: userData?.bank_details as UserData["bank_details"],  
      }

      const resp = await uploadCause(uploadPayload)

         const causeId = JSON.parse(resp).id
         console.log(causeId , resp)
  setLink(`${window.location.origin}/causes/cause?id=${causeId}`)
  console.log(causeId , resp)

      if (draftId) {
        await remove(draftId)
      }

      if (resp?.error) {
        throw new Error(resp.error)
      }

   

      setStage(5)
    } catch (error: any) {
      setErrorType("UPLOAD_ERR")
      setErrorMsg(`Failed to publish cause. ${"Please try again."}`)
      setStage(6)
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadDraft = (draft: DraftData) => {
    setCauseName(draft.causeName || "")
    setDetails(draft.details || "")
    setStory(draft.story || "")
    setGoal(draft.goal)
    setCurrency("NG")
    setDeadline(draft.deadline)
    setImages(draft.images || [])
    setMainImage(draft.mainImage)
    setDraftId(draft.id)
    setCategory(draft.category || "")
    setLocation(draft.location || "")
    setStage(2)
  }

  const deleteDraft = async (id: number) => {
    try {
      await remove(id)
      setDrafts(prev => prev.filter(d => d.id !== id))
      if (draftId === id) {
        setDraftId(null)
      }
    } catch (err) {
      console.error("Failed to delete draft:", err)
    }
  }

  const resetForm = () => {
    setStage(1)
    setDraftId(null)
    setCauseName("")
    setDetails("")
    setStory("")
    setGoal(undefined)
    setDeadline(undefined)
    setCategory("")
    setImages([])
    setMainImage(undefined)
    setLocation("")
    setErrorType(null)
    setErrorMsg("")
    setHasError(false)
    setCompressionStats(null)
  }


  const isStage2Valid = causeName.trim().length >= 3 && 
                        details.trim().length >= 10 && 
                        story.trim().length >= 15 &&
                        !!goal && goal >= 1000 &&
                        !!deadline && deadline >= 1 &&
                        !!category &&
                        location.trim().length > 0

  const isStage3Valid = images.length > 0 && !images.some(img => img.isUploading) && !!mainImage


  const renderStage1 = () => (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Drafts</h1>
          </div>
        </div>
        <p className="text-slate-500 ml-13">Continue where you left off or start a fresh campaign</p>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="text-center py-20 px-8">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No drafts yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start creating your first fundraising cause and make a real impact in your community.</p>
            <button 
              onClick={() => setStage(2)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <Sparkles className="w-5 h-5" />
              Create New Cause
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft, index) => (
            <div 
              key={draft.id || index} 
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer shadow-sm"
              onClick={() => loadDraft(draft)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <FileText className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                    {new Date(draft.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-2 truncate text-lg">
                {draft.causeName || "Untitled Cause"}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed min-h-10">
                {draft.details || "No description provided yet"}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="flex items-center text-sm text-slate-900 font-semibold group-hover:text-slate-700 transition-colors">
                  Continue Editing <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteDraft(draft.id)
                  }}
                  className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Delete draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setStage(2)}
            className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6 hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer min-h-65 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
              <Sparkles className="w-6 h-6 text-slate-600" />
            </div>
            <span className="font-bold text-slate-700 text-lg">Create New Cause</span>
            <span className="text-sm text-slate-400 mt-1">Start a fresh campaign</span>
          </button>
        </div>
      )}
    </div>
  )

  const renderStage2 = () => (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Cause Details</h2>
        <p className="text-slate-500">Provide the essential information about your campaign</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
        {/* Auto-save indicator */}
        <div className="flex items-center justify-end gap-2 -mt-4">
          {autoSaveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving draft...
            </span>
          )}
          {autoSaveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              Draft saved
            </span>
          )}
        </div>

        {/* Cause Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Type className="w-4 h-4 text-slate-500" />
            Cause Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={causeName}
            onChange={(e) => setCauseName(e.target.value)}
            placeholder="e.g., Build a Community Library"
            maxLength={100}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
          />
          <div className="flex justify-between">
            <p className="text-xs text-slate-500">Keep it clear and compelling</p>
            <p className="text-xs text-slate-400">{causeName.length}/100</p>
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FileText className="w-4 h-4 text-slate-500" />
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="A brief overview that appears in search results and previews..."
            rows={3}
            maxLength={300}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400 text-slate-900"
          />
          <p className="text-xs text-slate-400 text-right">{details.length}/300</p>
        </div>

        {/* Full Story */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BookOpen className="w-4 h-4 text-slate-500" />
            Full Story <span className="text-red-500">*</span>
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Share the complete story — why this matters, who it helps, and how the funds will make a difference..."
            rows={8}
            maxLength={5000}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400 text-slate-900"
          />
          <div className="flex justify-between">
            <p className="text-xs text-slate-500">Be specific and emotional — stories drive donations</p>
            <p className="text-xs text-slate-400">{story.length}/5000</p>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <MapPin className="w-4 h-4 text-slate-500" />
           
          </label>
          <LocationAutocomplete onChange={setLocation} value={location} />
        </div>

        {/* Category */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Tag className="w-4 h-4 text-slate-500" />
            Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = category === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`relative p-4 border-2 rounded-xl text-left transition-all duration-200 group ${
                    isSelected
                      ? "border-slate-900 bg-slate-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isSelected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                        {cat.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Goal & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Wallet className="w-4 h-4 text-slate-500" />
              Funding Goal <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-bold text-sm flex items-center">
                NG ₦
              </div>
              <input
                type="number"
                value={goal || ""}
                onChange={(e) => setGoal(Number(e.target.value))}
                placeholder="50,000"
                min={1000}
                className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>
            <p className="text-xs text-slate-500">Minimum ₦1,000</p>
          </div> 

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Clock className="w-4 h-4 text-slate-500" />
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
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">days</span>
            </div>
            <p className="text-xs text-slate-500">1 to 365 days</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!isStage2Valid}
          className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-slate-200 disabled:shadow-none"
        >
          Continue to Images
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )


  const renderStage3 = () => (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Upload Images</h2>
        <p className="text-slate-500">Add compelling visuals to support your cause</p>
      </div>

      {/* Smart Compression Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
          <Sparkles className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Smart Image Compression</h4>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Images larger than <strong className="text-slate-700">1MB</strong> are automatically compressed before upload. 
            Your image quality is preserved while ensuring fast, reliable uploads.
          </p>
        </div>
      </div>

      {/* Error Toast */}
      {errorType === "UPLOAD_IMG" && errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">{errorMsg}</p>
            {errorMsg.includes('too large') && (
              <p className="text-xs text-red-600 mt-1">
                Try resizing your image to under 1920px wide, or use JPG instead of PNG.
              </p>
            )}
          </div>
          <button 
            onClick={() => { setErrorType(null); setErrorMsg(""); }}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Compression Stats */}
      {compressionStats && compressionStats.compressed > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800">
            <strong>{compressionStats.compressed}</strong> image{compressionStats.compressed !== 1 ? 's' : ''} compressed, saving{' '}
            <strong>{formatFileSize(compressionStats.saved)}</strong> of upload data.
          </p>
          <button 
            onClick={() => setCompressionStats(null)}
            className="ml-auto text-emerald-400 hover:text-emerald-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {/* Drag & Drop Zone + Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                mainImage?.publicId === img.publicId && !img.isUploading
                  ? 'border-slate-900 ring-2 ring-slate-100 shadow-md' 
                  : img.isUploading 
                    ? 'border-slate-200 opacity-90' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
              onClick={() => !img.isUploading && setAsMain(img)}
            >
              {img.isUploading ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-4">
                  {img.compressionStatus === 'compressing' ? (
                    <>
                      <Compass className="w-8 h-8 text-amber-500 animate-pulse mb-3" />
                      <span className="text-xs font-bold text-amber-700 text-center">
                        Compressing...
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 text-center">
                        {img.originalSize ? formatFileSize(img.originalSize) : 'Large file'} → optimized
                      </span>
                    </>
                  ) : img.compressionStatus === 'checking' ? (
                    <>
                      <Loader2 className="w-8 h-8 text-slate-500 animate-spin mb-3" />
                      <span className="text-xs font-bold text-slate-600">Checking size...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-blue-500 mb-3" />
                      <span className="text-xs font-bold text-blue-700">Uploading...</span>
                    </>
                  )}

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-4">
                    <div 
                      className="h-full bg-slate-900 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(img.uploadProgress, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">{Math.round(Math.min(img.uploadProgress, 100))}%</span>
                </div>
              ) : (
                <>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />

                  {/* Compression badge */}
                  {img.compressionStatus === 'compressed' && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <Zap className="w-3 h-3" />
                      Compressed
                    </div>
                  )}

                  {/* Main image badge */}
                  {mainImage?.publicId === img.publicId && (
                    <div className="absolute top-2 right-2 bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                      <CheckCircle2 className="w-3 h-3" /> Cover
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(idx)
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 shadow-sm border border-slate-200"
                    style={mainImage?.publicId === img.publicId ? { top: '2.75rem' } : {}}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Size info */}
                  {img.compressedSize && img.originalSize && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity text-center font-mono">
                      {formatFileSize(img.originalSize)} → {formatFileSize(img.compressedSize)}
                    </div>
                  )}

                  {/* Set as main overlay */}
                  {mainImage?.publicId !== img.publicId && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg bg-black/50 px-3 py-1.5 rounded-full">
                        Set as Cover
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Upload Button */}
          <label 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group ${
              dragActive 
                ? "border-slate-900 bg-slate-50 scale-[1.02]" 
                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
            ) : (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors ${dragActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}>
                <ImagePlus className="w-6 h-6" />
              </div>
            )}
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
              {isUploading ? 'Processing...' : dragActive ? 'Drop here' : 'Add Images'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP, GIF</span>
            <input
              ref={fileInputRef}
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
          <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <Info className="w-5 h-5 text-slate-400 shrink-0" />
            <span>
              {images.some(img => img.isUploading) 
                ? "Please wait for all images to finish uploading before continuing..." 
                : images.length > 1 
                  ? `Click any image to set as the cover photo. ${images.length} image${images.length !== 1 ? 's' : ''} uploaded.`
                  : "Click the image to set as the cover photo."
              }
            </span>
          </div>
        )}

        {/* Empty state */}
        {images.length === 0 && !isUploading && (
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`text-center py-16 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              dragActive ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${dragActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-300"}`}>
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">
              {dragActive ? "Drop your images here" : "No images yet"}
            </p>
            <p className="text-slate-400 text-sm">Upload at least one image to continue</p>
            <p className="text-slate-400 text-xs mt-1">Supported: JPG, PNG, WEBP, GIF (max 1MB each)</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-6 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back
        </button>

        <button 
          onClick={handleNext}
          disabled={!isStage3Valid}
          className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-slate-200 disabled:shadow-none"
        >
          {images.some(img => img.isUploading) ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              Review Cause
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  
  const renderStage4 = () => (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Review Your Cause</h2>
        <p className="text-slate-500">Double-check everything before going live</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Image */}
        <div className="aspect-video bg-slate-100 border-b border-slate-200 relative">
          {mainImage ? (
            <img src={mainImage.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <ImageIcon className="w-16 h-16" />
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold shadow-sm border border-slate-200">
              <Eye className="w-3 h-3 mr-1.5" />
              Cover Photo
            </span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Cause Name */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cause Name</h3>
            <p className="text-2xl font-bold text-slate-900">{causeName || "Untitled Cause"}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Funding Goal</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                ₦{goal?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{deadline || "0"} days</p>
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-semibold">
                {CATEGORIES.find(c => c.value === category)?.icon && (
                  (() => {
                    const Icon = CATEGORIES.find(c => c.value === category)!.icon
                    return <Icon className="w-4 h-4" />
                  })()
                )}
                {category}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</h3>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                {location}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Description</h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{details || "No description provided"}</p>
          </div>

          {/* Story */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Story</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-h-64 overflow-y-auto">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{story || "No story provided"}</p>
            </div>
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Image Gallery ({images.length})</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className={`aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 ${
                    mainImage?.publicId === img.publicId ? 'border-slate-900' : 'border-slate-200'
                  }`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
            <button
              onClick={() => setStage(2)}
              className="px-6 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit Details
            </button>
            <button
              onClick={() => setStage(3)}
              className="px-6 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Edit Images
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Cause
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStage5 = () => (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-10 text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto pointer-events-none">
            <div className="w-full h-full rounded-full border-2 border-emerald-300 animate-ping opacity-20" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">Cause Published!</h2>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto">
          <span className="font-semibold text-slate-900">"{causeName}"</span> is now live and ready to receive donations.
        </p>
         
         
                       

                        {/* Campaign Link */}
                        <div className="max-w-lg mx-auto">
                            <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 flex items-center gap-2">
                                <div className="flex-1 min-w-0 px-3 py-2">
                                    <p className="text-sm text-slate-600 truncate font-mono">
                                        {String(link) || "Generating link..."}
                                    </p>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                      disabled={!link}
                                    className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 shrink-0 ${
                                        copied 
                                            ? "bg-emerald-600 text-white" 
                                            : "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300"
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Copy Link
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-3">Share this link with supporters to start receiving donations immediately</p>
                        </div>
        {/* Stats Summary */}
        <div className="bg-slate-50 rounded-xl p-5 mb-8 text-left space-y-3 border border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Funding Goal</span>
            <span className="font-bold text-slate-900">₦{goal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Duration</span>
            <span className="font-bold text-slate-900">{deadline} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Images</span>
            <span className="font-bold text-slate-900">{images.length} uploaded</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Category</span>
            <span className="font-bold text-slate-900">{category}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => redirect("/dashboard/donor")}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
          >
            <ExternalLink className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button
            onClick={resetForm}
            className="w-full py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Create Another Cause
          </button>
        </div>
      </div>
    </div>
  )


  const renderStage6 = () => (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-10 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-100">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Submission Failed</h2>

        <p className="text-slate-600 mb-2 font-medium">
          {errorType === "M_IMG" && "Main image is required"}
          {errorType === "IMGS" && "At least one image is required"}
          {errorType === "NET" && "Network connection error"}
          {errorType === "UPLOAD_IMG" && "Failed to upload images"}
          {errorType === "UPLOAD_ERR" && "Publishing failed"}
          {errorType === "LOAD" && "Failed to load data"}
          {errorType === "IVP" && "Invalid parameters provided"}
          {errorType === "C404" && "Cause not found"}
          {errorType === "UVF" && "User verification failed"}
          {errorType === "FOR" && "Action not permitted"}
          {errorType === "UEX" && "An unknown error occurred"}
          {!errorType && "Something went wrong"}
        </p>

        {errorMsg && (
          <p className="text-slate-500 text-sm mb-8 bg-slate-50 rounded-lg p-3 border border-slate-100">{errorMsg}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleBack}
            className="flex-1 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={() => {
              setErrorType(null)
              setErrorMsg("")
              setHasError(false)
              setStage(errorType === "UPLOAD_IMG" || errorType === "M_IMG" || errorType === "IMGS" ? 3 : 4)
            }}
            className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  )

 
  const renderProgress = () => {
    const currentStep = stage === 6 ? 4 : stage
    const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100

    return (
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, index) => {
              const isActive = currentStep >= s.id
              const isCurrent = currentStep === s.id
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        currentStep > s.id
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-slate-900 text-white ring-4 ring-slate-100"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {currentStep > s.id ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        s.id
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold mt-1.5 hidden sm:block ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: currentStep > s.id ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-900 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <BankVerification 
        isOpen={showBankModal} 
        onClick={() => setShowBankModal(false)}
        bankName=""
        accountNumber=""
        subAccountCode=""
        email={session?.user?.email as string}
      />

      {loading ? (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
          <DualRingSpinner />
          <p className="mt-4 text-sm text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      ) : hasError && stage !== 6 ? (
        <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to Load</h2>
            <p className="text-slate-600 mb-6">{errorMsg}</p>
            <button
              onClick={fetchUserData}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <main>
          {stage !== 1 && stage !== 5 && stage !== 6 && renderProgress()}

          {stage === 1 && renderStage1()}
          {stage === 2 && renderStage2()}
          {stage === 3 && renderStage3()}
          {stage === 4 && renderStage4()}
          {stage === 5 && renderStage5()}
          {stage === 6 && renderStage6()}
        </main>
      )}

      <Footer />
    </div>
  )
}