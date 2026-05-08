"use client"

import { motion, AnimatePresence } from 'framer-motion';
import NavBar from "@/app/components/layout/NavBar";
import { DualRingSpinner } from "@/app/components/ui/loading";
import { fetchOneCauseById, GetUserDetailsDyId, ReportCampaign } from "@/app/lib/fetchRequests";
import { XCircle, AlertTriangle, Flag, EyeOff, ShieldAlert, HeartCrack, Trash2, Send, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { Campaign, Donor, UserData } from '@/app/lib/types';
import Footer from '@/app/components/layout/footer';
import Explain from '@/app/components/layout/explain';

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const [reportStage, setReportStage] = useState(1);
  const [reportType, setReportType] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const { data: session } = useSession();
const [isExpanded, setIsExpanded] = useState(false);

  const [userCache, setUserCache] = useState<Record<number, { full_name: string; image: string }>>({});
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayedMainImg, setDisplayedMainImg] = useState<string>("");

  useEffect(() => {
    if (name && campaign) {
      window.document.title = "Chari-T | " + name;
    } else if (campaign) {
      window.document.title = "Chari-T | " + campaign.name;
    }else{
       window.document.title = "404 campaign not found"
    }
  }, [name, campaign ]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const shareText = async (text: string, title = 'Share') => {
    if (navigator.share) {
      await navigator.share({
        title: title,
        text: text,
      });
    }
  };

  const shareToTwitter = (text: string, url = '') => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    const twitterUrl = `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420,scrollbars=yes');
  };

  const handleSubmitReport = async () => {
    if (!campaign) return;

    const payload = {
      _type: reportType,
      message: reportMessage || "No message",
      reporter_name: session?.user?.name || "unknown user",
      campaign_id: Number(campaign.id)
    };

    setReportStage(5);

    try {
      const resp = await ReportCampaign(payload);
      if (resp.error) {
        setReportStage(4);
        return;
      }
      setReportStage(3);
      setTimeout(() => setReportStage(0), 4000);
    } catch (err) {
      setReportStage(4);
    }
  };

  const fetchData = async () => {
    if (!id) return;
    try {
      const resp = await fetchOneCauseById(Number(id), 1);
      setCampaign(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (campaign?.user_id && !userCache[campaign.user_id]) {
      const getUser = async () => {
        try {
         
          const resp = await GetUserDetailsDyId(campaign.user_id);
      
          if (resp.error) {
            console.error("Failed to fetch user:", resp.error);
            return;
          }
          setUserCache(prev => ({ ...prev, [campaign.user_id]: resp }));
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      getUser();
    }
  }, [campaign?.user_id, userCache]);

  useEffect(() => {
    if (!campaign) return;
    try {
      const parsed = JSON.parse(campaign.main_img);
      setDisplayedMainImg(parsed.url || parsed);
    } catch {
      setDisplayedMainImg(campaign.main_img);
    }
  }, [campaign?.main_img]);



  const renderReport = () => {
    return (
      <div className="fixed z-40 bottom-4 sm:bottom-5 right-4 sm:right-5 w-[calc(100%-2rem)] sm:w-auto md:max-w-sm p-4 sm:p-5 rounded-2xl bg-white shadow-2xl border border-gray-100">
        <AnimatePresence mode="wait">
          {reportStage === 0 && (
            <motion.div
              key="stage0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setReportStage(1)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-red-50 group-hover:bg-red-100 transition-colors">
                <Flag className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Report Campaign</span>
            </motion.div>
          )}

          {reportStage === 1 && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Report this campaign?</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Help us maintain trust by reporting campaigns that violate our guidelines.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setReportStage(2)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  Report
                </button>
                <button
                  onClick={() => setReportStage(0)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                >
                  Ignore
                </button>
              </div>
            </motion.div>
          )}

          {reportStage === 2 && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Flag className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-gray-900">Submit Report</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    Report Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'misrepresentation', label: 'Misrepresentation', icon: EyeOff },
                      { id: 'fraud', label: 'Fraud', icon: ShieldAlert },
                      { id: 'exploitative', label: 'Exploitative', icon: HeartCrack },
                      { id: 'spam', label: 'Spam', icon: Trash2 },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setReportType(type.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${reportType === type.id
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                      >
                        <type.icon className="w-3.5 h-3.5" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    Additional Details
                  </label>
                  <textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setReportStage(1)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={!reportType}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit Report
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {reportStage === 3 && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
              >
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-1">Report Submitted</h3>
              <p className="text-sm text-gray-500 mb-4">Thank you for helping keep our community safe.</p>
              <button
                onClick={() => setReportStage(0)}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          )}

          {reportStage === 4 && (
            <motion.div
              key="stage4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"
              >
                <XCircle className="w-6 h-6 text-red-600" />
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-1">Report not Submitted</h3>
              <p className="text-sm text-gray-500 mb-4">Network error</p>
              <button
                onClick={() => setReportStage(2)}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Try again
              </button>
            </motion.div>
          )}

          {reportStage === 5 && (
            <div className='p-12'>
              <DualRingSpinner />
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <NavBar />
        <div className="text-gray-500"><DualRingSpinner /></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <NavBar />
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={20} color="red" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign not found!</h2>
          <p className="text-gray-600">Thank you for your support!</p>
        </div>
      </div>
    );
  }

  if (campaign.goal === campaign.raised && campaign.raised > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <NavBar />
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Goal Reached!</h2>
          <p className="text-gray-600">The goal of this campaign has been met. Thank you for your support!</p>
        </div>
      </div>
    );
  }

  const currencySymbols: Record<string, string> = {
    NG: "₦",
    USD: "$",
    EURO: "€"
  };

  const symbol = currencySymbols[campaign.currency] || "₦";
  const progressPercent = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const daysLeft = Math.ceil((Number(campaign?.date_to_completion) - Date.now()) / (1000 * 60 * 60 * 24));

  const donorsList: Donor[] = Array.isArray(campaign.donors)
    ? campaign.donors
    : JSON.parse(campaign.donors as unknown as string || "[]");

  const sortedDonors = [...donorsList].sort((a, b) => b.amount - a.amount);
  const totalDonors = donorsList.length;

  let galleryImgs: string[] = [];
  try {
    const parsed = campaign.imgs;
    galleryImgs = Array.isArray(parsed) ? parsed.map((img: { url?: string } | string) => typeof img === 'string' ? img : img.url || '') : [];
  } catch {
    galleryImgs = [];
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const user = userCache[campaign.user_id];

  const handleCategoryClick = () => {
    router.push(`/causes/get?category=${campaign.category}`);
  };

  const handleDonateClick = () => {
    router.push(`/makedonations?topic=${campaign.name}&id=${campaign.id}&currency=${campaign.currency}`);
  };

  const handleGalleryClick = (img: string) => {
    setDisplayedMainImg(img);
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_API_URL}/causes/cause?id=${id}&name=${name}`;
  const twitterShareText = `${name?.toLocaleUpperCase()}\n\n${campaign.details}\n\n${campaign.story}\n\nDonate now ${shareUrl}`;
  const nativeShareText = `${name?.toLocaleUpperCase()}\n\n${campaign.details}\n\n${campaign.story}\n\nDonate now ${shareUrl}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <NavBar />
      {renderReport()}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handleCategoryClick}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide hover:bg-blue-100 transition-colors"
            >
              {campaign.category}
            </button>
            <span className={`px-3 py-1 ${campaign.safety_rating === 'verified_safe' || campaign.safety_rating === 'likely_safe' ? 'bg-green-100 text-green-700' : campaign.safety_rating === 'uncertain' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'} text-xs font-semibold rounded-full  tracking-wide`}>
              <div>
                <Explain
                  topic={campaign.safety_rating}
                  details={campaign.safety_rating == "likely_risky" ? "A few amount of people has already reported this campaign , tagging it a scam scheme and it has not been confirmed yet" : campaign.safety_rating == "likely_safe" ? "This campaign is likely safe meaning that little to no people have reported this campaign" : campaign.safety_rating == "verified_safe" ? "This campaign is verified and its cause is of real importance to this user" : campaign.safety_rating == "unsafe" ? "This campaign is unsafe to donate to as it has recived a large amount of reports tagging it a scam scheme" : "This campaign has not been verified yet but it is also not tagged as a risky campaign either , so be sure to do your research before donating to this campaign"}
                  link="/docs/safety-ratings"
                  link_details='View Docs'
                />
              </div>
            </span>

            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-500 text-sm">
              Created {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
            {campaign.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              <img
                src={displayedMainImg || undefined}
                alt={campaign.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {galleryImgs.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {galleryImgs.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleGalleryClick(img)}
                    className="rounded-lg overflow-hidden border border-gray-200 aspect-video hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={img}
                      alt={`Campaign ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="lg:hidden">
              <button
                onClick={handleDonateClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Donate Now — {symbol}{formatAmount(campaign.goal - campaign.raised)} to go
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                Secure payment processing • {campaign.donation_count} people donated
              </p>
            </div>

       <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
  <div className="flex items-center gap-2 mb-4">
    <h2 className="text-xl font-bold text-gray-900">Our Story</h2>
    <span className="text-gray-400">·</span>
    <span className="text-sm text-gray-500">By</span>
    {user ? (
      <span className="font-semibold text-gray-900 text-sm inline-flex items-center">
        <div className="rounded-full border border-gray-200 w-6 h-6 overflow-hidden mr-2 inline-flex items-center justify-center shrink-0">
          <img src={user.image} alt={user.full_name} className="w-6 h-6 rounded-full object-cover" />
        </div>
       <Explain 
        topic={user.full_name}
        details="This is a public profile"
        link={`/profile?id=${campaign.user_id}`}
        link_details={"View profile"}
       />
      </span>
    ) : (
      <span className="text-sm text-gray-400">Undefined</span>
    )}
  </div>
  <div className="relative">
    <p className={`text-gray-700 leading-relaxed text-base whitespace-pre-line transition-all duration-300 ${isExpanded ? '' : 'max-h-48 overflow-hidden'}`}>
      {campaign.story}
    </p>
    {!isExpanded && (
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    )}
  </div>
  {campaign.story && campaign.story.length > 300 && (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
    >
      {isExpanded ? 'Show less' : 'Read more'}
    </button>
  )}
</div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Campaign Details</h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line mb-6">
                {campaign.details}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Goal</p>
                  <p className="text-lg font-bold text-gray-900">{symbol}{formatAmount(campaign.goal)}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Raised</p>
                  <p className="text-lg font-bold text-green-600">{symbol}{formatAmount(campaign.raised)}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Donors</p>
                  <p className="text-lg font-bold text-gray-900">{totalDonors}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Days Left</p>
                  <p className="text-lg font-bold text-gray-900">{daysLeft > 0 ? daysLeft : 'Ended'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Top Donors</h2>
                <span className="text-sm text-gray-500">{totalDonors} total supporters</span>
              </div>

              <div className="space-y-3">
                {sortedDonors.map((donor: Donor, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                        {donor.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{donor.name}</p>
                        <p className="text-xs text-gray-500">Donor #{idx + 1}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{symbol}{formatAmount(donor.amount)}</p>
                      {idx === 0 && (
                        <span className="text-xs text-amber-600 font-medium">Top donor</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden">
              <button
                onClick={handleDonateClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Donate Now — Join {totalDonors} others
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                Every contribution brings us closer to our goal
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-900">{symbol}{formatAmount(campaign.raised)}</span>
                    <span className="text-gray-500">of {symbol}{formatAmount(campaign.goal)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{progressPercent.toFixed(1)}% funded</p>
                </div>

                <button
                  onClick={handleDonateClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  Donate Now
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Secure payment processing
                </p>

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

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Campaign Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Campaign ID</span>
                    <span className="font-medium text-gray-900">#{campaign.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-900">{campaign.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Currency</span>
                    <span className="font-medium text-gray-900">{campaign.currency}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium text-gray-900 capitalize">{campaign._type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Ends</span>
                    <span className="font-medium text-gray-900">
                      in {daysLeft > 0 ? daysLeft : 0} Days
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Share This Cause</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => copyToClipboard(shareUrl)}
                    className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => shareToTwitter(twitterShareText, shareUrl)}
                    className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    Tweet
                  </button>
                  <button
                    onClick={() => shareText(nativeShareText, name || 'Share')}
                    className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}