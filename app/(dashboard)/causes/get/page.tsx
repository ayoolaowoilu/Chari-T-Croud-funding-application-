'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

import { fetchRandom5Causes } from '@/app/lib/fetchRequests';
import { CAMPAIGN_CATEGORIES, categoryLabel } from '@/app/lib/categories';
import NavBar from '@/app/components/layout/NavBar';
import Card from '@/app/components/layout/card';
import { Campaign } from '@/app/lib/types';
import Footer from '@/app/components/layout/footer';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Don = Pick<
  Campaign,
  | 'id'
  | 'name'
  | 'details'
  | 'main_img'
  | 'goal'
  | 'raised'
  | 'category'
  | 'currency'
  | 'center_name'
  | 'donation_count'
  | 'date_to_completion'
  | 'center_id'
> & {
  location: string;
  safety_rating: string;
};

interface FetchResponse {
  data: Don[];
  error?: string;
  hasMore?: boolean;
}

const categories = ['All', ...CAMPAIGN_CATEGORIES] as const;

function resolveMainImg(main_img: unknown): string {
  if (!main_img) return '/slider1/hands.jpg';
  if (typeof main_img === 'string') {
    try {
      const parsed = JSON.parse(main_img);
      return parsed?.url || main_img;
    } catch {
      return main_img;
    }
  }
  if (typeof main_img === 'object' && main_img !== null && 'url' in main_img) {
    return String((main_img as { url: string }).url);
  }
  return '/slider1/hands.jpg';
}

// Skeleton Card (matches your real card layout)
const SkeletonCard = () => (
  <div className="bg-white w-full rounded-2xl overflow-hidden border border-slate-200 shadow-[var(--shadow-sm)] flex flex-col h-full animate-pulse">
    <div className="relative h-48 bg-slate-200" />

    <div className="flex flex-col grow p-5">
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />

      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-4 bg-slate-200 rounded w-16 ml-auto" />
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-3 bg-slate-200 rounded" />
        <div className="h-3 bg-slate-200 rounded w-11/12" />
      </div>

      <div className="mt-auto space-y-3">
        <div className="h-2 bg-slate-200 rounded-full" />
        <div className="flex justify-between">
          <div className="h-4 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-200 rounded w-16" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
);

export default function Explore() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<Don[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = useCallback(
    async (targetPage: number) => {
      setUpdating(true);
      try {
        const resp: FetchResponse = await fetchRandom5Causes(
          searchQuery,
          activeCategory,
          targetPage,
        );

        if (resp.error) return;

        setData(resp.data || []);
        setHasMore(resp.hasMore ?? false);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setUpdating(false);
        setLoading(false);
      }
    },
    [activeCategory, searchQuery],
  );

  const updateUrl = useCallback(
    (newPage: number, newCategory: string, newQuery: string) => {
      const params = new URLSearchParams();
      if (newCategory !== 'All') params.set('category', newCategory);
      if (newQuery) params.set('query', newQuery);
      if (newPage > 0) params.set('page', newPage.toString());

      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/causes/get${newUrl}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    const urlQuery = searchParams.get('query') || '';
    const urlPage = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 0;

    setActiveCategory(urlCategory);
    setSearchQuery(urlQuery);
    setPage(Math.max(0, urlPage));
  }, [searchParams]);

  useEffect(() => {
    fetchData(0);
    setPage(0);
  }, [activeCategory, searchQuery, fetchData]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    updateUrl(0, cat, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrl(0, activeCategory, value);
  };

  const goToPage = (newPage: number) => {
    if (newPage < 0) return;
    setPage(newPage);
    updateUrl(newPage, activeCategory, searchQuery);
    fetchData(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setPage(0);
    updateUrl(0, 'All', '');
    fetchData(0);
  };

  if (loading && data.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[var(--background)]">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="text-center mb-10">
            <p className="text-[var(--brand)] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              Browse
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              Explore causes
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
              Loading safety-rated campaigns and verified centers…
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--background)]">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[var(--brand)] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Browse
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Explore causes
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
            Discover safety-rated campaigns and verified centers in your community
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search causes by name, description, or center..."
              className="w-full h-14 pl-14 pr-14 bg-white border border-slate-200 rounded-2xl 
                         text-slate-900 placeholder-slate-400 text-base
                         focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[var(--brand)] text-white shadow-md shadow-teal-900/10'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {cat === 'All' ? 'All' : categoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm text-slate-500">
            {data.length} {data.length === 1 ? 'cause' : 'causes'} found
          </p>
          {(searchQuery || activeCategory !== 'All') && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Cards Section */}
        <div className="min-h-[400px]">
          {updating ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {data.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (index % 4) * 0.05 }}
                    layout
                  >
                    <Card
                      title={item.name}
                      donors={item.donation_count || 0}
                      desc={item.details}
                      category={item.category}
                      currency={item.currency}
                      img={resolveMainImg(item.main_img)}
                      goal={item.goal}
                      raised={item.raised}
                      id={item.id}
                      location={item.location}
                      daysLeft={item.date_to_completion}
                      safety_level={item.safety_rating}
                      center_id={(item.center_id as string) || null}
                      center_name={item.center_name || null}
                      centerName={item.center_name as string}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No causes found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Try adjusting your search or filters.
              </p>
              <Link
                href="/startcauses"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors"
              >
                Start a cause
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.length > 0 && !updating && (
          <div className="flex items-center justify-center gap-2 mt-12 mb-6">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {page > 1 && (
                <>
                  <button
                    onClick={() => goToPage(0)}
                    className="w-10 h-10 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    1
                  </button>
                  {page > 2 && <span className="px-1 text-gray-400">...</span>}
                </>
              )}

              {page > 0 && (
                <button
                  onClick={() => goToPage(page - 1)}
                  className="w-10 h-10 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  {page}
                </button>
              )}

              <button className="w-10 h-10 rounded-xl text-sm font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] transition-colors shadow-sm shadow-teal-900/10">
                {page + 1}
              </button>

              {hasMore && (
                <button
                  onClick={() => goToPage(page + 1)}
                  className="w-10 h-10 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  {page + 2}
                </button>
              )}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={!hasMore}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 transition-all"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
