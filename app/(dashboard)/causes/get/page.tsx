"use client"

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

import { fetchRandom5Causes } from "@/app/lib/fetchRequests";
import { DotsWave, DualRingSpinner } from "@/app/components/ui/loading";
import LoadingCards from "@/app/components/layout/loadingCards";
import NavBar from "@/app/components/layout/NavBar";
import Card from "@/app/components/layout/card";
import { Campaign } from "@/app/lib/types";
import Button from "@/app/components/ui/button";
import Footer from "@/app/components/layout/footer";
import { useSearchParams } from "next/navigation";

type Don = Pick<Campaign, "id" | "name" | "details" | "main_img" | "goal" | "raised" | "category" | "currency" | "center_name" | "donation_count" | "date_to_completion" | "center_id"> & {
  location:string,
  safety_rating: string;
};

interface FetchResponse {
  data: Don[];
  error?: string;
  hasMore?: boolean;
  nextCursor?: string | number;
}

const categories = ["All", "Education", "Community", "CroudFunding", "Business", "Health"];


export default function Explore() {
  const searchParams = useSearchParams()
  const categoryy  = searchParams.get("category") || "All"
  window.document.title = "Explore Causes | Chari-T";
  const [data, setData] = useState<Don[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(categoryy);




  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isloadingMore, setIsLoadingMore] = useState(false);

  const fetchData = useCallback(async (isLoadMore: boolean) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
      setLoadingMore(true);

    } else {
      setLoading(true);

    }

    try {
      const resp: FetchResponse = await fetchRandom5Causes(searchQuery, activeCategory);

      if (resp.error) {
        
        return;
      }

      const newItems: Don[] = resp.data || [];

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
      setIsLoadingMore(false)
    }
  }, [activeCategory, searchQuery]);


  useEffect(() => {
     if (searchQuery === "" && activeCategory === "All") return;
     setData([]);
    const handler = setTimeout(() => {

      fetchData(true);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, fetchData , activeCategory]);

  // Category change re-fetch
  useEffect(() => {
    if(activeCategory !== "All") return;
    fetchData(false);
  }, [fetchData ,  activeCategory]);

  // Infinite scroll


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

        {/* Search Bar */}
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

        {/* Results Count */}
       
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
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
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
                >
                  <Card
                    title={item.name}
                    donors={item.donation_count || 0}
                    desc={item.details}
                    category={item.category}
                    currency={item.currency}
                    img={JSON.parse(item.main_img).url}
                    goal={item.goal}
                    raised={item.raised}
                    id={item.id}
                    location={item.location}
                    daysLeft={item.date_to_completion}
                    safety_level={item.safety_rating}
                    center_id={item.center_id || null}
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

        {/* Load More */}
        { data.length > 0 && isloadingMore && (
          <div
            ref={loadMoreRef}
            className="flex justify-center items-center py-10"
          >
            {loadingMore ? <DualRingSpinner /> : <div className="h-10" />}
          </div>
        )}

       <div className="flex w-full justify-center"> <Button className="mx-auto mt-10" size="sm" variant="outline" details="load more" onClick={()=>fetchData(true)} /></div>

        {/* End of Results */}
        {/* { data.length > 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">
              You've reached the end
            </p>
          </div>
        )} */}
      </div>
      <Footer />
    </div>
  );
}