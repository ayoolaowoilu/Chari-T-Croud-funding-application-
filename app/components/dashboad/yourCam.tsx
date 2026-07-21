import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Trash2, Edit3, X, Check, AlertCircle, Clock,
  Building2, User, Filter, LayoutGrid, List, Users,
  ImageIcon, MessageCircle, Bell, ChevronLeft, ChevronRight,
  Send, Calendar, Target, ArrowLeft
} from "lucide-react";
import LoadingCards from "../layout/loadingCards";
import { DotsWave, DualRingSpinner } from "../ui/loading";
import { FetchUserCauses, DeleteCause, UpdateCause, Handle_subscribe, Handle_comment } from "@/app/lib/fetchRequests";
import { Campaign, Comments } from "@/app/lib/types";


type Don = Campaign
interface FetchResponse {
  data: Don[];
  error?: string;
  hasMore?: boolean;
  nextCursor?: string | number;
}

type CampaignType = "all" | "normal" | "center";
type ViewMode = "list" | "block";
type DetailTab = "details" | "donors" | "subscribers" | "comments";

interface Donor {
  name: string;
  amount: number;
}

interface Subscribed {
  user_id?: string;
  name?: string;
  email?: string;
  img_url?: string;
  identity_key?: string;
  campaign_id?: number;
}

const DONOR_PAGE_SIZE = 5;
const CAMPAIGN_PAGE_SIZE = 12;

function DetailPagination({ page, hasMore, onPrev, onNext, loading }: {
  page: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <button
        onClick={onPrev}
        disabled={page === 0 || loading}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      <span className="text-xs text-gray-400">Page {page + 1}</span>
      <button
        onClick={onNext}
        disabled={!hasMore || loading}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? <DualRingSpinner /> : <>Next <ChevronRight className="w-4 h-4" /></>}
      </button>
    </div>
  );
}

function CampaignDetailsPanel({ campaign, onClose }: { campaign: Don; onClose: () => void }) {
  const { data: session } = useSession();
  const [tab, setTab] = useState<DetailTab>("details");

  const isCenter = campaign._type === "center";
  const progress = campaign.goal ? Math.min((campaign.raised / campaign.goal) * 100, 100) : 0;

  // Donors — already loaded on the campaign object, paginate client-side
  const allDonors: Donor[] = campaign.donors || [];
  const sortedDonors = [...allDonors].sort((a, b) => b.amount - a.amount);
  const [donorPage, setDonorPage] = useState(0);
  const donorPageCount = Math.max(Math.ceil(sortedDonors.length / DONOR_PAGE_SIZE), 1);
  const pagedDonors = sortedDonors.slice(donorPage * DONOR_PAGE_SIZE, donorPage * DONOR_PAGE_SIZE + DONOR_PAGE_SIZE);

  // Subscribers — fetched from server on demand (works the same for normal + center campaigns)
  const [subscribers, setSubscribers] = useState<Subscribed[]>([]);
  const [subscribersPage, setSubscribersPage] = useState(0);
  const [subscribersTotal, setSubscribersTotal] = useState(0);
  const [subscribersHasMore, setSubscribersHasMore] = useState(false);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscribersLoaded, setSubscribersLoaded] = useState(false);
  const [subscribersError, setSubscribersError] = useState(false);

  const fetchSubscribers = async (pageNum = 0) => {
    setSubscribersLoading(true);
    setSubscribersError(false);
    try {
      const resp = await Handle_subscribe("GET", { campaign_id: campaign.id }, pageNum);
      if (resp.error) {
        setSubscribersError(true);
      } else {
        setSubscribers(resp.subscribed || []);
        setSubscribersTotal(resp.total_count ?? 0);
        setSubscribersHasMore(!!resp.has_more);
        setSubscribersPage(pageNum);
      }
    } catch (err) {
      console.error(err);
      setSubscribersError(true);
    } finally {
      setSubscribersLoading(false);
      setSubscribersLoaded(true);
    }
  };

  // Comments — fetched from server on demand
  const [comments, setComments] = useState<Comments[]>([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [commentsHasMore, setCommentsHasMore] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsError, setCommentsError] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const fetchComments = async (pageNum = 0) => {
    setCommentsLoading(true);
    setCommentsError(false);
    try {
      const resp = await Handle_comment("GET", { campaign_id: campaign.id }, pageNum);
      if (resp.error) {
        setCommentsError(true);
      } else {
        const fetched = resp.comments || resp.data || [];
        setComments(fetched);
        setCommentsTotal(resp.total_count || resp.count || fetched.length);
        setCommentsHasMore(fetched.length >= 10);
        setCommentsPage(pageNum);
      }
    } catch (err) {
      console.error(err);
      setCommentsError(true);
    } finally {
      setCommentsLoading(false);
      setCommentsLoaded(true);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPostingComment(true);
    try {
      const resp = await Handle_comment("PUT", {
        comment: newComment.trim(),
        campaign_id: campaign.id,
        name: session?.user?.name || "Anonymous",
        email: session?.user?.email || "",
        user_id: "1",
        img_url: session?.user?.image,
        identity_key: session?.user?.id,
      } as Comments);
      if (!resp.error) {
        setNewComment("");
        fetchComments(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostingComment(false);
    }
  };

  useEffect(() => {
    if (tab === "subscribers" && !subscribersLoaded) fetchSubscribers(0);
    if (tab === "comments" && !commentsLoaded) fetchComments(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // lock background scroll while the fullscreen panel is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const tabs: { key: DetailTab; label: string; icon: typeof Target; count?: number }[] = [
    { key: "details", label: "Details", icon: Target },
    { key: "donors", label: "Donors", icon: Users, count: sortedDonors.length },
    { key: "subscribers", label: "Subscribers", icon: Bell, count: subscribersLoaded ? subscribersTotal : (campaign.subscribed_count ?? undefined) },
    { key: "comments", label: "Comments", icon: MessageCircle, count: commentsLoaded ? commentsTotal : (campaign.comments_count ?? undefined) },
  ];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="shrink-0 relative">
        <div className="relative w-full h-48 sm:h-64 bg-gray-100">
          {campaign.main_img ? (
            <img src={campaign.main_img.url} alt={campaign.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-sm font-medium text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-1.5 ${isCenter ? "bg-emerald-600" : "bg-blue-600"}`}>
              {isCenter ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isCenter ? "Center" : "Personal"}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">{campaign.name}</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-8 pt-3 border-b border-gray-100 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {typeof t.count === "number" && <span className="text-xs text-gray-400">({t.count})</span>}
              {tab === t.key && (
                <motion.div layoutId="detail-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {tab === "details" && (
            <motion.div key="details" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{campaign.details}</p>

              {!isCenter && (
                <div className="mt-5">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-bold text-gray-900">{campaign.currency} {campaign.raised?.toLocaleString()}</span>
                    <span className="text-gray-500">of {campaign.currency} {campaign.goal?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <motion.div className="bg-blue-600 h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{progress.toFixed(1)}% funded</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{campaign.category}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Due
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(Number(campaign.date_to_completion)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Donors</p>
                  <p className="text-sm font-semibold text-gray-900">{sortedDonors.length}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Currency</p>
                  <p className="text-sm font-semibold text-gray-900">{campaign.currency}</p>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "donors" && (
            <motion.div key="donors" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
              {sortedDonors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No donors yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {pagedDonors.map((donor, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {donor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{donor.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{campaign.currency} {donor.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  {/* always show pagination controls when there's more than one page — applies to both normal and center campaigns */}
                  {donorPageCount > 1 && (
                    <DetailPagination
                      page={donorPage}
                      hasMore={donorPage < donorPageCount - 1}
                      onPrev={() => setDonorPage((p) => Math.max(p - 1, 0))}
                      onNext={() => setDonorPage((p) => Math.min(p + 1, donorPageCount - 1))}
                      loading={false}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}

          {tab === "subscribers" && (
            <motion.div key="subscribers" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
              {subscribersLoading && subscribers.length === 0 ? (
                <div className="py-12 flex justify-center"><DualRingSpinner /></div>
              ) : subscribersError && subscribers.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-3">Failed to load subscribers</p>
                  <button onClick={() => fetchSubscribers(0)} className="text-sm text-blue-600 font-medium hover:text-blue-700">Try Again</button>
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No subscribers yet</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {subscribers.map((sub, idx) => (
                      <div key={sub.identity_key || idx} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100">
                        {sub.img_url ? (
                          <img src={sub.img_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-600">{(sub.name || "A").charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-800 truncate">{sub.name || "Anonymous"}</span>
                      </div>
                    ))}
                  </div>
                  {/* server-driven pagination — shows for both normal and center campaigns since it's keyed off campaign_id, not type */}
                  <DetailPagination
                    page={subscribersPage}
                    hasMore={subscribersHasMore}
                    onPrev={() => fetchSubscribers(Math.max(subscribersPage - 1, 0))}
                    onNext={() => fetchSubscribers(subscribersPage + 1)}
                    loading={subscribersLoading}
                  />
                </>
              )}
            </motion.div>
          )}

          {tab === "comments" && (
            <motion.div key="comments" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
              <div className="flex gap-3 mb-5">
                <div className="shrink-0">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={session ? "Write a comment..." : "Sign in to comment"}
                    rows={2}
                    disabled={!session || postingComment}
                    className="w-full px-3 py-2.5 text-black bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handlePostComment}
                      disabled={!newComment.trim() || !session || postingComment}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {postingComment ? <DualRingSpinner /> : (<><Send className="w-3.5 h-3.5" /> Post</>)}
                    </button>
                  </div>
                </div>
              </div>

              {commentsLoading && comments.length === 0 ? (
                <div className="py-12 flex justify-center"><DualRingSpinner /></div>
              ) : commentsError && comments.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-3">Failed to load comments</p>
                  <button onClick={() => fetchComments(0)} className="text-sm text-blue-600 font-medium hover:text-blue-700">Try Again</button>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No comments yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {comments.map((comment, idx) => (
                      <div key={comment.identity_key || `${comment.user_id}-${idx}`} className="flex gap-3">
                        <div className="shrink-0">
                          {comment.img_url ? (
                            <img src={comment.img_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-500">{(comment.name || "A").charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">{comment.name || "Anonymous"}</span>
                              <span className="text-xs text-gray-400">·</span>
                              <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-words">{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DetailPagination
                    page={commentsPage}
                    hasMore={commentsHasMore}
                    onPrev={() => fetchComments(Math.max(commentsPage - 1, 0))}
                    onNext={() => fetchComments(commentsPage + 1)}
                    loading={commentsLoading}
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function YourCam() {
  const { data: session } = useSession();

  const [data, setData] = useState<Don[]>([]);
  const [filteredData, setFilteredData] = useState<Don[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [centerSearchQuery, setCenterSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeType, setActiveType] = useState<CampaignType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("block");

  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | number | undefined>(undefined);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Don>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Donor modal state
  const [selectedDonors, setSelectedDonors] = useState<Donor[] | null>(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState<string>("");

  // Campaign details panel state
  const [selectedCampaign, setSelectedCampaign] = useState<Don | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);


  const categories = ["All", "Education", "Community", "CroudFunding", "Business", "Health"];

  const centerNames = useCallback(() => {
    const centers = data
      .filter((item) => item._type === "center" && item.center_name)
      .map((item) => item.center_name as string);
    return [...new Set(centers)].sort();
  }, [data]);

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
      // pass the cursor through — previously this always requested page 1
      const resp:any = await FetchUserCauses(
        session.user.email as string,
        isLoadMore ? currentCursor : undefined,
        CAMPAIGN_PAGE_SIZE
      );

      if (resp.error) {
        setHasMore(false);
        return;
      }

      // backend returns { data, hasMore, nextCursor } — previously this read `resp` itself
      const newItems: Don[] = resp.data || [];

      setData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));
        return isLoadMore ? [...prev, ...uniqueNewItems] : newItems;
      });

      setHasMore(resp.hasMore ?? newItems.length === CAMPAIGN_PAGE_SIZE);
      setCursor(resp.nextCursor);
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

    if (activeType !== "all") {
      result = result.filter((item) => item._type === activeType);
    }

    if (centerSearchQuery.trim() && (activeType === "center" || activeType === "all")) {
      const query = centerSearchQuery.toLowerCase();
      result = result.filter((item) =>
        item._type === "center" && item.center_name?.toLowerCase().includes(query)
      );
    }

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
  }, [data, searchQuery, activeCategory, activeType, centerSearchQuery]);

  // Trigger loading more whenever there IS more on the server, regardless of how many
  // items match the current filter — e.g. filtering to "Center" shouldn't strand you
  // just because the campaigns loaded so far happen to all be "Personal".
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
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
      const resp = await UpdateCause(editForm);
      if (resp.error) {
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

  const handleShowDonors = (item: Don) => {
    setSelectedCampaignName(item.name);
    setSelectedDonors(item.donors || []);
  };

  const handleGenerateFlier = (item: Don) => {
    const flierUrl = `/causes/flier?_type=${item._type}&center_name=${encodeURIComponent(item.center_name || '')}&campaign_name=${encodeURIComponent(item.name)}&raised=${item.raised}&goal=${item.goal}&campaign_id=${item.id}&campaign_logo_url=${encodeURIComponent(item.main_img.url || '')}&qr_code_url=${encodeURIComponent(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/causes/cause?id=${item.id}`)}&tagline=${encodeURIComponent(item.details || '')}&details=${encodeURIComponent(item.story.slice(0,1500) + "..." || '')}`;
    window.open(flierUrl, '_blank');
  };

  const stats = {
    total: data.length,
    normal: data.filter((d) => d._type === "normal").length,
    center: data.filter((d) => d._type === "center").length,
    matured: data.filter((d) => isMatured(Number(d.date_to_completion))).length,
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
    <div className="w-full min-h-screen bg-gray-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Causes</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {stats.total} total · {stats.normal} personal · {stats.center} center
              {stats.matured > 0 && <span className="text-red-500"> · {stats.matured} matured</span>}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode("block")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === "block" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <LayoutGrid className="w-4 h-4" />
              Block
            </button>
          </div>
        </div>

        {/* Campaign Type Tabs */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {([
              { key: "all" as CampaignType, label: "All", icon: Filter },
              { key: "normal" as CampaignType, label: "Personal", icon: User },
              { key: "center" as CampaignType, label: "Center", icon: Building2 },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeType === tab.key ? "bg-gray-900 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-3xl mx-auto mb-4 space-y-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search causes..."
              className="w-full h-11 pl-10 pr-10 bg-white border-2 border-gray-200 rounded-xl 
                         text-gray-900 placeholder-gray-400 text-sm
                         focus:outline-none focus:border-gray-400 focus:bg-white
                         transition-all duration-200 shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {(activeType === "center" || activeType === "all") && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={centerSearchQuery}
                  onChange={(e) => setCenterSearchQuery(e.target.value)}
                  placeholder="Filter by center name..."
                  className="w-full h-10 pl-10 pr-10 bg-white border-2 border-gray-200 rounded-xl 
                             text-gray-900 placeholder-gray-400 text-sm
                             focus:outline-none focus:border-emerald-400 focus:bg-white transition-all shadow-sm"
                />
                {centerSearchQuery && (
                  <button onClick={() => setCenterSearchQuery("")} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
              {centerNames().length > 0 && !centerSearchQuery && (
                <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                  {centerNames().slice(0, 5).map((center) => (
                    <button
                      key={center}
                      onClick={() => setCenterSearchQuery(center)}
                      className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full hover:bg-emerald-100"
                    >
                      {center}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeCategory === cat ? "bg-gray-900 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{filteredData.length} found</span>
            {activeType !== "all" && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border
                ${activeType === "normal" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                {activeType === "normal" ? "Personal" : "Center"}
              </span>
            )}
          </div>
          {(searchQuery || activeCategory !== "All" || activeType !== "all" || centerSearchQuery) && (
            <button onClick={() => { setSearchQuery(""); setCenterSearchQuery(""); setActiveCategory("All"); setActiveType("all"); }}
              className="text-sm text-gray-600 hover:text-gray-900 underline">Clear all</button>
          )}
        </div>

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, index) => {
                const matured = isMatured(Number(item.date_to_completion));
                const daysRemaining = getDaysRemaining(Number(item.date_to_completion));
                const progress = getProgress(item.raised, item.goal);
                const isCenter = item._type === "center";
                const donorCount = item.donors?.length || 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    layout
                    onClick={() => setSelectedCampaign(item)}
                    className={`relative bg-white border-2 rounded-2xl p-4 transition-all hover:shadow-md group cursor-pointer
                      ${matured ? "border-red-200 bg-red-50/30" : "border-gray-200"}
                      ${isCenter ? "ring-1 ring-emerald-100" : ""}`}
                  >
                    {/* Badges */}
                    <div className="absolute -top-3 left-4 flex items-center gap-1.5">
                      {isCenter ? (
                        <div className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                          <Building2 className="w-3 h-3" />Center
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                          <User className="w-3 h-3" />Personal
                        </div>
                      )}
                    </div>
                    {matured ? (
                      <div className="absolute -top-3 right-4 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />Matured
                      </div>
                    ) : daysRemaining <= 7 ? (
                      <div className="absolute -top-3 right-4 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />{daysRemaining}d left
                      </div>
                    ) : null}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                      <div className="relative w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {item.main_img ? (
                          <img src={item.main_img.url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                        {isCenter && item.center_name && (
                          <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 text-white text-[10px] px-2 py-0.5 truncate">{item.center_name}</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.details}</p>
                            {isCenter && item.center_name && (
                              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><Building2 className="w-3 h-3" />{item.center_name}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-md font-medium border ${isCenter ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                            {item.category}
                          </span>
                          <span className="text-gray-500">{item.currency} {item.raised?.toLocaleString()} {isCenter ? "" : `/ ${item.goal?.toLocaleString()} `}</span>
                          <span className={`font-medium ${matured ? "text-red-600" : "text-gray-400"}`}>Due: {formatDate(Number(item.date_to_completion))}</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <motion.div className={`h-full rounded-full ${matured ? "bg-red-500" : isCenter ? "bg-emerald-600" : "bg-blue-600"}`}
                            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{progress.toFixed(1)}% funded</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 sm:flex-col" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleShowDonors(item)} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all" title="View Donors">
                          <Users className="w-3.5 h-3.5" />
                          {donorCount > 0 && <span className="text-[10px] font-bold ml-0.5">{donorCount}</span>}
                        </button>
                        <button onClick={() => handleGenerateFlier(item)} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all" title="Generate Flier">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirmId(item.id)} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {deleteConfirmId === item.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">Delete <span className="font-semibold">{item.name}</span>?{isCenter && <span className="text-emerald-600"> (Center)</span>}</p>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
                              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
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
        )}

        {/* BLOCK VIEW */}
        {viewMode === "block" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, index) => {
                const matured = isMatured(Number(item.date_to_completion));
                const daysRemaining = getDaysRemaining(Number(item.date_to_completion));
                const progress = getProgress(item.raised, item.goal);
                const isCenter = item._type === "center";
                const donorCount = item.donors?.length || 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    layout
                    onClick={() => setSelectedCampaign(item)}
                    className={`relative bg-white border-2 rounded-2xl overflow-hidden transition-all hover:shadow-lg group cursor-pointer
                      ${matured ? "border-red-200" : "border-gray-200"}
                      ${isCenter ? "ring-1 ring-emerald-100" : ""}`}
                  >
                    {/* Image */}
                    <div className="relative w-full h-40 bg-gray-100">
                      {item.main_img ? (
                        <img src={item.main_img.url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                      )}
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        {isCenter ? (
                          <div className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                            <Building2 className="w-3 h-3" />Center
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                            <User className="w-3 h-3" />Personal
                          </div>
                        )}
                      </div>
                      {/* Maturity Badge */}
                      {matured ? (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />Matured
                        </div>
                      ) : daysRemaining <= 7 ? (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />{daysRemaining}d
                        </div>
                      ) : null}
                      {/* Center overlay */}
                      {isCenter && item.center_name && (
                        <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 text-white text-xs px-3 py-1.5 truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{item.center_name}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.details}</p>

                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${isCenter ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500">{item.currency} {item.raised?.toLocaleString()}</span>
                      </div>

                      <div className="mt-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div className={`h-full rounded-full ${matured ? "bg-red-500" : isCenter ? "bg-emerald-600" : "bg-blue-600"}`}
                          initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <p className="text-[10px] text-gray-400">{progress.toFixed(1)}% funded</p>
                        <p className="text-[10px] text-gray-400">{formatDate(Number(item.date_to_completion))}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleShowDonors(item)} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                          <Users className="w-3.5 h-3.5" />
                          {donorCount} donors
                        </button>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleGenerateFlier(item)} className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all" title="Generate Flier">
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all" title="Edit">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(item.id)} className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {deleteConfirmId === item.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mb-2">Delete <span className="font-semibold">{item.name}</span>?</p>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg">Cancel</button>
                              <button onClick={() => handleDelete(item.id)} className="flex-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
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
        )}

        {filteredData.length === 0 && !hasMore && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No causes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {filteredData.length === 0 && hasMore && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">Loading more to check for matches…</p>
          </div>
        )}

        {/* Load More — kept mounted whenever there's more on the server, independent of
            whether the current filter has visible results yet, so filtering by e.g.
            "Center" can keep paging until it finds matches or the server runs out. */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center items-center py-10">
            {loadingMore ? <DualRingSpinner /> : <div className="h-10" />}
          </div>
        )}
        {!hasMore && filteredData.length > 0 && (
          <div className="text-center py-10"><p className="text-sm text-gray-400">You've reached the end</p></div>
        )}
      </div>

      {/* CAMPAIGN DETAILS — fullscreen panel */}
      <AnimatePresence>
        {selectedCampaign && (
          <CampaignDetailsPanel campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />
        )}
      </AnimatePresence>

      {/* DONORS MODAL */}
      <AnimatePresence>
        {selectedDonors !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDonors(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Donors</h2>
                  <p className="text-xs text-gray-500">{selectedCampaignName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {selectedDonors.length} total
                  </span>
                  <button onClick={() => setSelectedDonors(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[50vh]">
                {selectedDonors.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {selectedDonors.map((donor, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{donor.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      ₦
                          {donor.amount.toLocaleString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No donors yet</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Raised</span>
                  <span className="font-semibold text-gray-900">
                    {selectedDonors.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Edit Cause</h2>
                  {editForm._type === "center" && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">Center</span>
                  )}
                  {editForm._type === "normal" && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">Personal</span>
                  )}
                </div>
                <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {editForm._type === "center" && editForm.center_name && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <label className="block text-xs font-medium text-emerald-700 mb-1">Center</label>
                    <p className="text-sm text-emerald-900 font-medium flex items-center gap-2">
                      <Building2 className="w-4 h-4" />{editForm.center_name}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input type="text" value={editForm.name || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Details</label>
                  <textarea value={editForm.details || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, details: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {editForm._type !== "center" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal</label>
                      <input type="number" value={editForm.goal || 0}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, goal: Number(e.target.value) }))}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all" />
                    </div>
                  )}
                  <div className={editForm._type === "center" ? "col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select value={editForm.category || "Education"}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value as Don["category"] }))}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all">
                      {categories.filter(c => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Completion Date</label>
                  <input type="datetime-local"
                    value={editForm.date_to_completion ? new Date(Number(editForm.date_to_completion)).toISOString().slice(0, 16) : ""}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setEditForm((prev) => ({ ...prev, date_to_completion: String(date.getTime()) }));
                    }}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all" />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button onClick={handleCancelEdit}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                  <button onClick={handleSaveEdit} disabled={isSaving}
                    className="px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
                    {isSaving ? (<><DualRingSpinner />Saving...</>) : (<><Check className="w-4 h-4" />Save Changes</>)}
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