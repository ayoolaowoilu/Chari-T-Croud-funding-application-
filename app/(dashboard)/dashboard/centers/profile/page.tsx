"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { GetCenter } from "@/app/lib/fetchRequests"
import NavBar from "@/app/components/layout/NavBar"
import Footer from "@/app/components/layout/footer"
import PaystackPopup from "@/app/components/paystackpopup"
import { useSession } from "next-auth/react"

interface Campaign {
    id: number
    name: string
    details: string
    main_img: string | null
    center_name: string
    center_logo: string | null
    category:string
}

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
    total_donators: number
    total_campaigns: number
    campaigns?: Campaign[]
    bank_details:any
}

export default function CenterProfilePage() {
    const searchParams = useSearchParams()
    const centerId = searchParams.get("id")

    const [center, setCenter] = useState<CenterProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    // Welcome popup state
    const [showWelcome, setShowWelcome] = useState(false)
    const [latestCampaign, setLatestCampaign] = useState<Campaign | null>(null)
    

    // Donation popup state
    const [showDonateModal, setShowDonateModal] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
    const [donationAmount, setDonationAmount] = useState("")
    const [donating, setDonating] = useState(false)

    // About section state
    const [aboutExpanded, setAboutExpanded] = useState(false)
    const ABOUT_INITIAL_HEIGHT = 120


    const campaigns = center?.campaigns || []
    const hasMoreAbout = center?.about && center.about.length > 200

    const [donorEmail, setDonorEmail] = useState("")
const [donorName, setDonorName] = useState("")
const [isBlind, setIsBlind] = useState(false)

const {data:session , status} = useSession();




  const scroll = (direction:any) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };
    const scrollContainerRef = useRef<HTMLDivElement>(null)
const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);


    const updateArrowsVisibility = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };


 

    const fetchCenter = async () => {
        if (!centerId) return

        try {
            setLoadError(false)
            setLoading(true)
            setImageLoaded(false)
            const resp = await GetCenter("ONE", Number(centerId))
            if (resp.error) {
                return setLoadError(true)
            }
            document.title = resp.name as string + " | Chari-T"
            setCenter(resp)

            if (resp.campaigns && resp.campaigns.length > 0) {
                const latest = resp.campaigns[0]
                setLatestCampaign(latest)
                const hasSeenWelcome = sessionStorage.getItem(`welcome-${centerId}`)
                if (!hasSeenWelcome) {
                    setShowWelcome(true)
                    sessionStorage.setItem(`welcome-${centerId}`, "true")
                }
            }
        } catch (error) {
            console.error(error)
            setLoadError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCenter()
    }, [centerId])


     useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check
    updateArrowsVisibility();

    // Listen to scroll events
    container.addEventListener('scroll', updateArrowsVisibility);
    window.addEventListener('resize', updateArrowsVisibility);

    // Re-check when campaigns change (images load, etc.)
    const resizeObserver = new ResizeObserver(() => updateArrowsVisibility());
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', updateArrowsVisibility);
      window.removeEventListener('resize', updateArrowsVisibility);
      resizeObserver.disconnect();
    };
  }, [campaigns])



    const handleDonateClick = (campaign?: Campaign) => {
        setSelectedCampaign(campaign || null)
        setShowDonateModal(true)
        setDonationAmount("")
    }

    const handleDonateSubmit = async () => {
        if (!donationAmount || Number(donationAmount) <= 0) return

        setDonating(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            setShowDonateModal(false)
            setDonationAmount("")
        } catch (error) {
            console.error("Donation failed:", error)
        } finally {
            setDonating(false)
        }
    }

    const getStatusBadge = (status: string) => {
        if (status?.toLowerCase() === "verified") {
            return (
                <span className="inline-flex items-center" title="Verified Charity">
                    <svg className="h-4 w-4 text-[#1d9bf0] sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                    </svg>
                </span>
            )
        }

         

        if (status?.toLowerCase() === "pending") {
            return (
                <span className="inline-flex items-center" title="Pending Verification">
                    <svg className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            )
        }

        if (status?.toLowerCase() === "rejected") {
            return (
                <span className="inline-flex items-center" title="Not Approved">
                    <svg className="h-4 w-4 text-red-500 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            )
        }

        return null
    }

    const getImageUrl = (imgData: string | null) => {
        if (!imgData) return null
        try {
            const parsed = JSON.parse(imgData)
            return parsed.url || null
        } catch {
            return imgData
        }
    }

    const randomBanner = center
        ? `https://picsum.photos/seed/${center.name}-banner/1584/396`
        : ""

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f3f2ef]">
                <NavBar />
                <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
                    <div className="animate-pulse space-y-3 sm:space-y-4">
                        <div className="h-36 rounded-t-xl bg-gray-200 sm:h-48 sm:rounded-xl" />
                        <div className="mx-2 -mt-10 flex gap-3 sm:mx-0 sm:-mt-12 sm:gap-4">
                            <div className="h-20 w-20 rounded-full bg-gray-200 ring-4 ring-white sm:h-24 sm:w-24" />
                            <div className="mt-10 flex-1 space-y-2 sm:mt-14">
                                <div className="h-5 w-40 rounded bg-gray-200 sm:h-6 sm:w-48" />
                                <div className="h-3 w-28 rounded bg-gray-200 sm:h-4 sm:w-32" />
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
                <div className="mx-auto max-w-lg px-4 py-16 text-center sm:py-24">
                    <div className="mx-auto h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center sm:h-16 sm:w-16">
                        <svg className="h-7 w-7 text-gray-400 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900 sm:mt-5 sm:text-lg">Unable to load</h3>
                    <p className="mt-1 text-sm text-gray-500">Could not retrieve this profile.</p>
                    <button
                        onClick={fetchCenter}
                        className="mt-4 rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-all duration-200 hover:shadow-lg active:scale-95 sm:mt-5 sm:px-6 sm:py-2.5"
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
                <div className="mx-auto max-w-lg px-4 py-16 text-center sm:py-24">
                    <div className="mx-auto h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center sm:h-16 sm:w-16">
                        <svg className="h-7 w-7 text-gray-400 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900 sm:mt-5 sm:text-lg">Not found</h3>
                    <p className="mt-1 text-sm text-gray-500">This center does not exist.</p>
                </div>
                <Footer />
            </div>
        )
    }



    return (
        <div className="min-h-screen bg-[#f3f2ef] relative">
            <NavBar />

            {/* Welcome Popup */}
            {showWelcome && latestCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 sm:max-w-md">
                        {/* Campaign Image */}
                        <div className="relative h-40 bg-gray-100 sm:h-48">
                            {getImageUrl(latestCampaign.main_img) ? (
                                <img 
                                    src={getImageUrl(latestCampaign.main_img)!} 
                                    alt={latestCampaign.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                    <svg className="h-10 w-10 text-gray-400 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </div>
                            )}
                            <button 
                                onClick={() => setShowWelcome(false)}
                                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors sm:top-3 sm:right-3 sm:h-8 sm:w-8"
                            >
                                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6">
                            {/* Center Profile Mini */}
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 sm:mb-4 sm:pb-4">
                                <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow-sm sm:h-10 sm:w-10">
                                    {center.logourl ? (
                                        <img src={center.logourl} alt={center.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                            <span className="text-xs font-bold text-gray-500 sm:text-sm">
                                                {center.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{center.name}</p>
                                    <p className="text-xs text-gray-500">Latest Campaign</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1.5 sm:text-xl sm:mb-2">{latestCampaign.name}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 sm:mb-6">
                                {latestCampaign.details}
                            </p>

                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={() => {
                                        setShowWelcome(false)
                                        handleDonateClick(latestCampaign)
                                    }}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0a66c2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#004182] hover:shadow-md active:scale-95 sm:px-5 sm:gap-2"
                                >
                                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                    Donate Now
                                </button>
                                <button
                                    onClick={() => setShowWelcome(false)}
                                    className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-50 active:scale-95 sm:px-5"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Donation Modal */}
         {showDonateModal && (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-sm bg-white rounded-t-2xl shadow-2xl p-5 animate-in slide-in-from-bottom duration-200 sm:rounded-2xl sm:p-6">
            <button 
                onClick={() => {
                    setShowDonateModal(false)
                    setDonationAmount("")
                    setDonorEmail("")
                    setDonorName("")
                    setIsBlind(false)
                }}
                className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors sm:top-4 sm:right-4"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="text-center mb-5 sm:mb-6">
                <div className="mx-auto h-11 w-11 rounded-full bg-[#0a66c2]/10 flex items-center justify-center mb-3 sm:h-12 sm:w-12">
                    <svg className="h-5 w-5 text-[#0a66c2] sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                    {selectedCampaign ? `Donate to ${selectedCampaign.name}` : `Donate to ${center.name}`}
                </h3>
                <p className="text-xs text-gray-500 mt-1 sm:text-sm">Your contribution makes a difference</p>
            </div>

            <div className="space-y-4">
                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₦)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-base sm:text-lg">₦</span>
                        <input
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-xl border border-gray-300 pl-8 pr-4 py-3 text-lg font-semibold text-gray-900 focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 outline-none transition-all sm:pl-9 sm:text-xl"
                            min="100"
                            step="100"
                        />
                    </div>
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-3 gap-2">
                    {["1000", "5000", "10000", "20000", "50000", "100000"].map((amount) => (
                        <button
                            key={amount}
                            onClick={() => setDonationAmount(amount)}
                            className={`rounded-lg py-2.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
                                donationAmount === amount 
                                    ? "bg-[#0a66c2] text-white shadow-md" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            ₦{Number(amount).toLocaleString()}
                        </button>
                    ))}
                </div>
                
   {status == "unauthenticated" &&
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 outline-none transition-all"
                        required
                    />
                </div>}

                {/* Blind donation toggle */}
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Blind donation</span>
                    </div>
                    <button
                        onClick={() => setIsBlind(!isBlind)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                            isBlind ? "bg-[#0a66c2]" : "bg-gray-300"
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                isBlind ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>

             
                {!isBlind && status == "unauthenticated" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 outline-none transition-all"
                            required={!isBlind}
                        />
                        <p className="mt-1 text-xs text-gray-400">This will be shown publicly on the donation list</p>
                    </div>
                )}

           <PaystackPopup 
               email={session?.user.email || donorEmail}
               publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}
               subaccount={center.bank_details.subAccountCode}
               onSuccess={()=>{console.log("succecc popup opned")}}
               onCancel={()=>{console.log("popup cancled")}}
               amount={ donationAmount}
               metadata={{
             custom_fields: [{
               display_name: 'Order ID',
               variable_name: 'order_id',
               value: '12345'
             }]
           }}
           name={isBlind ? null : status == "authenticated" ? session.user.name : donorName}
           isBlind={isBlind}
           isAuthed={status == "authenticated"}
           homeUrl='/causes/get'
           causesUrl='/causes/get'
        
        center_id={centerId}
           donor_name={isBlind ? null : status == "authenticated" ? session.user.name : donorName}
           id={null}
           owner_id={null}
           message={null}       
               />
            </div>
        </div>
    </div>
)}

            <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
                {/* Main Card */}
                <div className="overflow-hidden bg-white shadow-sm rounded-xl sm:rounded-xl transition-shadow duration-300 hover:shadow-md">
                    {/* Banner */}
                    <div className="relative h-36 sm:h-48 md:h-56 overflow-hidden bg-gray-200">
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
                    <div className="relative px-3 pb-5 sm:px-6 sm:pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-5">
                                {/* Avatar */}
                                <div className="-mt-10 sm:-mt-16">
                                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm transition-transform duration-300 hover:scale-105 sm:h-24 sm:w-24 md:h-32 md:w-32">
                                        {center.logourl ? (
                                            <img
                                                src={center.logourl}
                                                alt={center.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                <span className="text-2xl font-bold text-gray-400 sm:text-3xl md:text-4xl">
                                                    {center?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 sm:mt-0 sm:mb-1">
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl">
                                            {center.name}
                                        </h1>
                                        {getStatusBadge(center.is_verified_status)}
                                    </div>
                                    <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{center.geo_location}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-3 flex gap-2 sm:mt-0 sm:gap-3">
                                <button
                                    onClick={() => handleDonateClick()}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#004182] hover:shadow-md active:scale-95 sm:px-5 sm:gap-2"
                                >
                                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                    Donate
                                </button>
                                <button
                                    onClick={() => window.open(center.website, "_blank")}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:scale-95 sm:px-5 sm:gap-2"
                                >
                                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5 0V6a2.25 2.25 0 012.25-2.25h3.75a2.25 2.25 0 012.25 2.25v3.75m-9 0h9" />
                                    </svg>
                                    Website
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-3 sm:space-y-4 lg:col-span-2">
                        {/* About Card */}
                        <div className="bg-white p-3 shadow-sm rounded-xl sm:rounded-xl sm:p-4 transition-all duration-300 hover:shadow-md">
                            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">About</h2>
                            <div className="relative">
                                <div 
                                    className="mt-2 text-sm leading-6 text-gray-600 whitespace-pre-wrap overflow-hidden transition-all duration-500 sm:mt-3"
                                    style={{ maxHeight: aboutExpanded ? "none" : ABOUT_INITIAL_HEIGHT }}
                                >
                                    {center.about}
                                </div>
                                {!aboutExpanded && hasMoreAbout && (
                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent" />
                                )}
                            </div>
                            {hasMoreAbout && (
                                <button
                                    onClick={() => setAboutExpanded(!aboutExpanded)}
                                    className="mt-2 text-sm font-medium text-[#0a66c2] hover:text-[#004182] transition-colors flex items-center gap-1"
                                >
                                    {aboutExpanded ? (
                                        <>
                                            Show less
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            Read more
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Campaigns Horizontal Scroll */}
                     <div className="bg-white md:w-full w-100 mx-auto p-3 shadow-sm rounded-xl sm:rounded-xl sm:p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Campaigns</h2>
        <span className="text-xs text-gray-500">{campaigns.length} active</span>
      </div>

      {campaigns.length > 0 ? (
        <div className="relative group w-90 md:w-full">
          {/* Horizontal scroll container */}
          <div
            ref={scrollContainerRef}
            className="flex  gap-3 overflow-x-auto pb-3 -mx-3 px-3 sm:-mx-4 sm:px-4 sm:gap-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex-none w-65 snap-start bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 sm:w-72"
              >
                {/* Fixed height image container */}
                <div className="relative h-36 bg-gray-100 overflow-hidden sm:h-40">
                  {getImageUrl(campaign.main_img) ? (
                    <img
                      src={getImageUrl(campaign.main_img)}
                      alt={campaign.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <svg className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs ${
                       'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.category}
                    </span>
                  </div>
                </div>

                {/* Fixed height content area */}
                <div className="p-3 flex flex-col h-45 sm:p-4 sm:h-47.5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{campaign.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-3 leading-relaxed flex-1 sm:line-clamp-2">
                    {campaign.details}
                  </p>

                  <button
                    onClick={() => handleDonateClick(campaign)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0a66c2] px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#004182] active:scale-95 sm:gap-2 sm:text-sm"
                  >
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    Donate Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Left scroll button - only shows when scrollable left */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] z-10"
              aria-label="Scroll left"
            >
              <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Right scroll button - only shows when scrollable right */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] z-10"
              aria-label="Scroll right"
            >
              <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 text-sm sm:py-8">
          No active campaigns at the moment.
        </div>
      )}
    </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-3 sm:space-y-4">
                        {/* Contact Card */}
                        <div className="bg-white p-3 shadow-sm rounded-xl sm:rounded-xl sm:p-4 transition-all duration-300 hover:shadow-md">
                            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Contact</h2>
                            <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
                                <a href={`mailto:${center.email}`} className="group flex items-center gap-2.5 rounded-lg p-2 transition-all duration-200 hover:bg-gray-50 sm:gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-[#0a66c2] group-hover:text-white sm:h-8 sm:w-8">
                                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-gray-500 sm:text-xs">Email</p>
                                        <p className="text-xs font-medium text-gray-900 truncate group-hover:text-[#0a66c2] transition-colors duration-200 sm:text-sm">{center.email}</p>
                                    </div>
                                </a>

                                <a href={`tel:${center.phone}`} className="group flex items-center gap-2.5 rounded-lg p-2 transition-all duration-200 hover:bg-gray-50 sm:gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-[#0a66c2] group-hover:text-white sm:h-8 sm:w-8">
                                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-gray-500 sm:text-xs">Phone</p>
                                        <p className="text-xs font-medium text-gray-900 truncate group-hover:text-[#0a66c2] transition-colors duration-200 sm:text-sm">{center.phone}</p>
                                    </div>
                                </a>

                                <a href={center.website} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 rounded-lg p-2 transition-all duration-200 hover:bg-gray-50 sm:gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-[#0a66c2] group-hover:text-white sm:h-8 sm:w-8">
                                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-gray-500 sm:text-xs">Website</p>
                                        <p className="text-xs font-medium text-gray-900 truncate group-hover:text-[#0a66c2] transition-colors duration-200 sm:text-sm">{center?.website?.replace(/^https?:\/\//, "")}</p>
                                    </div>
                                </a>

                                <div className="flex items-start gap-2.5 rounded-lg p-2 sm:gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 sm:h-8 sm:w-8">
                                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-gray-500 sm:text-xs">Address</p>
                                        <p className="text-xs font-medium text-gray-900 sm:text-sm">{center.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white p-3 shadow-sm rounded-xl sm:rounded-xl sm:p-4 transition-all duration-300 hover:shadow-md">
                            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Impact</h2>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:gap-3">
                                <div className="rounded-lg bg-gray-50 p-2.5 text-center transition-all duration-200 hover:bg-gray-100 sm:p-3">
                                    <p className="text-lg font-bold text-[#0a66c2] sm:text-xl">{center.total_campaigns}</p>
                                    <p className="text-[11px] text-gray-500 sm:text-xs">Campaigns</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2.5 text-center transition-all duration-200 hover:bg-gray-100 sm:p-3">
                                    <p className="text-lg font-bold text-[#0a66c2] sm:text-xl">{center.total_donators || 0}</p>
                                    <p className="text-[11px] text-gray-500 sm:text-xs">Donors</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 sm:mt-8">
                <Footer />
            </div>
        </div>
    )
}