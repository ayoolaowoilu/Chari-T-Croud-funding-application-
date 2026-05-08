import { useEffect, useState } from "react"
import LoadingCards from "../layout/loadingCards"
import LS from "../ui/loadingStats"
import { useSession } from "next-auth/react"
import { FetchALLUserData } from "@/app/lib/fetchRequests"
import Card from "../layout/card"
import Button from "../ui/button"
import { Campaign, Donor, UserData } from "@/app/lib/types"
import {  AlertTriangle, FileCheck, Landmark, Lock, Shield, Sparkles, Zap } from "lucide-react"




type FetchedData = {
  userData: userData
  causes: don[]
}

type userData = Pick<UserData, "created_at" | "email" | "full_name" | "image" | "is_verified" | "bank_details"> & {
  donations: number
  recived: number
}

type don = Pick<Campaign, "id" | "name" | "currency" | "goal" | "raised" | "center_name" | "center_id" | "category" | "details" | "main_img" | "donation_count" | "date_to_completion"> & {
  donors: Donor[],
  location:string,
  safety_rating: string
}


function StatCard({ title, value }: { title: string; value: string; trend: string }) {

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <span className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{value}</span>
        {/* <span className={`text-xs sm:text-sm font-medium shrink-0 ml-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {trend}
        </span> */}
      </div>
    </div>
  )
}







export default function Dash() {



function EmptyBankCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Bank Details Not Added</h3>
            <p className="text-sm text-gray-500 mt-1">Add your bank details to receive payouts and withdrawals</p>
          </div>
        </div>
        <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Adding your bank details enables withdrawals and ensures your account is fully verified. This usually takes 1-2 business days to process.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Instant setup
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  Bank-level security
                </span>
                <span className="flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                  Verified payouts
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button size="md" details="Add Bank Details" variant="secondary" className="w-full sm:w-auto justify-center" />
        </div>
      </div>
    </div>
  )
}

  const { data: session } = useSession()
  const [data, setData] = useState<FetchedData>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(false)
        const resp = await FetchALLUserData(session?.user?.email as string)
        if (resp.error) {
          setError(true)
        }
        setData(resp)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])


  if (loading) {
    return (
      <div className="w-full min-h-0 p-4 sm:p-6 overflow-y-auto">
        <LS />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Causes</h2>
            <span className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">
              View more
            </span>
          </div>
          <LoadingCards mm />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h2>
            <span className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">
              Go to profile
            </span>
          </div>
          <LS />
        </div>
      </div>
    )
  }



  if (error) {
    return (
      <div className="w-full min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-500 mb-4 text-sm">Something went wrong while fetching your data.</p>
          <button
            onClick={() => window.location.href = "/dashboard/donor"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { userData: userdata, causes } = data

  const totalDonated = userdata?.donations || 0
  const totalReceived = userdata?.recived || 0
  const activeCauses = causes?.length || 0
  const memberSince = new Date(userdata?.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  const currencySymbols: Record<string, string> = {
    NG: "₦",
    EURO: "€",
    USD: "$",
  }

  const primaryCurrency = causes?.[0]?.currency || "USD"
  const symbol = currencySymbols[primaryCurrency]

  

  return (
    <div className="w-full min-h-0  space-y-6 sm:space-y-8 overflow-y-auto">
      
<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
  {/* Left: Avatar + Text */}
  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
    <img
      src={userdata?.image || "/default-avatar.png"}
      alt={userdata?.full_name}
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-gray-200 shrink-0"
    />
    <div className="min-w-0">
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
        Welcome back, {userdata?.full_name.split(" ")[0]}
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 truncate">
        {userdata?.is_verified ? "Verified Account" : "Unverified Account"} • {userdata?.email}
      </p>
    </div>
  </div>

  {/* Right: Verify Button */}
  <button
  onClick={()=>window.location.href = "/dashboard/kyc?redir=/dashboard/donor"}
    className="
      flex items-center gap-1.5 px-4 py-2
      rounded-xl font-semibold text-sm
      bg-blue-500 hover:bg-blue-600
      active:bg-blue-700 active:scale-95
      text-white transition-colors duration-150
      shrink-0
    "
  >
    <Shield className="w-4 h-4" />
    <span>Verify Account</span>
  </button>
</div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Donated"
          value={`₦${totalDonated.toLocaleString()}`}
          trend="+12%"
        />
        <StatCard
          title="Total Received"
          value={`₦${totalReceived.toLocaleString()}`}
          trend="+5%"
        />
        
        <StatCard
          title="Member Since"
          value={memberSince}
          trend="+0"
        />
      </div>

   
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Causes</h2>
          <a
            href="/dashboard/donor?goto=explore"
            className="text-blue-600 text-sm font-medium hover:underline shrink-0 ml-2"
          >
            View more
          </a>
        </div>

        {causes && causes.length > 0 ? (
       <div className="relative w-82.5 sm:w-125 md:w-125 lg:min-w-250  mx-auto overflow-x-scroll scroll-hidden py-8">

  <div className="flex gap-4  min-w-300  overflow-x-auto ">
    {causes.map((cause,index) => (

       <Card

       key={index}
      title={cause.name}
      goal={cause.goal}
      raised={cause.raised}
      desc={cause.details}
      donors={cause.donation_count || 0}
      category={cause.category}
      img={JSON.parse(cause.main_img).url}
      id={cause.id}
      currency={cause.currency as "NG" | "USD" | "EURO"}
      location={cause.location}
      daysLeft={cause.date_to_completion}
      safety_level={cause.safety_rating}
    />
 

    ))}
  </div>

 
</div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 sm:p-8 text-center">
            <p className="text-gray-500 text-sm mb-4">No causes yet. Start your first campaign!</p>
            <Button variant="primary" size="md" details="Start Cause" onClick={()=>window.location.href = "/startcauses"} />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Other details</h2>
          <a
            href="/dashboard/donor?goto=profile"
            className="text-blue-600 text-sm font-medium hover:underline shrink-0 ml-2"
          >
            Go to profile
          </a>
        </div>


        


     {!userdata.bank_details ? (
  <EmptyBankCard />
) : (
  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">Bank</p>
        <p className="text-sm font-semibold text-gray-900">
          {userdata.bank_details.bankName}
        </p>
      </div>
      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
        <Landmark className="w-5 h-5 text-white" />
      </div>
    </div>

    <div className="mt-4">
      <p className="text-xs text-gray-500 mb-1">Account Name</p>
      <p className="text-sm font-medium text-gray-900">
        {userdata.bank_details.accountName}
      </p>
    </div>

    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-1">Account Number</p>
      <p className="text-lg font-mono font-semibold text-gray-900 tracking-wider">
        {userdata.bank_details.accountNumber}
      </p>
    </div>
  </div>
)}
            
          
        
      </div>
    </div>
  )
}