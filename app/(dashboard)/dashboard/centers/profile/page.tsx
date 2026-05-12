"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { GetCenter } from "@/app/lib/fetchRequests"
import NavBar from "@/app/components/layout/NavBar"
import Footer from "@/app/components/layout/footer"

interface CenterProfile {
    name: string
    registration_number: string
    email: string
    userEmail: string
    phone: string
    address: string
    website: string
    is_verified_status: "pending" | "verified" | "rejected"
    about: string
    logourl: string | null
    geo_location: string
}

export default function CenterProfilePage() {
    const searchParams = useSearchParams()
    const centerId = searchParams.get("id")

    const [center, setCenter] = useState<CenterProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    document.title = center?.name as string + " | Chari-T"

    const fetchCenter = async () => {
        if (!centerId) return

        try {
            setLoadError(false)
            setLoading(true)
            setImageLoaded(false)
            const resp = await GetCenter("ONE", Number(centerId))
               if(resp.error){
                return  setLoadError(true)
            }
            setCenter(resp)
        } catch (error) {
            console.error(error)
            setLoadError(true)
        } finally {
            setLoading(false)
        }
    }
  console.log(center)
    useEffect(() => {
        fetchCenter()
    }, [centerId])

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

    const randomBanner = center
        ? `https://picsum.photos/seed/${center.name}-banner/1584/396`
        : ""

 

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f3f2ef]">
                <NavBar />
                <div className="mx-auto max-w-5xl px-0 py-6 sm:px-4">
                    <div className="animate-pulse space-y-4">
                        <div className="h-48 rounded-t-xl bg-gray-200 sm:rounded-xl" />
                        <div className="mx-4 -mt-12 flex gap-4 sm:mx-0">
                            <div className="h-24 w-24 rounded-full bg-gray-200 ring-4 ring-white" />
                            <div className="mt-14 flex-1 space-y-2">
                                <div className="h-6 w-48 rounded bg-gray-200" />
                                <div className="h-4 w-32 rounded bg-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="min-h-screen bg-[#f3f2ef]">
                <NavBar />
                <div className="mx-auto max-w-lg px-4 py-24 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-gray-900">Unable to load</h3>
                    <p className="mt-1 text-sm text-gray-500">Could not retrieve this profile.</p>
                    <button
                        onClick={fetchCenter}
                        className="mt-5 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                        Retry
                    </button>
                </div>
                <Footer />
            </div>
        )
    }

    if (!center) {
        return (
            <div className="min-h-screen bg-[#f3f2ef]">
                <NavBar />
                <div className="mx-auto max-w-lg px-4 py-24 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-gray-900">Not found</h3>
                    <p className="mt-1 text-sm text-gray-500">This center does not exist.</p>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <NavBar />

            <div className="mx-auto max-w-5xl px-0 py-6 sm:px-4">
                {/* Main Card */}
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl transition-shadow duration-300 hover:shadow-md">
                    {/* Banner */}
                    <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
                        <img
                            src={randomBanner}
                            alt="Banner"
                            className={`h-full w-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
                            onLoad={() => setImageLoaded(true)}
                        />
                        {!imageLoaded && (
                            <div className="absolute inset-0 animate-pulse bg-gray-200" />
                        )}
                    </div>

                    {/* Profile Header */}
                    <div className="relative px-4 pb-6 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-5">
                                {/* Avatar */}
                                <div className="-mt-12 sm:-mt-16">
                                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm transition-transform duration-300 hover:scale-105 sm:h-32 sm:w-32">
                                        {center.logourl ? (
                                            <img
                                                src={center.logourl}
                                                alt={center.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                <span className="text-3xl font-bold text-gray-400 sm:text-4xl">
                                                    {center?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 sm:mb-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                                            {center.name}
                                        </h1>
                                        {getStatusBadge(center.is_verified_status)}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{center.geo_location}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex gap-3 sm:mt-0">
                                <button
                                    onClick={() => window.location.href = `/donate?center=${centerId}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#004182] hover:shadow-md active:scale-95"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                    Donate
                                </button>
                                <button
                                    onClick={() => window.open(center.website, "_blank")}
                                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:scale-95"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5 0V6a2.25 2.25 0 012.25-2.25h3.75a2.25 2.25 0 012.25 2.25v3.75m-9 0h9" />
                                    </svg>
                                    Website
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-4 lg:col-span-2">
                        {/* About Card */}
                        <div className="bg-white p-4 shadow-sm sm:rounded-xl transition-all duration-300 hover:shadow-md">
                            <h2 className="text-lg font-semibold text-gray-900">About</h2>
                            <p className="mt-3 text-sm leading-6 text-gray-600 whitespace-pre-wrap">
                                {center.about}
                            </p>
                        </div>

                        {/* Photo Grid */}
                        <div className="bg-white p-4 shadow-sm sm:rounded-xl transition-all duration-300 hover:shadow-md">
                            <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                                        <img
                                            src={`https://picsum.photos/seed/${center.name}-${i}/400/400`}
                                            alt={`Photo ${i}`}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-4">
                        {/* Contact Card */}
                        <div className="bg-white p-4 shadow-sm sm:rounded-xl transition-all duration-300 hover:shadow-md">
                            <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
                            <div className="mt-3 space-y-3">
                                <a href={`mailto:${center.email}`} className="group flex items-center gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-gray-50">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-[#0a66c2] group-hover:text-white">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#0a66c2] transition-colors duration-200">{center.email}</p>
                                    </div>
                                </a>

                                <a href={`tel:${center.phone}`} className="group flex items-center gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-gray-50">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-[#0a66c2] group-hover:text-white">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#0a66c2] transition-colors duration-200">{center.phone}</p>
                                    </div>
                                </a>

                                <a href={center.website} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-gray-50">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-[#0a66c2] group-hover:text-white">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Website</p>
                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#0a66c2] transition-colors duration-200">{center?.website?.replace(/^https?:\/\//, "")}</p>
                                    </div>
                                </a>

                                <div className="flex items-start gap-3 rounded-lg p-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Address</p>
                                        <p className="text-sm font-medium text-gray-900">{center.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white p-4 shadow-sm sm:rounded-xl transition-all duration-300 hover:shadow-md">
                            <h2 className="text-lg font-semibold text-gray-900">Impact</h2>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-gray-50 p-3 text-center transition-all duration-200 hover:bg-gray-100">
                                    <p className="text-xl font-bold text-[#0a66c2]">0</p>
                                    <p className="text-xs text-gray-500">Campaigns</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3 text-center transition-all duration-200 hover:bg-gray-100">
                                    <p className="text-xl font-bold text-[#0a66c2]">0</p>
                                    <p className="text-xs text-gray-500">Donors</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Footer />
            </div>
        </div>
    )
}