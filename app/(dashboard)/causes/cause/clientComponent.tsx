'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  XCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  X as Twitter,
  Heart,
  Clock,
  Users,
  Target,
  TrendingUp,
  Shield,
  AlertTriangle,
  MessageCircle,
  Send,
  User,
  Bell,
  BellOff,
} from 'lucide-react';
import NavBar from '@/app/components/layout/NavBar';
import { DualRingSpinner } from '@/app/components/ui/loading';
import {
  GetUserDetailsDyId,
  Handle_comment,
  Handle_subscribe,
  ReportCampaign,
} from '@/app/lib/fetchRequests';
import { Campaign, Comments, Donor } from '@/app/lib/types';
import Footer from '@/app/components/layout/footer';
import Explain from '@/app/components/layout/explain';
import Button from '@/app/components/ui/button';

interface Subscribed {
  user_id?: string;
  name?: string;
  email?: string;
  img_url?: string;
  identity_key?: string;
  campaign_id?: number;
}

export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount);
};

function GallerySlider({
  images,
  mainImage,
  onImageSelect,
}: {
  images: string[];
  mainImage: string;
  onImageSelect: (img: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const allImages = [mainImage, ...images.filter((img) => img !== mainImage)].filter(Boolean);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkScroll);
    return () => el?.removeEventListener('scroll', checkScroll);
  }, [allImages]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allImages.map((img, idx) => (
          <motion.button
            key={idx}
            onClick={() => onImageSelect(img)}
            className="relative shrink-0 snap-start"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
            {mainImage === img && (
              <div className="absolute inset-0 bg-[var(--brand)]/10 rounded-xl" />
            )}
          </motion.button>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-white transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
      )}
    </div>
  );
}

function ReportModal({ campaignId, onClose }: { campaignId: number; onClose: () => void }) {
  const [stage, setStage] = useState(1);
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const { data: session } = useSession();

  const handleSubmit = async () => {
    setStage(5);
    try {
      const resp = await ReportCampaign({
        _type: type,
        message: message || 'No message',
        reporter_name: session?.user?.name || 'unknown user',
        campaign_id: campaignId,
      });
      setStage(resp.error ? 4 : 3);
      if (!resp.error) setTimeout(onClose, 3000);
    } catch {
      setStage(4);
    }
  };

  const reportTypes = [
    { id: 'misrepresentation', label: 'Misrepresentation', icon: AlertTriangle },
    { id: 'fraud', label: 'Fraud', icon: Shield },
    { id: 'exploitative', label: 'Exploitative', icon: Heart },
    { id: 'spam', label: 'Spam', icon: XCircle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 text-black z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full sm:w-105 sm:rounded-2xl rounded-t-2xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

        {stage === 1 && (
          <div className="text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flag className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Report this campaign?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Help us maintain trust by reporting campaigns that violate our guidelines.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStage(2)}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                Report
              </button>
            </div>
          </div>
        )}

        {stage === 2 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">What's the issue?</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {reportTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${type === t.id ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue (optional)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStage(1)}
                className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!type}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Report Submitted</h3>
            <p className="text-sm text-gray-500">Thank you for helping keep our community safe.</p>
          </div>
        )}

        {stage === 4 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Failed to Submit</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please check your connection and try again.
            </p>
            <button
              onClick={() => setStage(2)}
              className="text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {stage === 5 && (
          <div className="py-12 flex justify-center">
            <DualRingSpinner />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CommentSection({ campaignId }: { campaignId: number }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comments[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComments = async (pageNum = 0, append = false) => {
    setLoading(true);
    setError(false);
    try {
      const resp = await Handle_comment('GET', { campaign_id: campaignId }, pageNum);
      if (resp.error) {
        setError(true);
      } else {
        const fetched = resp.comments || resp.data || [];
        setTotalCount(resp.total_count || resp.count || fetched.length);
        if (append) {
          setComments((prev) => [...prev, ...fetched]);
        } else {
          setComments(fetched);
        }
        setHasMore(fetched.length >= 10);
        setPage(pageNum);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError(false);
    try {
      const commentData: Comments = {
        comment: newComment.trim(),
        campaign_id: campaignId,
        name: session?.user?.name || 'Anonymous',
        email: session?.user?.email || '',
        user_id: '1',
        img_url: session?.user.image,
        identity_key: session?.user.id,
      };
      const resp = await Handle_comment('PUT', commentData);
      if (resp.error) {
        setError(true);
      } else {
        setNewComment('');
        fetchComments(0, false);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    fetchComments(page + 1, true);
  };

  useEffect(() => {
    fetchComments(0, false);
  }, [campaignId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="px-4 sm:px-0 py-6 lg:py-0 bg-white lg:bg-transparent border-t lg:border-0 border-gray-100">
      <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:p-8 lg:shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Comments
          </h2>
          <span className="text-xs lg:text-sm text-gray-500">{totalCount} total</span>
        </div>

        {/* Comment Input */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="shrink-0">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                />
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
                placeholder={session ? 'Write a comment...' : 'Sign in to comment'}
                rows={2}
                disabled={!session || submitting}
                className="w-full px-3 py-2.5 text-black bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none disabled:bg-gray-100 disabled:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                {!session && (
                  <span className="text-xs text-gray-400">Sign in to leave a comment</span>
                )}
                <div className="flex-1" />
                <button
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || !session || submitting}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-xl hover:bg-[var(--brand-hover)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <DualRingSpinner />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && comments.length === 0 && (
          <div className="text-center py-8">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">Failed to load comments</p>
            <button
              onClick={() => fetchComments(0, false)}
              className="text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment, idx) => (
              <motion.div
                key={comment.identity_key || `${comment.user_id}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-3"
              >
                <div className="shrink-0">
                  {comment.img_url ? (
                    <img
                      src={comment.img_url}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-500">
                        {(comment.name || 'A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-words">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {loading && comments.length === 0 && (
          <div className="py-8 flex justify-center">
            <DualRingSpinner />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && comments.length === 0 && (
          <div className="text-center py-10">
            <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No comments yet</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts</p>
          </div>
        )}

        {/* Load More */}
        {hasMore && comments.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
            >
              {loading ? 'Loading...' : 'Load more comments'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SubscribersSection({
  campaignId,
  subscribers,
  subscribersCount,
  subscribersLoading,
  subscribersHasMore,
  onLoadMore,
}: {
  campaignId: number;
  subscribers: Subscribed[];
  subscribersCount: number;
  subscribersLoading: boolean;
  subscribersHasMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="px-4 sm:px-0 py-6 lg:py-0 bg-white lg:bg-transparent border-t lg:border-0 border-gray-100">
      <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:p-8 lg:shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Subscribers
          </h2>
          <span className="text-xs lg:text-sm text-gray-500">{subscribersCount} total</span>
        </div>

        {subscribersLoading && subscribers.length === 0 && (
          <div className="py-8 flex justify-center">
            <DualRingSpinner />
          </div>
        )}

        {!subscribersLoading && subscribers.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No subscribers yet</p>
            <p className="text-xs text-gray-400 mt-1">Subscribe to get updates on this campaign</p>
          </div>
        )}

        {subscribers.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
            {subscribers.map((sub, idx) => (
              <div
                key={sub.identity_key || `${sub.user_id}-${idx}`}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all"
              >
                {sub.img_url ? (
                  <img
                    src={sub.img_url}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-600">
                      {(sub.name || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 truncate">
                  {sub.name || 'Anonymous'}
                </span>
              </div>
            ))}
          </div>
        )}

        {subscribersHasMore && subscribers.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={onLoadMore}
              disabled={subscribersLoading}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
            >
              {subscribersLoading ? 'Loading...' : 'Load more subscribers'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CampaignClient({ campaign }: { campaign: Campaign }) {
  const router = useRouter();

  const [displayedMainImg, setDisplayedMainImg] = useState(campaign.main_img?.url || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [userCache, setUserCache] = useState<Record<number, { full_name: string; image: string }>>(
    {},
  );
  const [centerCache, setCenterCache] = useState<
    Record<number, { full_name: string; image: string }>
  >({});

  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscribed[]>([]);
  const [subscribersCount, setSubscribersCount] = useState<number>(campaign.subscribed_count ?? 0);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscribersPage, setSubscribersPage] = useState(0);
  const [subscribersHasMore, setSubscribersHasMore] = useState(false);

  const { data: session } = useSession();
  const isCenter = campaign?._type === 'center';

  useEffect(() => {
    if (isCenter && campaign?.center_id && !centerCache[Number(campaign.center_id)]) {
      GetUserDetailsDyId(Number(campaign.center_id), true)
        .then((resp) => {
          if (!resp.error) setCenterCache((prev) => ({ ...prev, [campaign.center_id!]: resp }));
        })
        .catch(console.error);
    }
  }, [campaign?.center_id, isCenter]);

  useEffect(() => {
    if (!isCenter && campaign?.user_id && !userCache[campaign.user_id]) {
      GetUserDetailsDyId(campaign.user_id, false)
        .then((resp) => {
          if (!resp.error) setUserCache((prev) => ({ ...prev, [campaign.user_id]: resp }));
        })
        .catch(console.error);
    }
  }, [campaign?.user_id, isCenter]);

  useEffect(() => {
    if (campaign?.main_img?.url) setDisplayedMainImg(campaign.main_img.url);
  }, [campaign?.main_img]);

  const fetchSubscribers = async (pageNum = 0, append = false) => {
    setSubscribersLoading(true);
    try {
      const resp = await Handle_subscribe('GET', { campaign_id: campaign.id }, pageNum);
      if (!resp.error) {
        const fetched: Subscribed[] = resp.subscribed || [];
        setSubscribersCount(resp.total_count ?? fetched.length);
        setSubscribers((prev) => (append ? [...prev, ...fetched] : fetched));
        setSubscribersHasMore(!!resp.has_more);
        setSubscribersPage(pageNum);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!session?.user?.id) {
      setIsSubscribed(false);
      setCheckingSubscription(false);
      return;
    }
    setCheckingSubscription(true);
    try {
      const resp = await Handle_subscribe('CHECK', {
        identity_key: session.user.id,
        campaign_id: campaign.id,
      });
      setIsSubscribed(!resp.error);
    } catch {
      setIsSubscribed(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handle_subscribe = async () => {
    if (!session) return;
    setSubscribeLoading(true);
    try {
      const resp = await Handle_subscribe('PUT', {
        name: session?.user.name,
        email: session?.user.email as string,
        identity_key: session?.user.id,
        campaign_id: campaign.id,
        img_url: session?.user.image,
      });
      if (!resp.error) {
        setIsSubscribed(true);
        setSubscribersCount((prev) => prev + 1);
        fetchSubscribers(0, false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const handle_unsubscribe = async () => {
    if (!session) return;
    setSubscribeLoading(true);
    try {
      const resp = await Handle_subscribe('UN_SUB', {
        identity_key: session?.user.id,
        campaign_id: campaign.id,
      });
      if (!resp.error) {
        setIsSubscribed(false);
        setSubscribersCount((prev) => Math.max(prev - 1, 0));
        fetchSubscribers(0, false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const toggleSubscribe = () => {
    if (!session || subscribeLoading || checkingSubscription) return;
    isSubscribed ? handle_unsubscribe() : handle_subscribe();
  };

  const handleLoadMoreSubscribers = () => {
    fetchSubscribers(subscribersPage + 1, true);
  };

  useEffect(() => {
    checkSubscription();
  }, [session?.user?.id, campaign.id]);

  useEffect(() => {
    fetchSubscribers(0, false);
  }, [campaign.id]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  const shareToTwitter = (text: string, url: string) => {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=420',
    );
  };

  const shareNative = async (text: string, title: string) => {
    if (navigator.share) await navigator.share({ title, text });
  };

  // Early returns for special states
  if (!isCenter && campaign.goal === campaign.raised && campaign.raised > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <NavBar />
        <div className="text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-7 h-7 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Goal Reached!</h2>
          <p className="text-gray-500 mt-1">This campaign has met its target.</p>
        </div>
      </div>
    );
  }

  const currencySymbols: Record<string, string> = { NG: '₦', USD: '$', EURO: '€' };
  const symbol = currencySymbols[campaign.currency] || '₦';
  const progressPercent = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const daysLeft = Math.ceil(
    (Number(campaign?.date_to_completion) - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const donorsList: Donor[] = Array.isArray(campaign.donors)
    ? campaign.donors
    : JSON.parse((campaign.donors as unknown as string) || '[]');

  const sortedDonors = [...donorsList].sort((a, b) => b.amount - a.amount);
  const totalDonors = donorsList.length;

  let galleryImgs: string[] = [];
  try {
    const parsed = campaign.imgs;
    galleryImgs = Array.isArray(parsed)
      ? parsed.map((img: { url?: string } | string) =>
          typeof img === 'string' ? img : img.url || '',
        )
      : [];
  } catch {
    /* empty */
  }

  const user = isCenter ? centerCache[Number(campaign.center_id)!] : userCache[campaign.user_id];
  const userName = isCenter ? campaign.center_name : user?.full_name;
  const userId = isCenter ? campaign.center_id : campaign.user_id;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/campaigns/cause?id=${campaign.id}&name=${campaign.name}`;
  const twitterText = `${campaign.name?.toUpperCase()} | Chari-T\n\n${campaign.details}\n\nDonate now: ${shareUrl}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <AnimatePresence>
        {showReport && (
          <ReportModal campaignId={Number(campaign.id)} onClose={() => setShowReport(false)} />
        )}
      </AnimatePresence>

      {/* Mobile hero */}
      <div className="lg:hidden relative w-full aspect-4/3 bg-gray-200">
        <img
          src={displayedMainImg || undefined}
          alt={campaign.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold mb-2">
            {campaign.category}
          </span>
          <h1 className="text-2xl font-bold leading-tight">{campaign.name}</h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8">
        {/* Desktop header */}
        <div className="hidden lg:block mb-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => router.push(`/causes/get?category=${campaign.category}`)}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide hover:bg-blue-100 transition-colors"
            >
              {campaign.category}
            </button>
            {!isCenter && (
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${campaign.safety_rating === 'verified_safe' || campaign.safety_rating === 'likely_safe' ? 'bg-green-100 text-green-700' : campaign.safety_rating === 'uncertain' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}
              >
                <Explain
                  topic={campaign.safety_rating}
                  details={
                    campaign.safety_rating === 'likely_risky'
                      ? 'Some users reported this as potentially fraudulent.'
                      : campaign.safety_rating === 'likely_safe'
                        ? 'Few reports, likely safe.'
                        : campaign.safety_rating === 'verified_safe'
                          ? 'Verified by our team.'
                          : campaign.safety_rating === 'unsafe'
                            ? 'Multiple scam reports confirmed.'
                            : 'Not yet verified — do your research.'
                  }
                  link="/how-it-works#ratings"
                  link_details="View Docs"
                />
              </span>
            )}
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">
              {new Date(campaign.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-0 lg:space-y-6">
            {/* Desktop hero */}
            <div className="hidden lg:block rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              <img
                src={displayedMainImg || undefined}
                alt={campaign.name}
                className="w-full h-105 object-cover"
              />
            </div>

            {/* Gallery */}
            {galleryImgs.length > 0 && (
              <div className="px-4 sm:px-0 py-4 lg:py-0 bg-white lg:bg-transparent border-b lg:border-0 border-gray-100">
                <GallerySlider
                  images={galleryImgs}
                  mainImage={displayedMainImg}
                  onImageSelect={setDisplayedMainImg}
                />
              </div>
            )}

            {/* Mobile action bar */}
            <div className="lg:hidden px-4 py-4 bg-white border-b border-gray-100">
              {!isCenter && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-bold text-gray-900">
                      {symbol}
                      {formatAmount(campaign.raised)}
                    </span>
                    <span className="text-gray-500">
                      of {symbol}
                      {formatAmount(campaign.goal)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-[var(--brand)] h-full rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                    <span>{progressPercent.toFixed(0)}% funded</span>
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                  </div>
                </div>
              )}

              {isCenter && (
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Total Raised
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {symbol}
                    {formatAmount(campaign.raised)}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/makedonations?topic=${campaign.name}&id=${campaign.id}&currency=${campaign.currency}`,
                    )
                  }
                  className="flex-1 bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-base transition-colors"
                >
                  Donate Now
                </button>
                <button
                  onClick={toggleSubscribe}
                  disabled={!session || subscribeLoading || checkingSubscription}
                  className={`shrink-0 flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSubscribed ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                  {subscribeLoading ? (
                    <DualRingSpinner />
                  ) : isSubscribed ? (
                    <BellOff className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {totalDonors} donors
                </span>
                {!isCenter && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {daysLeft > 0 ? daysLeft : 0} days left
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" /> {campaign.donation_count} donations
                </span>
                <span className="flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" /> {subscribersCount} subscribers
                </span>
              </div>
            </div>

            {/* Story */}
            <div className="px-4 sm:px-0 py-6 lg:py-0 bg-white lg:bg-transparent">
              <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:p-8 lg:shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                    {isCenter ? 'About' : 'Our Story'}
                  </h2>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs lg:text-sm text-gray-500">By</span>
                  {user ? (
                    <span className="text-xs lg:text-sm font-semibold text-gray-900 inline-flex items-center gap-1.5">
                      <img src={user.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <Explain
                        topic={userName as string}
                        details={isCenter ? 'Charity center profile' : 'Public profile'}
                        link={
                          isCenter
                            ? `/dashboard/${isCenter ? 'centers' : 'center'}/profile?id=${campaign.center_id}`
                            : `/profile?id=${campaign.user_id}`
                        }
                        link_details="View profile"
                      />
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Loading...</span>
                  )}
                  {isCenter && (
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                    </svg>
                  )}
                </div>

                <div className="relative">
                  <p
                    className={`text-sm lg:text-base text-gray-600 leading-relaxed whitespace-pre-line ${isExpanded ? '' : 'max-h-36 lg:max-h-48 overflow-hidden'}`}
                  >
                    {isCenter ? campaign.details : campaign.story}
                  </p>
                  {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent" />
                  )}
                </div>
                {(isCenter ? campaign.details : campaign.story)?.length > 200 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="px-4 sm:px-0 py-6 lg:py-0 bg-white lg:bg-transparent border-t lg:border-0 border-gray-100">
              <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:p-8 lg:shadow-sm">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">
                  Campaign Details
                </h2>
                <div
                  className={`grid grid-cols-2 ${isCenter ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}
                >
                  {!isCenter && (
                    <div>
                      <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Goal
                      </p>
                      <p className="text-base lg:text-lg font-bold text-gray-900">
                        {symbol}
                        {formatAmount(campaign.goal)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Raised
                    </p>
                    <p className="text-base lg:text-lg font-bold text-green-600">
                      {symbol}
                      {formatAmount(campaign.raised)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Donors
                    </p>
                    <p className="text-base lg:text-lg font-bold text-gray-900">{totalDonors}</p>
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Days Left
                    </p>
                    <p className="text-base lg:text-lg font-bold text-gray-900">
                      {daysLeft > 0 ? daysLeft : 'Ended'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Subscribers
                    </p>
                    <p className="text-base lg:text-lg font-bold text-gray-900">
                      {subscribersCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Comments
                    </p>
                    <p className="text-base lg:text-lg font-bold text-gray-900">
                      {campaign.comments_count ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Donors */}
            <div className="px-4 sm:px-0 py-6 lg:py-0 bg-white lg:bg-transparent border-t lg:border-0 border-gray-100">
              <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:p-8 lg:shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">Top Donors</h2>
                  <span className="text-xs lg:text-sm text-gray-500">{totalDonors} total</span>
                </div>
                <div className="space-y-2">
                  {sortedDonors.slice(0, 5).map((donor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 lg:p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs lg:text-sm font-bold text-gray-600">
                          {donor.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm lg:text-base font-semibold text-gray-900">
                            {donor.name}
                          </p>
                          <p className="text-[10px] lg:text-xs text-gray-500">Donor #{idx + 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm lg:text-base font-bold text-gray-900">
                          {symbol}
                          {formatAmount(donor.amount)}
                        </p>
                        {idx === 0 && (
                          <span className="text-[10px] text-amber-600 font-medium">Top donor</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscribers */}
            <SubscribersSection
              campaignId={Number(campaign.id)}
              subscribers={subscribers}
              subscribersCount={subscribersCount}
              subscribersLoading={subscribersLoading}
              subscribersHasMore={subscribersHasMore}
              onLoadMore={handleLoadMoreSubscribers}
            />

            {/* Comments Section */}
            <CommentSection campaignId={Number(campaign.id)} />

            {/* Mobile share & report */}
            <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => copyToClipboard(shareUrl)}
                  className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button
                  onClick={() => shareToTwitter(twitterText, shareUrl)}
                  className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50"
                >
                  <Twitter className="w-4 h-4" /> Tweet
                </button>
                <button
                  onClick={() => shareNative(twitterText, campaign.name || 'Share')}
                  className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
              {!isCenter && (
                <button
                  onClick={() => setShowReport(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl active:bg-red-100 transition-colors"
                >
                  <Flag className="w-4 h-4" /> Report this campaign
                </button>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              {/* Donation card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                {!isCenter && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-gray-900">
                        {symbol}
                        {formatAmount(campaign.raised)}
                      </span>
                      <span className="text-gray-500">
                        of {symbol}
                        {formatAmount(campaign.goal)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-[var(--brand)] h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {progressPercent.toFixed(1)}% funded
                    </p>
                  </div>
                )}

                {isCenter && (
                  <div className="text-center mb-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Total Raised
                    </p>
                    <p className="text-4xl font-bold text-green-600">
                      {symbol}
                      {formatAmount(campaign.raised)}
                    </p>
                  </div>
                )}

                <button
                  onClick={() =>
                    router.push(
                      `/makedonations?topic=${campaign.name}&id=${campaign.id}&currency=${campaign.currency}`,
                    )
                  }
                  className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-sm hover:shadow-md"
                >
                  Donate Now
                </button>

                <button
                  onClick={toggleSubscribe}
                  disabled={!session || subscribeLoading || checkingSubscription}
                  className={`w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSubscribed ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                  {subscribeLoading ? (
                    <DualRingSpinner />
                  ) : isSubscribed ? (
                    <>
                      <BellOff className="w-4 h-4" /> Subscribed
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" /> Subscribe for updates
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">Secure payment processing</p>

                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalDonors}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Donors</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {daysLeft > 0 ? daysLeft : 0}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Days Left</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{subscribersCount}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                      Subscribers
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaign.comments_count ?? 0}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Comments</p>
                  </div>
                </div>
              </div>

              {/* Info card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">
                  Campaign Info
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Campaign ID', value: `#${campaign.id}` },
                    { label: 'Category', value: campaign.category },
                    { label: 'Currency', value: campaign.currency },
                    { label: 'Type', value: campaign._type },
                    { label: 'Ends', value: `in ${daysLeft > 0 ? daysLeft : 0} days` },
                    { label: 'Subscribers', value: subscribersCount },
                    { label: 'Comments', value: campaign.comments_count ?? 0 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">
                  Share This Cause
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={() => copyToClipboard(shareUrl)}
                    className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-1.5" /> Copy
                  </button>
                  <button
                    onClick={() => shareToTwitter(twitterText, shareUrl)}
                    className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Twitter className="w-4 h-4 mr-1.5" /> Tweet
                  </button>
                  <button
                    onClick={() => shareNative(twitterText, campaign.name || 'Share')}
                    className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-1.5" /> Share
                  </button>
                </div>
                <Button
                  onClick={() => {
                    const flierUrl = `/causes/flier?_type=${campaign._type}&center_name=${encodeURIComponent(campaign.center_name || '')}&campaign_name=${encodeURIComponent(campaign.name)}&raised=${campaign.raised}&goal=${campaign.goal}&campaign_id=${campaign.id}&campaign_logo_url=${encodeURIComponent(campaign.main_img.url || '')}&qr_code_url=${encodeURIComponent(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${typeof window !== 'undefined' ? window.location.origin : ''}/campaigns/cause?id=${campaign.id}`)}&tagline=${encodeURIComponent(campaign.details || '')}&details=${encodeURIComponent(campaign?.story?.slice(0, 1500) + '...' || '')}`;
                    window.open(flierUrl, '_blank');
                  }}
                  variant="outline"
                  className="w-full"
                  size="md"
                  details={
                    <span className="flex gap-2 justify-center items-center">
                      <TrendingUp className="w-4 h-4" /> Get Flier
                    </span>
                  }
                />
              </div>

              {/* Report */}
              {!isCenter && (
                <button
                  onClick={() => setShowReport(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Flag className="w-4 h-4" /> Report this campaign
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
