"use client"

import Footer from "@/app/components/layout/footer";
import NavBar from "@/app/components/layout/NavBar";
import { DualRingSpinner } from "@/app/components/ui/loading";
import { FetchProfile, GetCenter, uploadCause } from "@/app/lib/fetchRequests";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { compressImageIfNeeded, validateImageFile, formatFileSize } from "@/app/lib/imageCompression";
import { uploadImage } from "@/app/lib/upload";

export interface CampaignPayload {
    name: string;
    center_id: number;
    center_name: string;
    category: "Health" | "Education" | "Community" | "Business" | "CroudFunding";
    bank_details: any;
    deadline: number;
    details: string;
    mainImage: { url: string };
    user_email:string;
    _type:string,
    location:string
}

interface fetchedCenterData {
    id: number;
    name: string;
    is_verified_status: string;
    logourl: string;
    geo_location: string;
    bank_details: string;
    total_donators: number;
}

interface UploadState {
    file: File | null;
    preview: string | null;
    uploading: boolean;
    progress: number;
    error: string | null;
    url: string | null;
    compressionInfo: {
        originalSize: number;
        compressedSize: number;
        compressionRatio: string;
        wasCompressed: boolean;
    } | null;
}

const CATEGORIES: CampaignPayload["category"][] = [
    "Health",
    "Education",
    "Community",
    "Business",
    "CroudFunding",
];

export default function Page() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    
     const [link,setLink] = useState("")

    const [centerData, setCenterData] = useState<fetchedCenterData>();
    const [name, setName] = useState("");
    const [category, setCategory] = useState<CampaignPayload["category"]>("CroudFunding");
    const [deadline, setDeadline] = useState(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(true);
    const [stages, setStages] = useState<1 | 2 | 3 | 4 | 5>(1);
    const { data: session } = useSession();
    const [error, setError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
  

    const [upload, setUpload] = useState<UploadState>({
        file: null,
        preview: null,
        uploading: false,
        progress: 0,
        error: null,
        url: null,
        compressionInfo: null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);

    const fetchAndAuth = async () => {
        setLoading(true);
        setError(false);

        const resp = await FetchProfile(session?.user.email as string);
        if (resp.error) {
            setError(true);
            setLoading(false);
            return null;
        }

        if (!resp.kyc) {
            redirect(`/dashboard/kyc?redir=/dashboard/centers/campaign`);
        }

        const resp1 = await GetCenter("ONE", Number(id));
        if (resp1.error) {
            setError(true);
            setLoading(false);
            return null;
        }
        if(resp.userData.id !== resp1.user_id){
             setError(true)
             setLoading(false)
             return null;
        }
        document.title = resp1.name + " | Campaign";
        setCenterData(resp1);
        setLoading(false);
    };

    useEffect(() => {
        if (session?.user?.email) {
            fetchAndAuth();
        }
    }, [session]);

    const handleFileSelect = useCallback(async (selectedFile: File) => {
        const validation = validateImageFile(selectedFile);
        if (!validation.valid) {
            setUpload(prev => ({ ...prev, error: validation.error || "Invalid file" }));
            return;
        }

        setUpload(prev => ({
            ...prev,
            file: selectedFile,
            preview: URL.createObjectURL(selectedFile),
            error: null,
            uploading: true,
            progress: 0,
            url: null,
            compressionInfo: null,
        }));

        try {
            const compressionResult = await compressImageIfNeeded(
                selectedFile,
                (progress) => setUpload(prev => ({ ...prev, progress: progress * 0.5 }))
            );

            setUpload(prev => ({
                ...prev,
                progress: 50,
                compressionInfo: {
                    originalSize: compressionResult.originalSize,
                    compressedSize: compressionResult.compressedSize,
                    compressionRatio: compressionResult.compressionRatio,
                    wasCompressed: compressionResult.wasCompressed,
                },
            }));

            const formData = new FormData();
            formData.append("file", compressionResult.file);

            const uploadResult = await uploadImage(formData);

            setUpload(prev => ({
                ...prev,
                uploading: false,
                progress: 100,
                url: uploadResult.url,
                error: null,
            }));
        } catch (err: any) {
            setUpload(prev => ({
                ...prev,
                uploading: false,
                error: err.message || "Upload failed",
            }));
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const clearImage = () => {
        if (upload.preview) URL.revokeObjectURL(upload.preview);
        setUpload({
            file: null,
            preview: null,
            uploading: false,
            progress: 0,
            error: null,
            url: null,
            compressionInfo: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async () => {
        if (!centerData) return;

        const imageUrl = upload.url || centerData.logourl;
        if (!imageUrl) {
            setUpload(prev => ({ ...prev, error: "Please upload a campaign image or wait for upload to complete" }));
            return;
        }

        setSubmitting(true);

        const payload: CampaignPayload = {
            name,
            center_id: centerData.id as number,
            center_name: centerData.name,
            category,
            bank_details: centerData.bank_details,
            deadline: deadline,
            details,
            mainImage: { url: imageUrl },
            user_email: session?.user.email as string,
            _type:"center",
            location:centerData.geo_location
        };

   

         const resp = await uploadCause(payload);
    if (resp?.error) throw new Error(resp.error);
   if(resp.link){
     setLink(resp.link as string)
   }
    setStages(4);
    
    };

    const copyCampaignLink = async () => {
      
        try {
            await navigator.clipboard.writeText(link);
            alert("Campaign link copied to clipboard!");
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = link;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("Campaign link copied to clipboard!");
        }
    };

    const goToDashboard = () => {
        redirect("/dashboard");
    };

    const isStage1Valid = name.trim().length > 3 && details.trim().length > 20;
    const isStage2Valid = category && deadline > Date.now();
    const isStage3Valid = centerData !== undefined && (upload.url !== null || centerData.logourl !== undefined);

    if (loading) {
        return (
            <>
                <div className="bg-white min-h-screen w-screen text-black">
                    <NavBar />
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <DualRingSpinner />
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="bg-white min-h-screen w-screen text-black">
                    <NavBar />
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-lg font-medium text-red-600">
                            Error loading data. Please try again.
                        </div>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="bg-white min-h-screen w-screen text-black">
                <NavBar />

                <main className="max-w-2xl mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {stages === 5 ? "Campaign Created" : "Create Campaign"}
                    </h1>
                    <p className="text-gray-500 mb-8">
                        {stages === 5 ? "Your campaign is live and ready to share" : `for ${centerData?.name || "Center"}`}
                    </p>

                    {/* Progress Steps */}
                    {stages < 4 && (
                        <div className="flex items-center gap-2 mb-8">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                            stages > s
                                                ? "bg-green-600 text-white"
                                                : stages === s
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                    >
                                        {stages > s ? "✓" : s}
                                    </div>
                                    {s < 3 && (
                                        <div
                                            className={`w-12 h-1 rounded transition-colors ${
                                                stages > s ? "bg-green-600" : "bg-gray-200"
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stage 1: Basic Info */}
                    {stages === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Campaign Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter a compelling campaign name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1">Min 4 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Campaign Details <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Describe your campaign goals, how funds will be used, and the impact you expect to make..."
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1">Min 20 characters</p>
                            </div>

                            <button
                                onClick={() => setStages(2)}
                                disabled={!isStage1Valid}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Stage 2: Category & Deadline */}
                    {stages === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                                                category === cat
                                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Campaign Deadline <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={new Date(deadline).toISOString().slice(0, 16)}
                                    onChange={(e) => setDeadline(new Date(e.target.value).getTime())}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Campaign must end in the future
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStages(1)}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStages(3)}
                                    disabled={!isStage2Valid}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stage 3: Image Upload & Review */}
                    {stages === 3 && (
                        <div className="space-y-6">
                            {/* Image Upload Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Campaign Image <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-3">
                                    This will be the main image for your campaign. Max 1MB. JPG, PNG, WEBP, GIF.
                                </p>

                                {!upload.preview && !upload.url ? (
                                    <div
                                        ref={dragRef}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                                    >
                                        <div className="text-gray-400 mb-2">
                                            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, GIF up to 20MB</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={upload.preview || upload.url || centerData?.logourl}
                                            alt="Campaign preview"
                                            className="w-full h-64 object-cover"
                                        />
                                        <button
                                            onClick={clearImage}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                            title="Remove image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {upload.uploading && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3">
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${upload.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-white text-xs mt-1 text-center">
                                                    {upload.progress < 50 ? "Compressing..." : upload.progress < 100 ? "Uploading..." : "Processing..."}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {upload.compressionInfo && upload.compressionInfo.wasCompressed && (
                                    <p className="text-xs text-green-600 mt-2">
                                        Compressed from {formatFileSize(upload.compressionInfo.originalSize)} to {formatFileSize(upload.compressionInfo.compressedSize)} ({upload.compressionInfo.compressionRatio} saved)
                                    </p>
                                )}

                                {upload.error && (
                                    <p className="text-sm text-red-600 mt-2">{upload.error}</p>
                                )}
                            </div>

                            {/* Review Summary */}
                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                <h3 className="font-semibold text-gray-900">Review Campaign</h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Name</span>
                                        <p className="font-medium text-gray-900">{name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Category</span>
                                        <p className="font-medium text-gray-900">{category}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Center</span>
                                        <p className="font-medium text-gray-900">{centerData?.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Deadline</span>
                                        <p className="font-medium text-gray-900">
                                            {new Date(deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-500 text-sm">Details</span>
                                    <p className="text-sm text-gray-900 mt-1 bg-white p-3 rounded border border-gray-200 max-h-32 overflow-y-auto">
                                        {details}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStages(2)}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isStage3Valid || submitting || upload.uploading}
                                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Campaign"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stage 4: Success */}
                    {stages === 4 && (
                        <div className="space-y-8 text-center">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Created Successfully!</h2>
                                <p className="text-gray-500">Your campaign is now live and ready to receive donations.</p>
                            </div>

                            {/* Campaign Link */}
                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                                    <span className="text-sm text-gray-600 truncate mr-3">
                                       {link || "Loading..."}
                                    </span>
                                    <button
                                        onClick={copyCampaignLink}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy Link
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400">Share this link with your supporters to start receiving donations</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={goToDashboard}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Go to Dashboard
                                </button>

                                <button
                                    onClick={() => {
                                        setStages(1);
                                        setName("");
                                        setDetails("");
                                        setCategory("CroudFunding");
                                        setDeadline(Date.now() + 30 * 24 * 60 * 60 * 1000);
                                        clearImage();
                                       setLink("")
                                    }}
                                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Create Another Campaign
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}