import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Edit3, X, Check, AlertCircle, Clock } from "lucide-react";
import LoadingCards from "../layout/loadingCards";
import { DotsWave, DualRingSpinner } from "../ui/loading";
import { FetchUserCauses, DeleteCause, UpdateCause } from "@/app/lib/fetchRequests";
import { Campaign } from "@/app/lib/types";


type Don = Pick<Campaign, "id" | "name" | "currency" | "goal" | "raised" | "center_name" | "center_id" | "category" | "details" | "main_img" | "date_to_completion" | "donation_count">;
interface FetchResponse {
  data: Don[];
  error?: string;
  hasMore?: boolean;
  nextCursor?: string | number;
}

export default function YourCam() {
  const { data: session } = useSession();

  const [data, setData] = useState<Don[]>([]);
  const [filteredData, setFilteredData] = useState<Don[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | number | undefined>(undefined);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Don>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  

  const categories = ["All", "Education", "Community", "CroudFunding", "Business", "Health"];

  const isMatured = (dateToCompletion: number) => {
    return Date.now() > dateToCompletion;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (timestamp: number) => {
    const diff = timestamp - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };



  const fetchData = useCallback(async (isLoadMore = false, currentCursor?: string | number) => {
    if (!session?.user?.email) return;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const resp: FetchResponse = await FetchUserCauses(
        session.user.email as string
      );
   

      if (resp.error) {
        setHasMore(false);
        return;
      }

      const newItems:any = resp || [];

      setData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = newItems.filter((item: Don) => !existingIds.has(item.id));
        const updated = isLoadMore ? [...prev, ...uniqueNewItems] : newItems;
        return updated;
      });

      setHasMore(resp.hasMore ?? newItems.length === 12);
      setCursor(resp.nextCursor);

      if (!isLoadMore) {
        setPage(1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchData(false);
    }
  }, [session?.user?.email, fetchData]);

  useEffect(() => {
    let result = [...data];

    if (activeCategory !== "All") {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.details.toLowerCase().includes(query) ||
          item.center_name?.toLowerCase().includes(query)
      );
    }

    setFilteredData(result);
  }, [data, searchQuery, activeCategory]);

  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prev) => prev + 1);
          fetchData(true, cursor);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, loadingMore, hasMore, cursor, fetchData]);

  const handleDelete = async (id: number) => {
    try {
      await DeleteCause(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (item: Don) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setIsSaving(true);
    try {
      console.log("Saving changes for ID:", editingId, editForm);
      const resp = await UpdateCause(editForm);
      if(resp.error){
        console.error("Update error:", resp.error);
        
        return;
      }
      setData((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...editForm } as Don : item))
      );
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const getProgress = (raised: number, goal: number) => {
    if (!goal) return 0;
    return Math.min((raised / goal) * 100, 100);
  };

  if (loading && data.length === 0) {
    return (
      <div className="w-full min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <DotsWave />
          <LoadingCards />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen  relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Your Causes
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Manage and track your fundraising campaigns
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
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
            {filteredData.length} {filteredData.length === 1 ? "cause" : "causes"} found
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

       
        {filteredData.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, index) => {
                const matured = isMatured(Number(item.date_to_completion));
                const daysRemaining = getDaysRemaining(Number(Number(item.date_to_completion)));
                const progress = getProgress(item.raised, item.goal);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    layout
                    className={`relative bg-white border-2 rounded-2xl p-5 transition-all duration-200 hover:shadow-md group
                      ${matured ? "border-red-200 bg-red-50/30" : "border-gray-200"}
                    `}
                  >
                    {/* Maturity Badge */}
                    {matured ? (
                      <div className="absolute -top-3 right-4 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        Matured
                      </div>
                    ) : daysRemaining <= 7 ? (
                      <div className="absolute -top-3 right-4 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {daysRemaining}d left
                      </div>
                    ) : null}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative w-full sm:w-24 h-24 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.main_img ? (
                          <img
                            src={JSON.parse(item.main_img).url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                              {item.details}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            {item.category}
                          </span>
                          <span className="text-gray-500">
                            {item.currency} {item.raised?.toLocaleString()} / {item.goal?.toLocaleString()}
                          </span>
                          <span className={`text-xs font-medium ${matured ? "text-red-600" : "text-gray-400"}`}>
                            Due: {formatDate(Number(item.date_to_completion))}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${matured ? "bg-red-500" : "bg-gray-800"}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{progress.toFixed(1)}% funded</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:flex-col sm:gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    <AnimatePresence>
                      {deleteConfirmId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              Are you sure you want to delete <span className="font-semibold">{item.name}</span>?
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
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

        {/* Load More Trigger */}
        {hasMore && filteredData.length > 0 && (
          <div ref={loadMoreRef} className="flex justify-center items-center py-10">
            {loadingMore ? <DualRingSpinner /> : <div className="h-10" />}
          </div>
        )}

        {!hasMore && filteredData.length > 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">You've reached the end</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-lg font-semibold text-gray-900">Edit Cause</h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Details</label>
                  <textarea
                    value={editForm.details || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, details: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal</label>
                    <input
                      type="number"
                      value={editForm.goal || 0}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, goal: Number(e.target.value) }))}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select
                      value={editForm.category || "Education"}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value as Don["category"] }))}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                    >
                      {categories.filter(c => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Completion Date</label>
                  <input
                    type="datetime-local"
                    value={editForm.date_to_completion ? new Date(Number(editForm.date_to_completion)).toISOString().slice(0, 16) : ""}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setEditForm((prev) => ({ ...prev, date_to_completion: String(date.getTime()) }));
                    }}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <DualRingSpinner />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
