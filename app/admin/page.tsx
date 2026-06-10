"use client"

import { useEffect, useState } from "react"
import { FetchProfile } from "../lib/fetchRequests"
import { useSession } from "next-auth/react"
import NavBar from "../components/layout/NavBar"
import Footer, { Logo } from "../components/layout/footer"
import { DualRingSpinner } from "../components/ui/loading"
import { AlertCircle, Users, Building2, Megaphone, CheckCircle, Clock, CreditCard, Flag } from "lucide-react"
import Button from "../components/ui/button"

interface Stats {
  totalUsers: number
  totalCenters: number
  all_time_campaigns: number
  funded_campaigns: number
  due_campaigns: number
  all_time_transactions: number
  reported_campaigns: number
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  accent?: "default" | "success" | "warning" | "danger"
}

function StatCard({ label, value, icon, accent = "default" }: StatCardProps) {
  const accentStyles = {
    default: "border-gray-200",
    success: "border-green-200 bg-green-50/50",
    warning: "border-amber-200 bg-amber-50/50",
    danger: "border-red-200 bg-red-50/50",
  }

  return (
    <div className={`rounded-xl border ${accentStyles[accent]} bg-white p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}

export default function Page() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1)
  const [stats, setStats] = useState<Stats | null>(null)

  const fetchUserData = async () => {
    setLoading(true)
    setError(false)

    if (status === "loading") {
      return
    }

    try {
      const resp = await FetchProfile(session?.user?.email as string)
      console.log(resp)

      if (resp.error) {
        setError(true)
        return
      }

      if (resp.userData.role !== "admin") {
        window.location.href = "/"
        return
      }

      const resp1 = await fetch("/api/ad45667899/stats")
      const data: Stats = await resp1.json()  
      
      if (!resp1.ok) {
        setError(true)
        return
      }

      setStats(data)
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [status])

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-white">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <DualRingSpinner />
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Error</h2>
            <p className="text-gray-500 text-sm mt-2">
              Unable to load admin data
            </p>
            <Button variant="secondary" className="mt-6" onClick={fetchUserData} details="Retry" />
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <div className="bg-white w-screen min-h-screen">
      <NavBar />
      <main className="text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stage === 1 && stats && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Time Stats</h1>
                <p className="text-sm text-gray-500">Platform overview and key metrics</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Users"
                value={stats.totalUsers}
                icon={<Users className="w-5 h-5" />}
              />
              <StatCard
                label="Total Centers"
                value={stats.totalCenters}
                icon={<Building2 className="w-5 h-5" />}
              />
              <StatCard
                label="All Time Campaigns"
                value={stats.all_time_campaigns}
                icon={<Megaphone className="w-5 h-5" />}
              />
              <StatCard
                label="Funded Campaigns"
                value={stats.funded_campaigns}
                icon={<CheckCircle className="w-5 h-5" />}
                accent="success"
              />
              <StatCard
                label="Due Campaigns"
                value={stats.due_campaigns}
                icon={<Clock className="w-5 h-5" />}
                accent="warning"
              />
              <StatCard
                label="All Time Transactions"
                value={stats.all_time_transactions}
                icon={<CreditCard className="w-5 h-5" />}
              />
              <StatCard
                label="Reported Campaigns"
                value={stats.reported_campaigns}
                icon={<Flag className="w-5 h-5" />}
                accent="danger"
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}