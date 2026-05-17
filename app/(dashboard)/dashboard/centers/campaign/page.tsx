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
    user_email: string;
    _type: string;
    location: string;
}

interface FetchedCenterData {
    id: number;
    name: string;
    is_verified_status: string;
    logourl: string;
    geo_location: string;
    bank_details: string;
    total_donators: number;
    user_id: number;
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

const CATEGORIES: { value: CampaignPayload["category"]; label: string; icon: string; description: string }[] = [
    { value: "Health", label: "Health", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", description: "Medical aid & wellness programs" },
    { value: "Education", label: "Education", icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", description: "Schools, scholarships & training" },
    { value: "Community", label: "Community", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", description: "Local development & support" },
    { value: "Business", label: "Business", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", description: "Startups & economic growth" },
    { value: "CroudFunding", label: "Crowdfunding", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", description: "General fundraising projects" },
];

const STEPS = [
    { id: 1, label: "Campaign Info", description: "Name & details" },
    { id: 2, label: "Settings", description: "Category & deadline" },
    { id: 3, label: "Review", description: "Image & confirm" },
];

export default function CampaignPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

   
    const [centerData, setCenterData] = useState<FetchedCenterData | null>(null);
      const link = `http:localhost/dashboard/centers/profile?id=${centerData?.id}`
    const [name, setName] = useState("");
    const [category, setCategory] = useState<CampaignPayload["category"]>("CroudFunding");
    const [deadline, setDeadline] = useState(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(true);
    const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
    const { data: session, status } = useSession();
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Error loading data. Please try again.");
    const [copied, setCopied] = useState(false);
    const [dragActive, setDragActive] = useState(false);

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
    const abortControllerRef = useRef<AbortController | null>(null);

   
    useEffect(() => {
        return () => {
            if (upload.preview) URL.revokeObjectURL(upload.preview);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const fetchAndAuth = useCallback(async () => {
        setLoading(true);
        setError(false);

        if (status === "unauthenticated") {
            setError(true);
            setErrorMsg("You are not signed in. Please sign in to continue.");
            setLoading(false);
            return;
        }

        if (status === "loading") return;

        try {
            const resp = await FetchProfile(session?.user?.email as string);
            if (resp?.error) {
                setErrorMsg("Error loading profile data. Please try again.");
                setError(true);
                setLoading(false);
                return;
            }

            if (!resp?.kyc) {
                redirect(`/dashboard/kyc?redir=/dashboard/centers/campaign${id ? `?id=${id}` : ""}`);
                return;
            }

            if (!id) {
                setError(true);
                setErrorMsg("No center selected. Please select a center first.");
                setLoading(false);
                return;
            }

            const centerResp = await GetCenter("ONE", Number(id));
            if (centerResp?.error) {
                setError(true);
                setErrorMsg("Error loading center data. Please try again.");
                setLoading(false);
                return;
            }

            if (centerResp.is_verified_status !== "verified") {
                setError(true);
                setErrorMsg("Your center has not been verified yet. Please wait for verification before creating campaigns.");
                setLoading(false);
                return;
            }

            if (resp.userData?.id !== centerResp.user_id) {
                setError(true);
                setErrorMsg("You are not authorized to create campaigns for this center. Only the registered owner can manage campaigns.");
                setLoading(false);
                return;
            }

            setCenterData(centerResp);
            setLoading(false);
        } catch (err) {
            setErrorMsg("An unexpected error occurred. Please try again.");
            setError(true);
            setLoading(false);
        }
    }, [session, status, id]);

    useEffect(() => {
        if (status !== "loading") {
            fetchAndAuth();
        }
    }, [fetchAndAuth, status]);

    const handleFileSelect = useCallback(async (selectedFile: File) => {
        // Cancel any ongoing upload
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const validation = validateImageFile(selectedFile);
        if (!validation.valid) {
            setUpload(prev => ({ ...prev, error: validation.error || "Invalid file format. Please upload an image." }));
            return;
        }

        // Cleanup old preview
        if (upload.preview) URL.revokeObjectURL(upload.preview);

        const previewUrl = URL.createObjectURL(selectedFile);

        setUpload({
            file: selectedFile,
            preview: previewUrl,
            uploading: true,
            progress: 0,
            error: null,
            url: null,
            compressionInfo: null,
        });

        try {
            const compressionResult = await compressImageIfNeeded(
                selectedFile,
                (progress) => setUpload(prev => ({ ...prev, progress: Math.round(progress * 0.3) }))
            );

            setUpload(prev => ({
                ...prev,
                progress: 30,
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

            if (uploadResult?.url) {
                setUpload(prev => ({
                    ...prev,
                    uploading: false,
                    progress: 100,
                    url: uploadResult.url,
                    error: null,
                }));
            } else {
                throw new Error("Upload failed: No URL returned");
            }
        } catch (err: any) {
            if (err.name === "AbortError") return;

            setUpload(prev => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: err?.message || "Upload failed. Please try again.",
                url: null,
            }));
        }
    }, [upload.preview]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
        e.target.value = ""; // Reset input
    };

    const clearImage = () => {
        if (upload.preview) URL.revokeObjectURL(upload.preview);
        if (abortControllerRef.current) abortControllerRef.current.abort();

        setUpload({
            file: null,
            preview: null,
            uploading: false,
            progress: 0,
            error: null,
            url: null,
            compressionInfo: null,
        });
    };

    const handleSubmit = async () => {
        if (!centerData) return;

        const imageUrl = upload.url || centerData.logourl;
        if (!imageUrl) {
            setUpload(prev => ({ ...prev, error: "Please upload a campaign image or wait for upload to complete." }));
            return;
        }

        setLoading(true);

        try {
            const payload: CampaignPayload = {
                name: name.trim(),
                center_id: centerData.id,
                center_name: centerData.name,
                category,
                bank_details: centerData.bank_details,
                deadline: deadline,
                details: details.trim(),
                mainImage: { url: imageUrl },
                user_email: session?.user?.email as string,
                _type: "center",
                location: centerData.geo_location,
            };

            const resp = await uploadCause(payload);

            if (resp?.error) {
                throw new Error(resp.error);
            }
     

            setStage(4);
        } catch (err: any) {
            setErrorMsg(err?.message || "Failed to create campaign. Please try again.");
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const copyCampaignLink = async (link:string ) => {
        if (!link) return;

        try {
            await navigator.clipboard.writeText(String(link));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = String(link);
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const goToDashboard = () => {
        redirect("/dashboard");
    };

    const resetForm = () => {
        setStage(1);
        setName("");
        setDetails("");
        setCategory("CroudFunding");
        setDeadline(Date.now() + 30 * 24 * 60 * 60 * 1000);
        setCopied(false);
        clearImage();
        setError(false);
    };

    // Validation
    const isStage1Valid = name.trim().length >= 4 && details.trim().length >= 20;
    const isStage2Valid = category && deadline > Date.now();
    const isStage3Valid = centerData !== null && (upload.url !== null || !!centerData?.logourl);

    // Character counts
    const nameCount = name.trim().length;
    const detailsCount = details.trim().length;

    if (loading && !centerData && !error) {
        return (
            <div className="min-h-screen bg-slate-50">
                <NavBar />
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                    <div className="text-center">
                        <DualRingSpinner />
                        <p className="mt-4 text-sm text-slate-500 font-medium">Loading campaign setup...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">
                <NavBar />
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Unable to Proceed</h2>
                        <p className="text-slate-600 mb-6">{errorMsg}</p>
                        <button
                            onClick={() => status === "unauthenticated" ? redirect("/auth/signin") : fetchAndAuth()}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                        >
                            {status === "unauthenticated" ? "Sign In" : "Try Again"}
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <NavBar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {stage === 4 ? "Campaign Published" : "Create Campaign"}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {stage === 4 
                            ? "Your campaign is live and ready to share with the world" 
                            : `Building a campaign for ${centerData?.name || "your center"}`}
                    </p>
                </div>

                {/* Progress Steps */}
                {stage < 4 && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between">
                            {STEPS.map((s, index) => (
                                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                                                stage > s.id
                                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                    : stage === s.id
                                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                                    : "bg-white text-slate-400 border-2 border-slate-200"
                                            }`}
                                        >
                                            {stage > s.id ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                s.id
                                            )}
                                        </div>
                                        <div className="mt-2 text-center hidden sm:block">
                                            <p className={`text-xs font-semibold ${stage >= s.id ? "text-slate-900" : "text-slate-400"}`}>
                                                {s.label}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{s.description}</p>
                                        </div>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className="flex-1 h-0.5 mx-4 rounded-full transition-colors duration-300">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    stage > s.id ? "bg-emerald-500 w-full" : "bg-slate-200 w-0"
                                                }`}
                                                style={{ width: stage > s.id ? "100%" : stage === s.id ? "50%" : "0%" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stage 1: Campaign Info */}
                {stage === 1 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Campaign Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Clean Water Initiative for Rural Schools"
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                maxLength={100}
                            />
                            <div className="flex justify-between mt-2">
                                <p className="text-xs text-slate-500">
                                    {nameCount < 4 ? `At least ${4 - nameCount} more character${4 - nameCount !== 1 ? "s" : ""}` : "Looks good"}
                                </p>
                                <p className="text-xs text-slate-400">{nameCount}/100</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Campaign Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Describe your campaign goals, how the funds will be used, and the impact you expect to make. Be specific and compelling..."
                                rows={8}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none transition-all"
                                maxLength={2000}
                            />
                            <div className="flex justify-between mt-2">
                                <p className={`text-xs ${detailsCount < 20 ? "text-amber-600" : "text-emerald-600"}`}>
                                    {detailsCount < 20 
                                        ? `Add ${20 - detailsCount} more character${20 - detailsCount !== 1 ? "s" : ""} for better visibility` 
                                        : "Great description"}
                                </p>
                                <p className="text-xs text-slate-400">{detailsCount}/2000</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => setStage(2)}
                                disabled={!isStage1Valid}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                Continue to Settings
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Stage 2: Category & Deadline */}
                {stage === 2 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-4">
                                Select Category <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setCategory(cat.value)}
                                        className={`relative p-5 border-2 rounded-xl text-left transition-all duration-200 group ${
                                            category === cat.value
                                                ? "border-slate-900 bg-slate-50 shadow-sm"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${category === cat.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"} transition-colors`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className={`font-semibold text-sm ${category === cat.value ? "text-slate-900" : "text-slate-700"}`}>
                                                    {cat.label}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
                                            </div>
                                        </div>
                                        {category === cat.value && (
                                            <div className="absolute top-3 right-3">
                                                <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Campaign Deadline <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={new Date(deadline).toISOString().slice(0, 16)}
                                onChange={(e) => {
                                    const newDate = new Date(e.target.value).getTime();
                                    if (!isNaN(newDate)) setDeadline(newDate);
                                }}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Campaign ends: <span className="font-medium text-slate-900">{new Date(deadline).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setStage(1)}
                                className="flex-1 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <button
                                onClick={() => setStage(3)}
                                disabled={!isStage2Valid}
                                className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                Review Campaign
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                   {stage === 3 && (
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Campaign Cover Image <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-slate-500 mb-5">
                                This image will be displayed as the main visual for your campaign. High-quality images increase donations by 3x.
                            </p>

                            {!upload.preview && !upload.url ? (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                                        dragActive 
                                            ? "border-slate-900 bg-slate-50 scale-[1.02]" 
                                            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                                    }`}
                                >
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${dragActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-base font-semibold text-slate-900 mb-1">
                                        {dragActive ? "Drop your image here" : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-sm text-slate-500">JPG, PNG, WEBP, GIF up to 20MB</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                                    <img
                                        src={upload.preview || upload.url || centerData?.logourl}
                                        alt="Campaign preview"
                                        className="w-full h-80 object-cover"
                                    />

                                    {/* Overlay with actions */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                clearImage();
                                            }}
                                            className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium shadow-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove Image
                                        </button>
                                    </div>

                                    {/* Upload Progress */}
                                    {upload.uploading && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 border-t border-slate-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-slate-900">
                                                    {upload.progress < 30 ? "Compressing image..." : upload.progress < 100 ? "Uploading to server..." : "Finalizing..."}
                                                </span>
                                                <span className="text-sm font-semibold text-slate-900">{upload.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-slate-900 h-full rounded-full transition-all duration-300 ease-out"
                                                    style={{ width: `${upload.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Compression Info */}
                            {upload.compressionInfo && upload.compressionInfo.wasCompressed && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>
                                        Optimized from {formatFileSize(upload.compressionInfo.originalSize)} to {formatFileSize(upload.compressionInfo.compressedSize)} 
                                        <span className="font-semibold">({upload.compressionInfo.compressionRatio} saved)</span>
                                    </span>
                                </div>
                            )}

                            {upload.error && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {upload.error}
                                </div>
                            )}
                        </div>

                        {/* Review Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Review Your Campaign
                            </h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Campaign Name</p>
                                        <p className="text-sm font-semibold text-slate-900">{name}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Category</p>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-white">
                                                {category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Center</p>
                                        <p className="text-sm font-semibold text-slate-900">{centerData?.name}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Deadline</p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Details</p>
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{details}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStage(2)}
                                className="flex-1 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!isStage3Valid || upload.uploading}
                                className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {upload.uploading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Publish Campaign
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

          
                {stage === 4 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center space-y-8">
                
                        <div className="relative">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 w-24 h-24 mx-auto">
                                <div className="w-full h-full rounded-full border-2 border-emerald-200 animate-ping opacity-20" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Campaign Published!</h2>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Your campaign is now live and ready to receive donations. Share it with your community to maximize impact.
                            </p>
                        </div>

                        {/* Campaign Link */}
                        <div className="max-w-lg mx-auto">
                            <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 flex items-center gap-2">
                                <div className="flex-1 min-w-0 px-3 py-2">
                                    <p className="text-sm text-slate-600 truncate font-mono">
                                        {String(link) || "Generating link..."}
                                    </p>
                                </div>
                                <button
                                    onClick={()=>copyCampaignLink(link)}
                                 
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

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-4">
                            <button
                                onClick={goToDashboard}
                                className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Go to Dashboard
                            </button>

                            <button
                                onClick={resetForm}
                                className="flex-1 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all"
                            >
                                Create Another Campaign
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}