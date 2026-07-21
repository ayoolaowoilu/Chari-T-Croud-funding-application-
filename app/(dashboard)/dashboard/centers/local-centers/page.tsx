'use client';

import Footer from '@/app/components/layout/footer';
import NavBar from '@/app/components/layout/NavBar';
import { DualRingSpinner } from '@/app/components/ui/loading';
import { GetCenterViews } from '@/app/lib/fetchRequests';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import Card from '@/app/components/layout/card';

import { ArrowRight, Globe, MapPin, Phone } from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  details: string;
  main_img: { url: string };
  raised: number;
  center_name: string | null;
  center_id: string | number;
  date_to_completion: string;
  created_at: string;
  category: 'Education' | 'Community' | 'CroudFunding' | 'Business' | 'Health';
  donation_count: number;
}

interface Center {
  name: string;
  email: string;
  userEmail: string;
  phone: string;
  address: string;
  website: string;
  logourl: string | null;
  id: any;
}

type ViewType = 'both' | 'centers' | 'campaigns';

export default function Page() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('both');
  const [page, setPage] = useState(0);
  const [centersHasMore, setCentersHasMore] = useState(false);
  const [campaignsHasMore, setCampaignsHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async (type: ViewType, pageNum: number, query?: string) => {
    setLoading(true);
    setError(false);
    try {
      const resp = await GetCenterViews(type, pageNum, query);
      console.log(resp);
      if (resp.error) {
        setError(true);
        return;
      }

      setCampaigns(resp.data.campaigns || []);
      setCenters(resp.data.centers || []);
      setCampaignsHasMore(resp.pagination.hasMoreCampaigns);
      setCentersHasMore(resp.pagination.hasMoreCenters);
    } catch (_err) {
      console.error(_err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData(viewType, 0, searchQuery || undefined);
  }, [fetchData, searchQuery, viewType]);

  // Handle view type change
  const handleViewChange = (type: ViewType) => {
    setViewType(type);
    setPage(0);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(viewType, nextPage, searchQuery || undefined);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchData(viewType, 0, searchQuery || undefined);
  };

  return (
    <>
      <NavBar />

      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {viewType === 'both' && '    Local  Centers & Campaigns'}
              {viewType === 'centers' && ' All Local  Centers'}
              {viewType === 'campaigns' && ' All Campaigns by centers'}
            </h1>
            <p className="text-gray-500">
              {viewType === 'both' && 'Discover centers and their active campaigns'}
              {viewType === 'centers' && 'Browse all registered centers'}
              {viewType === 'campaigns' && 'Explore all active fundraising campaigns'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              {(['both', 'centers', 'campaigns'] as ViewType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleViewChange(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    viewType === type
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {type === 'both' ? 'All' : type}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 w-full text-black  sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
            </div>
          )}

          {loading && centers.length === 0 && campaigns.length === 0 && (
            <div className="flex justify-center py-20">
              <DualRingSpinner />
            </div>
          )}

          <div className="space-y-10">
            {(viewType === 'both' || viewType === 'centers') && centers.length > 0 && (
              <section>
                {viewType === 'both' && (
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Centers</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {centers.map((center, index) => (
                    <CenterCard key={index} center={center} />
                  ))}
                </div>
                {centersHasMore && viewType === 'centers' && (
                  <LoadMoreButton onClick={loadMore} loading={loading} />
                )}
              </section>
            )}

            {(viewType === 'both' || viewType === 'campaigns') && campaigns.length > 0 && (
              <section>
                {viewType === 'both' && (
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaigns</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {campaigns.map((campaign, index) => (
                    <Card
                      key={index}
                      id={campaign.id}
                      center_id={campaign.center_id as string}
                      centerName={campaign.center_name as string}
                      center_name={campaign.center_name}
                      raised={campaign.raised}
                      img={campaign.main_img.url}
                      title={campaign.name}
                      desc={campaign.details}
                      daysLeft={campaign.date_to_completion}
                      donors={campaign.donation_count}
                      category={campaign.category}
                      goal={0}
                      currency={'NG'}
                    />
                  ))}
                </div>
                {campaignsHasMore && viewType === 'campaigns' && (
                  <LoadMoreButton onClick={loadMore} loading={loading} />
                )}
              </section>
            )}

            {/* Load More for "both" view */}
            {viewType === 'both' && (centersHasMore || campaignsHasMore) && (
              <div className="flex justify-center pt-4">
                <LoadMoreButton onClick={loadMore} loading={loading} />
              </div>
            )}

            {/* Empty State */}
            {!loading && centers.length === 0 && campaigns.length === 0 && !error && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No results found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export function CenterCard({ center }: { center: Center }) {
  const initials = center.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const hasWebsite = center.website && center.website !== 'null';

  return (
    <Link href={`/dashboard/centers/profile?id=${center.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-50 overflow-hidden flex items-center justify-center group-hover:border-blue-100 transition-colors">
              {center.logourl ? (
                <img
                  src={center.logourl}
                  alt={`${center.name} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-lg font-bold text-gray-400">{initials}</span>
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 flex  transition-colors leading-tight">
                {center.name}
                <span
                  className="inline-flex my-auto ml-2 items-center transition-transform duration-300 hover:scale-110"
                  title="Verified Charity"
                >
                  <svg className="h-5 w-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                  </svg>
                </span>
              </h3>
              <span className="shrink-0 px-2 py-0.5 bg-gray-50 rounded-md text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Center
              </span>
            </div>

            {/* Address */}
            <div className="mt-2 flex items-start gap-1.5">
              <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{center.address}</p>
            </div>

            {/* Phone */}
            {center.phone && center.phone !== 'null' && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <Phone size={13} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500">{center.phone}</span>
              </div>
            )}

            {/* Website */}
            {hasWebsite && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <Globe size={13} className="text-gray-400 shrink-0" />
                <span className="text-sm text-blue-500 truncate">
                  {center.website.replace(/^https?:\/\//, '')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400 truncate max-w-50">{center.email}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
            View Center
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function LoadMoreButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Load More'}
    </button>
  );
}
