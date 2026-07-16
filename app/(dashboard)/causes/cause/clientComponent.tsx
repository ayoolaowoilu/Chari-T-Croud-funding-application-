

"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  XCircle, Flag, ChevronLeft, ChevronRight, Share2,
  Copy, X as Twitter, Heart, Clock, Users, Target,
  TrendingUp, Shield, AlertTriangle
} from 'lucide-react';
import NavBar from '@/app/components/layout/NavBar';
import { DualRingSpinner } from '@/app/components/ui/loading';
import { GetUserDetailsDyId, Handle_comment, ReportCampaign } from '@/app/lib/fetchRequests';
import { Campaign, Comments, Donor } from '@/app/lib/types';
import Footer from '@/app/components/layout/footer';
import Explain from '@/app/components/layout/explain';
import Button from '@/app/components/ui/button';
export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount);
};

function GallerySlider({ images, mainImage, onImageSelect }: {
  images: string[];
  mainImage: string;
  onImageSelect: (img: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const allImages = [mainImage, ...images.filter(img => img !== mainImage)].filter(Boolean);

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
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}>
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
            {mainImage === img && (
              <div className="absolute inset-0 bg-blue-600/10 rounded-xl" />
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
        campaign_id: campaignId
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
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

        {stage === 1 && (
          <div className="text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flag className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Report this campaign?</h3>
            <p className="text-sm text-gray-500 mb-6">Help us maintain trust by reporting campaigns that violate our guidelines.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
              <button onClick={() => setStage(2)} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Report</button>
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
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe the issue (optional)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setStage(1)} className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Back</button>
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
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
            <p className="text-sm text-gray-500 mb-4">Please check your connection and try again.</p>
            <button onClick={() => setStage(2)} className="text-sm text-blue-600 font-medium hover:text-blue-700">Try Again</button>
          </div>
        )}

        {stage === 5 && (
          <div className="py-12 flex justify-center"><DualRingSpinner /></div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function CampaignClient({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
 
  
  const [displayedMainImg, setDisplayedMainImg] = useState(campaign.main_img?.url || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [userCache, setUserCache] = useState<Record<number, { full_name: string; image: string }>>({});
  const [centerCache, setCenterCache] = useState<Record<number, { full_name: string; image: string }>>({});


  const isCenter = campaign?._type === 'center';
  const [comment_data , setComment_data] = useState<Comments>()
  const [comment_error , setComment_error] = useState(false)
  const [comment_loading , setComment_loading] = useState(false)
  const [comment_success,setComment_success] = useState(false)

  const handle_comment = async()=>{
    setComment_error(false)
    setComment_loading(true)
    setComment_success(false)
    
      const resp = await Handle_comment("GET",comment_data)
      .finally(()=>{return setComment_loading(false)})
      .catch(()=>{return setComment_error(true)});

      if(resp.error){
            setComment_error(true)
      }
      else{
         setComment_success(true)
      }
      
  }

  const fetch_comments = async(page = 0)=>{
     const resp = await Handle_comment("PUT" , {campaign_id:campaign.id} , page )
       .finally(()=>{return setComment_loading(false)})
      .catch(()=>{return setComment_error(true)});

     if(resp.error){
       setComment_error(true)
     }else{
          setComment_success(true)
     }
  }


  useEffect(() => {
    if (isCenter && campaign?.center_id && !centerCache[Number(campaign.center_id)]) {
      GetUserDetailsDyId(Number(campaign.center_id), true).then(resp => {
        if (!resp.error) setCenterCache(prev => ({ ...prev, [campaign.center_id!]: resp }));
      }).catch(console.error);
    }
  }, [campaign?.center_id, isCenter]);

  useEffect(() => {
    if (!isCenter && campaign?.user_id && !userCache[campaign.user_id]) {
      GetUserDetailsDyId(campaign.user_id, false).then(resp => {
        if (!resp.error) setUserCache(prev => ({ ...prev, [campaign.user_id]: resp }));
      }).catch(console.error);
    }
  }, [campaign?.user_id, isCenter]);

  useEffect(() => {
    if (campaign?.main_img?.url) setDisplayedMainImg(campaign.main_img.url);
  }, [campaign?.main_img]);

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
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420');
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
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
  const daysLeft = Math.ceil((Number(campaign?.date_to_completion) - Date.now()) / (1000 * 60 * 60 * 24));

  const donorsList: Donor[] = Array.isArray(campaign.donors)
    ? campaign.donors
    : JSON.parse((campaign.donors as unknown as string) || '[]');

  const sortedDonors = [...donorsList].sort((a, b) => b.amount - a.amount);
  const totalDonors = donorsList.length;

  let galleryImgs: string[] = [];
  try {
    const parsed = campaign.imgs;
    galleryImgs = Array.isArray(parsed)
      ? parsed.map((img: { url?: string } | string) => typeof img === 'string' ? img : img.url || '')
      : [];
  } catch { /* empty */ }

  const user = isCenter ? centerCache[Number(campaign.center_id)!] : userCache[campaign.user_id];
  const userName = isCenter ? campaign.center_name : user?.full_name;
  const userId = isCenter ? campaign.center_id : campaign.user_id;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/campaigns/cause?id=${campaign.id}&name=${campaign.name}`;
  const twitterText = `${campaign.name?.toUpperCase()} | Chari-T\n\n${campaign.details}\n\nDonate now: ${shareUrl}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <AnimatePresence>
        {showReport && <ReportModal campaignId={Number(campaign.id)} onClose={() => setShowReport(false)} />}
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
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${campaign.safety_rating === 'verified_safe' || campaign.safety_rating === 'likely_safe' ? 'bg-green-100 text-green-700' : campaign.safety_rating === 'uncertain' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                <Explain
                  topic={campaign.safety_rating}
                  details={campaign.safety_rating === 'likely_risky' ? 'Some users reported this as potentially fraudulent.' : campaign.safety_rating === 'likely_safe' ? 'Few reports, likely safe.' : campaign.safety_rating === 'verified_safe' ? 'Verified by our team.' : campaign.safety_rating === 'unsafe' ? 'Multiple scam reports confirmed.' : 'Not yet verified — do your research.'}
                  link="/how-it-works#ratings"
                  link_details="View Docs"
                />
              </span>
            )}
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">
              {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-0 lg:space-y-6">
            {/* Desktop hero */}
            <div className="hidden lg:block rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              <img src={displayedMainImg || undefined} alt={campaign.name} className="w-full h-[420px] object-cover" />
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
                    <span className="font-bold text-gray-900">{symbol}{formatAmount(campaign.raised)}</span>
                    <span className="text-gray-500">of {symbol}{formatAmount(campaign.goal)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                    <span>{progressPercent.toFixed(0)}% funded</span>
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                  </div>
                </div>
              )}

              {isCenter && (
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Raised</p>
                  <p className="text-3xl font-bold text-green-600">{symbol}{formatAmount(campaign.raised)}</p>
                </div>
              )}

              <button
                onClick={() => router.push(`/makedonations?topic=${campaign.name}&id=${campaign.id}&currency=${campaign.currency}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-base transition-colors"
              >
                Donate Now
              </button>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {totalDonors} donors</span>
                {!isCenter && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {daysLeft > 0 ? daysLeft : 0} days left</span>}
                <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {campaign.donation_count} donations</span>
              </div>
            </div>

            {/* Story */}
            <div className="px-4 sm:px-0 py-6 lg:py-0 bg-white lg:bg-transparent">
              <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:p-8 lg:shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">{isCenter ? 'About' : 'Our Story'}</h2>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs lg:text-sm text-gray-500">By</span>
                  {user ? (
                    <span className="text-xs lg:text-sm font-semibold text-gray-900 inline-flex items-center gap-1.5">
                      <img src={user.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <Explain
                        topic={userName as string}
                        details={isCenter ? 'Charity center profile' : 'Public profile'}
                        link={isCenter ? `/dashboard/${isCenter ? 'centers' : 'center'}/profile?id=${campaign.center_id}` :   `/profile?id=${campaign.user_id}`}
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
                  <p className={`text-sm lg:text-base text-gray-600 leading-relaxed whitespace-pre-line ${isExpanded ? '' : 'max-h-36 lg:max-h-48 overflow-hidden'}`}>
                    {isCenter ? campaign.details : campaign.story}
                  </p>
                  {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
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
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Campaign Details</h2>
                <div className={`grid grid-cols-2 ${isCenter ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
                  {!isCenter && (
                    <div>
                      <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Goal</p>
                      <p className="text-base lg:text-lg font-bold text-gray-900">{symbol}{formatAmount(campaign.goal)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Raised</p>
                    <p className="text-base lg:text-lg font-bold text-green-600">{symbol}{formatAmount(campaign.raised)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Donors</p>
                    <p className="text-base lg:text-lg font-bold text-gray-900">{totalDonors}</p>
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Days Left</p>
                    <p className="text-base lg:text-lg font-bold text-gray-900">{daysLeft > 0 ? daysLeft : 'Ended'}</p>
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
                    <div key={idx} className="flex items-center justify-between p-3 lg:p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs lg:text-sm font-bold text-gray-600">
                          {donor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm lg:text-base font-semibold text-gray-900">{donor.name}</p>
                          <p className="text-[10px] lg:text-xs text-gray-500">Donor #{idx + 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm lg:text-base font-bold text-gray-900">{symbol}{formatAmount(donor.amount)}</p>
                        {idx === 0 && <span className="text-[10px] text-amber-600 font-medium">Top donor</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile share & report */}
            <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button onClick={() => copyToClipboard(shareUrl)} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50">
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button onClick={() => shareToTwitter(twitterText, shareUrl)} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50">
                  <Twitter className="w-4 h-4" /> Tweet
                </button>
                <button onClick={() => shareNative(twitterText, campaign.name || 'Share')} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50">
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
                      <span className="font-bold text-gray-900">{symbol}{formatAmount(campaign.raised)}</span>
                      <span className="text-gray-500">of {symbol}{formatAmount(campaign.goal)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{progressPercent.toFixed(1)}% funded</p>
                  </div>
                )}

                {isCenter && (
                  <div className="text-center mb-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Raised</p>
                    <p className="text-4xl font-bold text-green-600">{symbol}{formatAmount(campaign.raised)}</p>
                  </div>
                )}

                <button
                  onClick={() => router.push(`/makedonations?topic=${campaign.name}&id=${campaign.id}&currency=${campaign.currency}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-sm hover:shadow-md"
                >
                  Donate Now
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">Secure payment processing</p>

                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalDonors}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Donors</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{daysLeft > 0 ? daysLeft : 0}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Days Left</p>
                  </div>
                </div>
              </div>

              {/* Info card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">Campaign Info</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Campaign ID', value: `#${campaign.id}` },
                    { label: 'Category', value: campaign.category },
                    { label: 'Currency', value: campaign.currency },
                    { label: 'Type', value: campaign._type },
                    { label: 'Ends', value: `in ${daysLeft > 0 ? daysLeft : 0} days` },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">Share This Cause</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button onClick={() => copyToClipboard(shareUrl)} className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                    <Copy className="w-4 h-4 mr-1.5" /> Copy
                  </button>
                  <button onClick={() => shareToTwitter(twitterText, shareUrl)} className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                    <Twitter className="w-4 h-4 mr-1.5" /> Tweet
                  </button>
                  <button onClick={() => shareNative(twitterText, campaign.name || 'Share')} className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
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
                  details={<span className="flex gap-2 justify-center items-center"><TrendingUp className="w-4 h-4" /> Get Flier</span>}
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