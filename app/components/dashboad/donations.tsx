'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

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

type DonationType = 'gotten' | 'given'

export default function DonationsPage() {
  const { data: session, status } = useSession()
  const email = session?.user?.email as string | undefined

  const [activeTab, setActiveTab] = useState<DonationType>('gotten')
  const [donations, setDonations] = useState<Donation[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDonations = useCallback(async (page: number = 1, append: boolean = false) => {
    if (!email) return

    if (page === 1) {
      setInitialLoading(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const res = await fetch(
        `/api/dashboard/donations?email=${encodeURIComponent(email)}&type=${activeTab}&page=${page}`
      )

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || `Failed to fetch: ${res.status}`)
      }

      const result: DonationsResponse = await res.json()

      if (append) {
        setDonations(prev => [...prev, ...result.data])
      } else {
        setDonations(result.data)
      }

      setPagination(result.pagination)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      if (!append) setDonations([])
    } finally {
      setInitialLoading(false)
      setLoading(false)
    }
  }, [email, activeTab])

  useEffect(() => {
    if (status === 'authenticated' && email) {
      setDonations([])
      setPagination(null)
      fetchDonations(1, false)
    }
  }, [email, activeTab, status])

  const loadMore = () => {
    if (pagination && pagination.hasMore && !loading) {
      fetchDonations(pagination.page + 1, true)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-gray-500 text-sm">Please sign in to view your donations.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header — full width on mobile, padded on desktop */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Donations</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
            {email ? `Viewing donations for ${email}` : 'Loading...'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Tabs — edge to edge on mobile */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab('gotten')}
            className={`flex-1 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'gotten'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setActiveTab('given')}
            className={`flex-1 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'given'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
            }`}
          >
            Given
          </button>
        </div>

        {/* Donation list — full bleed on mobile */}
        <div className="bg-white sm:mt-4 sm:mx-4 sm:rounded-xl sm:border sm:border-gray-200 overflow-hidden">
          {initialLoading ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 sm:p-5 animate-pulse">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="h-4 bg-gray-200 rounded w-2/5" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16 sm:w-20 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : donations.length === 0 ? (
            <div className="py-16 sm:py-20 text-center text-gray-400 px-4">
              <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <p className="text-sm">No {activeTab} donations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {donations.map((donation, index) => (
                <motion.div 
                  key={donation.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                          donation._to === 'center'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {donation._to === 'center' ? 'Center' : 'User'}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-mono truncate">
                          #{donation.transaction_id?.slice(0, 12)}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{formatDate(donation.time_donated)}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-base sm:text-lg font-bold tabular-nums ${
                        activeTab === 'gotten' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {activeTab === 'gotten' ? '+' : '-'}{formatAmount(donation.ammount)}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                        ID: {donation.id}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load more */}
          {pagination && pagination.hasMore && !initialLoading && (
            <div className="p-4 border-t border-gray-100 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  `Load More (${pagination.total - donations.length})`
                )}
              </button>
            </div>
          )}

          {/* Footer count */}
          {pagination && donations.length > 0 && (
            <div className="px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-100 text-[10px] sm:text-xs text-gray-500 text-center">
              Showing {donations.length} of {pagination.total} donations
            </div>
          )}
        </div>
      </div>
    </div>
  )
}