"use client"

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

import { fetchRandom5Causes } from "@/app/lib/fetchRequests";
import { DotsWave, DualRingSpinner } from "@/app/components/ui/loading";
import LoadingCards from "@/app/components/layout/loadingCards";
import NavBar from "@/app/components/layout/NavBar";
import Card from "@/app/components/layout/card";
import { Campaign } from "@/app/lib/types";
import Footer from "@/app/components/layout/footer";
import { useSearchParams, useRouter } from "next/navigation";

type Don = Pick<Campaign, "id" | "name" | "details" | "main_img" | "goal" | "raised" | "category" | "currency" | "center_name" | "donation_count" | "date_to_completion" | "center_id"> & {
  location: string,
  safety_rating: string;
};

interface FetchResponse {
  data: Don[];
  error?: string;
  hasMore?: boolean;
}

const categories = ["All", "Education", "Community", "CroudFunding", "Business", "Health"];


export default function Explore() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryy = searchParams.get("category") || "All";
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? Math.max(0, parseInt(pageParam, 10)) : 0;

  window.document.title = "Explore Causes | Chari-T";
  const [data, setData] = useState<Don[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(categoryy);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(false);


  const fetchData = useCallback(async (targetPage: number, isLoadMore: boolean) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const resp: FetchResponse = await fetchRandom5Causes(searchQuery, activeCategory, targetPage);

      if (resp.error) {
        return;
      }

      const newItems: Don[] = resp.data || [];
      setHasMore(resp.hasMore ?? false);

      setData(prev => {
        if (!isLoadMore) return newItems;

        const existingIds = new Set(prev.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        return [...prev, ...uniqueNewItems];
      });

    } catch (err) {
      console.error("Fetch error:", err);

    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, searchQuery]);


  // Sync URL params when page/category/search changes
  const updateUrl = useCallback((newPage: number, newCategory: string, newQuery: string) => {
    const params = new URLSearchParams();
    if (newCategory !== "All") params.set("category", newCategory);
    if (newQuery) params.set("query", newQuery);
    if (newPage > 0) params.set("page", newPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/causes/get${newUrl}`, { scroll: false });
  }, [router]);


  // Handle page navigation
  const goToPage = useCallback((newPage: number) => {
    if (newPage < 0) return;
    setPage(newPage);
    updateUrl(newPage, activeCategory, searchQuery);
    fetchData(newPage, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, searchQuery, updateUrl, fetchData]);


  // Initial load and when filters change
  useEffect(() => {
    setPage(0);
    updateUrl(0, activeCategory, searchQuery);
    fetchData(0, false);
  }, [activeCategory, searchQuery]);


  // Sync from URL on mount
  useEffect(() => {
    const urlPage = searchParams.get("page");
    const urlCategory = searchParams.get("category") || "All";
    const urlQuery = searchParams.get("query") || "";

    const parsedPage = urlPage ? Math.max(0, parseInt(urlPage, 10)) : 0;

    setActiveCategory(urlCategory);
    setSearchQuery(urlQuery);
    setPage(parsedPage);
    fetchData(parsedPage, false);
  }, []);


  // Category change handler
  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setPage(0);
    updateUrl(0, cat, searchQuery);
    fetchData(0, false);
  }, [searchQuery, updateUrl, fetchData]);


  // Search handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(0);
    updateUrl(0, activeCategory, value);
    fetchData(0, false);
  }, [activeCategory, updateUrl, fetchData]);


  if (loading && data.length === 0) {
    return (
      <div className="w-full min-h-screen bg-white">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Explore Causes
            </h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              Discover and support meaningful campaigns in your community
            </p>
          </div>

          <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search causes by name, description, or center..."
                className="w-full h-14 pl-14 pr-14 bg-gray-50 border-2 border-gray-200 rounded-2xl 
                           text-gray-900 placeholder-gray-400 text-base
                           focus:outline-none focus:border-gray-400 focus:bg-white
                           transition-all duration-200 shadow-sm hover:shadow-md"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                  <SlidersHorizontal className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap mt-10 justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                    ${activeCategory === cat
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <DotsWave />
          <LoadingCards />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Explore Causes
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Discover and support meaningful campaigns in your community
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search causes by name, description, or center..."
              className="w-full h-14 pl-14 pr-14 bg-gray-50 border-2 border-gray-200 rounded-2xl 
                         text-gray-900 placeholder-gray-400 text-base
                         focus:outline-none focus:border-gray-400 focus:bg-white
                         transition-all duration-200 shadow-sm hover:shadow-md"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <SlidersHorizontal className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                ${activeCategory === cat
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm text-gray-500">
            {data.length} {data.length === 1 ? "cause" : "causes"} found
          </p>
          {(searchQuery || activeCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setPage(0);
                updateUrl(0, "All", "");
                fetchData(0, false);
              }}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Cards Grid */}
        {data.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {data.map((item, index) => (
                <motion.div
                  key={item.id}
                
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index % 4 * 0.05 }}
                  layout
                   className="min-w-0" 
                >
                  <Card
                    title={item.name}
                    donors={item.donation_count || 0}
                    desc={item.details}
                    category={item.category}
                    currency={item.currency}
                    img={item.main_img.url}
                    goal={item.goal}
                    raised={item.raised}
                    id={item.id}
                    location={item.location}
                    daysLeft={item.date_to_completion}
                    safety_level={item.safety_rating}
                    center_id={item.center_id as string || null}
                    center_name={item.center_name || null}
                    centerName={item.center_name as string}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No causes found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination */}
        {data.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12 mb-6">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0 || loading}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium
                         border border-gray-200 bg-white text-gray-700
                         hover:bg-gray-50 hover:border-gray-300
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
                         transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {page > 1 && (
                <>
                  <button
                    onClick={() => goToPage(0)}
                    className="w-10 h-10 rounded-xl text-sm font-medium
                               border border-gray-200 bg-white text-gray-600
                               hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    1
                  </button>
                  {page > 2 && (
                    <span className="px-1 text-gray-400 text-sm">...</span>
                  )}
                </>
              )}

              {page > 0 && (
                <button
                  onClick={() => goToPage(page - 1)}
                  className="w-10 h-10 rounded-xl text-sm font-medium
                             border border-gray-200 bg-white text-gray-600
                             hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  {page}
                </button>
              )}

              <button
                className="w-10 h-10 rounded-xl text-sm font-medium
                           border border-gray-900 bg-gray-900 text-white
                           shadow-sm transition-all duration-200"
              >
                {page + 1}
              </button>

              {hasMore && (
                <button
                  onClick={() => goToPage(page + 1)}
                  className="w-10 h-10 rounded-xl text-sm font-medium
                             border border-gray-200 bg-white text-gray-600
                             hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  {page + 2}
                </button>
              )}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={!hasMore || loading}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium
                         border border-gray-200 bg-white text-gray-700
                         hover:bg-gray-50 hover:border-gray-300
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
                         transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Loading indicator for page transitions */}
        {loading && data.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <DualRingSpinner />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
