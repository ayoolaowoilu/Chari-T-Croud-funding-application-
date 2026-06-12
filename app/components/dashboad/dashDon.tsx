"use client"

import { useEffect, useState, useCallback } from "react"
import LoadingCards from "../layout/loadingCards"
import LS from "../ui/loadingStats"
import { useSession } from "next-auth/react"
import { FetchALLUserData } from "@/app/lib/fetchRequests"
import Card from "../layout/card"
import Button from "../ui/button"
import { Campaign, Donor, UserData } from "@/app/lib/types"
import { AlertTriangle, FileCheck, Landmark, Lock, Shield, Sparkles, Zap } from "lucide-react"


import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart,
  TooltipPayloadEntry,
  TooltipPayload
} from "recharts"

import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"



type FetchedData = {
  userData: userData
   fundedCampaigns:number,
  activeCampaigns: number,
  dueCampaigns: number,
  totalCampaigns: number
}

type userData = Pick<UserData, "created_at" | "email" | "full_name" | "image" | "is_verified" | "bank_details"> & {
  donations: number
  recived: number
}

type don = Pick<Campaign, "id" | "name" | "currency" | "goal" | "raised" | "center_name" | "center_id" | "category" | "details" | "main_img" | "donation_count" | "date_to_completion"> & {
  donors: Donor[],
  location: string,
  safety_rating: string
}

interface Donation {
  id: number
  user_id_from: number | null
  to_user_or_centerId: number
  _to: 'normal' | 'center'
  ammount: number
  name: string
  time_donated: string
  transaction_id: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

interface DonationsResponse {
  data: Donation[]
  pagination: Pagination
}



function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
      <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <span className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{value}</span>
      </div>
    </div>
  )
}



function parseApiDate(dateStr: string): Date {
  return new Date(dateStr.replace(' ', 'T'))
}

function formatNaira(amount: any): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦')
}

function getMonthKey(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function sortByMonth(data: { month: string; [key: string]: any }[]) {
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return data.sort((a, b) => {
    const aMonth = a.month.split(' ')[0]
    const bMonth = b.month.split(' ')[0]
    const aYear = parseInt(a.month.split(' ')[1]) || 0
    const bYear = parseInt(b.month.split(' ')[1]) || 0

    if (aYear !== bYear) return aYear - bYear
    return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth)
  })
}


function DonationChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-24 bg-gray-200 rounded mb-6" />
      <div className="h-62.5 bg-gray-100 rounded-xl" />
    </div>
  )
}

function ReceivedDonationsChart({ data }: { data: Donation[] }) {
 
  const monthlyData = data.reduce((acc, donation) => {
    const date = parseApiDate(donation.time_donated)
    const monthKey = getMonthKey(date)

    if (!acc[monthKey]) {
      acc[monthKey] = { 
        month: monthKey, 
        total: 0, 
        center: 0, 
        normal: 0,
        count: 0,
        centerCount: 0,
        normalCount: 0
      }
    }

    acc[monthKey].total += donation.ammount
    acc[monthKey].count += 1

    if (donation._to === 'center') {
      acc[monthKey].center += donation.ammount
      acc[monthKey].centerCount += 1
    } else {
      acc[monthKey].normal += donation.ammount
      acc[monthKey].normalCount += 1
    }

    return acc
  }, {} as Record<string, any>)

  const chartData = sortByMonth(Object.values(monthlyData))

  const totalAmount = data.reduce((sum, d) => sum + d.ammount, 0)
  const centerAmount = data.filter(d => d._to === 'center').reduce((sum, d) => sum + d.ammount, 0)
  const normalAmount = data.filter(d => d._to === 'normal').reduce((sum, d) => sum + d.ammount, 0)
  const centerCount = data.filter(d => d._to === 'center').length
  const normalCount = data.filter(d => d._to === 'normal').length

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Received Donations</h3>
          <p className="text-xs text-gray-500 mt-0.5">Donations you have received over time</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
          <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="receivedTotalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="receivedCenterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af" 
            fontSize={11} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={11} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              padding: '12px 16px'
            }}
              formatter={(
    value: ValueType | undefined,
    name: NameType | undefined,
    item: TooltipPayloadEntry,
    index: number,
    payload: TooltipPayload
  ) => {
    const num = Number(value ?? 0)
    if (name === "received") return [formatNaira(num), "Received"] as [string, string]
    if (name === "given") return [formatNaira(num), "Given"] as [string, string]
    return [String(value ?? ""), String(name ?? "")] as [string, string]
  }}

            labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
          />
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
          />
       
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#10b981" 
            strokeWidth={2.5}
            fill="url(#receivedTotalGrad)"
            dot={{ fill: '#10b981', r: 3, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 5, strokeWidth: 3, stroke: '#fff' }}
            name="total"
          />
          {/* Center line */}
          <Line 
            type="monotone" 
            dataKey="center" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 5, strokeWidth: 3, stroke: '#fff' }}
            name="center"
          />
          {/* Normal line */}
          <Line 
            type="monotone" 
            dataKey="normal" 
            stroke="#f59e0b" 
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ fill: '#f59e0b', r: 3, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 5, strokeWidth: 3, stroke: '#fff' }}
            name="normal"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Variant breakdown stats */}
      <div className="mt-4 pt-4 border-t border-gray-50">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-emerald-50 rounded-xl p-3">
            <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-medium">Total Received</p>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">{formatNaira(totalAmount)}</p>
            <p className="text-[10px] text-emerald-500 mt-0.5">{data.length} donations</p>
          </div>
          <div className="bg-violet-50 rounded-xl p-3">
            <p className="text-[10px] text-violet-600 uppercase tracking-wider font-medium">Centers</p>
            <p className="text-sm font-bold text-violet-700 mt-0.5">{formatNaira(centerAmount)}</p>
            <p className="text-[10px] text-violet-500 mt-0.5">{centerCount} donations</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-amber-600 uppercase tracking-wider font-medium">From Users</p>
              <p className="text-sm font-bold text-amber-700 mt-0.5">{formatNaira(normalAmount)}</p>
            </div>
            <p className="text-[10px] text-amber-500">{normalCount} donations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GivenDonationsChart({ data }: { data: Donation[] }) {
  
  const monthlyData = data.reduce((acc, donation) => {
    const date = parseApiDate(donation.time_donated)
    const monthKey = getMonthKey(date)

    if (!acc[monthKey]) {
      acc[monthKey] = { 
        month: monthKey, 
        total: 0, 
        center: 0, 
        normal: 0,
        count: 0,
        centerCount: 0,
        normalCount: 0
      }
    }

    acc[monthKey].total += donation.ammount
    acc[monthKey].count += 1

    if (donation._to === 'center') {
      acc[monthKey].center += donation.ammount
      acc[monthKey].centerCount += 1
    } else {
      acc[monthKey].normal += donation.ammount
      acc[monthKey].normalCount += 1
    }

    return acc
  }, {} as Record<string, any>)

  const chartData = sortByMonth(Object.values(monthlyData))

  const totalAmount = data.reduce((sum, d) => sum + d.ammount, 0)
  const centerAmount = data.filter(d => d._to === 'center').reduce((sum, d) => sum + d.ammount, 0)
  const normalAmount = data.filter(d => d._to === 'normal').reduce((sum, d) => sum + d.ammount, 0)
  const centerCount = data.filter(d => d._to === 'center').length
  const normalCount = data.filter(d => d._to === 'normal').length

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Given Donations</h3>
          <p className="text-xs text-gray-500 mt-0.5">Donations you have made over time</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-[#0a66c2]/10 flex items-center justify-center">
          <svg className="h-4 w-4 text-[#0a66c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af" 
            fontSize={11} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={11} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              padding: '12px 16px'
            }}
          formatter={(
    value: ValueType | undefined,
    name: NameType | undefined,
    item: TooltipPayloadEntry,
    index: number,
    payload: TooltipPayload
  ) => {
    const num = Number(value ?? 0)
    if (name === "received") return [formatNaira(num), "Received"] as [string, string]
    if (name === "given") return [formatNaira(num), "Given"] as [string, string]
    return [String(value ?? ""), String(name ?? "")] as [string, string]
  }}

            labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
          />
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
          />
          {/* Stacked bars showing variants */}
          <Bar 
            dataKey="center" 
            stackId="a"
            fill="#8b5cf6" 
            radius={[0, 0, 0, 0]}
            maxBarSize={36}
            name="center"
          />
          <Bar 
            dataKey="normal" 
            stackId="a"
            fill="#0a66c2" 
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
            name="normal"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Variant breakdown stats */}
      <div className="mt-4 pt-4 border-t border-gray-50">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-[#0a66c2]/5 rounded-xl p-3">
            <p className="text-[10px] text-[#0a66c2] uppercase tracking-wider font-medium">Total Given</p>
            <p className="text-sm font-bold text-[#0a66c2] mt-0.5">{formatNaira(totalAmount)}</p>
            <p className="text-[10px] text-[#0a66c2]/60 mt-0.5">{data.length} donations</p>
          </div>
          <div className="bg-violet-50 rounded-xl p-3">
            <p className="text-[10px] text-violet-600 uppercase tracking-wider font-medium">To Centers</p>
            <p className="text-sm font-bold text-violet-700 mt-0.5">{formatNaira(centerAmount)}</p>
            <p className="text-[10px] text-violet-500 mt-0.5">{centerCount} donations</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-amber-600 uppercase tracking-wider font-medium">To Users</p>
              <p className="text-sm font-bold text-amber-700 mt-0.5">{formatNaira(normalAmount)}</p>
            </div>
            <p className="text-[10px] text-amber-500">{normalCount} donations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CombinedDonationsChart({ received, given }: { received: Donation[]; given: Donation[] }) {

  const allMonths = new Set<string>()

  received.forEach(d => {
    const date = parseApiDate(d.time_donated)
    allMonths.add(getMonthKey(date))
  })
  given.forEach(d => {
    const date = parseApiDate(d.time_donated)
    allMonths.add(getMonthKey(date))
  })

  const chartData = sortByMonth(Array.from(allMonths).map(month => {
    const receivedMonth = received.filter(d => {
      const date = parseApiDate(d.time_donated)
      return getMonthKey(date) === month
    })
    const givenMonth = given.filter(d => {
      const date = parseApiDate(d.time_donated)
      return getMonthKey(date) === month
    })

    return {
      month,
      received: receivedMonth.reduce((sum, d) => sum + d.ammount, 0),
      given: givenMonth.reduce((sum, d) => sum + d.ammount, 0),
      receivedCount: receivedMonth.length,
      givenCount: givenMonth.length,
    }
  }))

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-md lg:col-span-2">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Giving Overview</h3>
          <p className="text-xs text-gray-500 mt-0.5">Received vs Given donations comparison</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-gray-500">Received</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#0a66c2]" />
            <span className="text-[10px] text-gray-500">Given</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af" 
            fontSize={11} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={11} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              padding: '12px 16px'
            }}
              formatter={(
    value: ValueType | undefined,
    name: NameType | undefined,
    item: TooltipPayloadEntry,
    index: number,
    payload: TooltipPayload
  ) => {
    const num = Number(value ?? 0)
    if (name === "received") return [formatNaira(num), "Received"] as [string, string]
    if (name === "given") return [formatNaira(num), "Given"] as [string, string]
    return [String(value ?? ""), String(name ?? "")] as [string, string]
  }}

   labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
          />
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
          />
          <Bar 
            dataKey="received" 
            fill="#10b981" 
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
            name="received"
          />
          <Bar 
            dataKey="given" 
            fill="#0a66c2" 
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
            name="given"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}



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


export default function Dash() {
  const { data: session } = useSession()
  const [data, setData] = useState<FetchedData>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)


  const [receivedDonations, setReceivedDonations] = useState<Donation[]>([])
  const [givenDonations, setGivenDonations] = useState<Donation[]>([])
  const [donationsLoading, setDonationsLoading] = useState(false)
  const [donationsError, setDonationsError] = useState<string | null>(null)


  useEffect(() => {
    if (!session?.user?.email) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(false)
        const resp = await FetchALLUserData(session?.user?.email as string)
        console.log(resp)
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

 
  const fetchDonations = useCallback(async () => {
    if (!session?.user?.email) return

    setDonationsLoading(true)
    setDonationsError(null)

    try {
      const [receivedRes, givenRes] = await Promise.all([
        fetch(`/api/dashboard/donations?email=${encodeURIComponent(session.user.email)}&type=gotten&page=1&limit=200`),
        fetch(`/api/dashboard/donations?email=${encodeURIComponent(session.user.email)}&type=given&page=1&limit=200`)
      ])

      if (!receivedRes.ok || !givenRes.ok) {
        throw new Error('Failed to fetch donation history')
      }

      const receivedData: DonationsResponse = await receivedRes.json()
      const givenData: DonationsResponse = await givenRes.json()

      setReceivedDonations(receivedData.data)
      setGivenDonations(givenData.data)
    } catch (err: any) {
      setDonationsError(err.message || 'Failed to load donation history')
    } finally {
      setDonationsLoading(false)
    }
  }, [session?.user?.email])

  // Auto-fetch donations when session is ready
  useEffect(() => {
    if (session?.user?.email) {
      fetchDonations()
    }
  }, [session?.user?.email, fetchDonations])

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

  const { userData: userdata } = data

  const totalDonated = userdata?.donations || 0
  const totalReceived = userdata?.recived || 0
  const activeCauses = data?.activeCampaigns || 0
  const memberSince = new Date(userdata?.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  return (
    <div className="w-full min-h-0 space-y-6 sm:space-y-8 overflow-y-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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

        <button
          onClick={() => window.location.href = "/dashboard/kyc?redir=/dashboard/donor"}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white transition-colors duration-150 shrink-0"
        >
          <Shield className="w-4 h-4" />
          <span>Verify Account</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Donated" value={`₦${totalDonated.toLocaleString()}`} />
        <StatCard title="Total Received" value={`₦${totalReceived.toLocaleString()}`} />
        <StatCard title="Active Causes" value={`${activeCauses}`} />
        <StatCard title="Member Since" value={memberSince} />
      </div>

    
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Analytics</h2>
          <a href="/dashboard/donor?goto=explore" className="text-blue-600 text-sm font-medium hover:underline shrink-0 ml-2">
            View more
          </a>
        </div>

        {donationsLoading ? (
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
            <DonationChartSkeleton />
            <DonationChartSkeleton />
          </div>
        ) : donationsError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{donationsError}</p>
            <button onClick={fetchDonations} className="mt-2 text-sm text-red-600 font-medium hover:underline">
              Retry
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          
            {receivedDonations.length > 0 ? (
              <ReceivedDonationsChart data={receivedDonations} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Received Donations</h3>
                <p className="text-xs text-gray-500 mb-4">No received donation data yet</p>
                <div className="h-50 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <p className="text-xs text-gray-400">Start receiving donations to see trends</p>
                  </div>
                </div>
              </div>
            )}

          
            {givenDonations.length > 0 ? (
              <GivenDonationsChart data={givenDonations} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Given Donations</h3>
                <p className="text-xs text-gray-500 mb-4">No given donation data yet</p>
                <div className="h-50 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <p className="text-xs text-gray-400">Make your first donation to see trends</p>
                  </div>
                </div>
              </div>
            )}

           
            {(receivedDonations.length > 0 || givenDonations.length > 0) && (
              <CombinedDonationsChart received={receivedDonations} given={givenDonations} />
            )}
          </div>
        )}
      </div>

      {/* Other Details */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Other details</h2>
          <a href="/dashboard/donor?goto=profile" className="text-blue-600 text-sm font-medium hover:underline shrink-0 ml-2">
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
                <p className="text-sm font-semibold text-gray-900">{userdata.bank_details.bankName}</p>
              </div>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Account Name</p>
              <p className="text-sm font-medium text-gray-900">{userdata.bank_details.accountName}</p>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Account Number</p>
              <p className="text-lg font-mono font-semibold text-gray-900 tracking-wider">{userdata.bank_details.accountNumber}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}