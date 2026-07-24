'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Heart, Mail, MessageSquare, Shield, UserCircle, XCircle, ArrowLeft } from 'lucide-react';
import NavBar from '@/app/components/layout/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fetchOneCauseById, GetUserDetailsDyId } from '@/app/lib/fetchRequests';
import { DualRingSpinner } from '@/app/components/ui/loading';
import { Campaign } from '@/app/lib/types';
import Footer from '@/app/components/layout/footer';
import PaystackPopup from '@/app/components/paystackpopup';
import Explain from '@/app/components/layout/explain';

const FEE_PRESETS = [0, 500, 1000, 2000, 3000, 4000];

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>();
  const [centerCache, setCenterCache] = useState<
    Record<number, { full_name: string; image: string }>
  >({});
  const currency = campaign?.currency;

  const presetAmounts = useMemo(() => {
    if (currency === 'NG') {
      return ['1000', '5000', '10000', '25000', '50000'];
    } else {
      return ['25', '50', '100', '250', '500'];
    }
  }, [currency]);

  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const donationId = searchParams.get('id') as string;
  const name = campaign?.name;

  const [loading, setLoading] = useState(true);
  const { status, data: session } = useSession();
  const [platFormFee, setPlatformFee] = useState<number>(0);
  const [isBlind, setIsBlind] = useState(false);

  const baseDonation = useMemo(() => {
    if (amount === 'custom') return Math.max(0, Number(customAmount) || 0);
    return Math.max(0, Number(amount) || 0);
  }, [amount, customAmount]);

  const totalCharge = baseDonation + Math.max(0, platFormFee);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      if (!donationId) {
        setLoading(false);
        setCampaign(null);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchOneCauseById(Number(donationId), 0);
        if (cancelled) return;
        if (data?.error || !data?.id) {
          setCampaign(null);
        } else {
          setCampaign(data);
          setAmount(data.currency === 'NG' ? '1000' : '25');
        }
      } catch (_error) {
        console.error(_error);
        if (!cancelled) setCampaign(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [donationId]);

  useEffect(() => {
    if (name) document.title = `Donate | ${name}`;
  }, [name]);

  useEffect(() => {
    if (campaign?.center_id && !centerCache[Number(campaign.center_id)]) {
      const getCenter = async () => {
        try {
          const resp = await GetUserDetailsDyId(Number(campaign.center_id), true);
          if (resp.error) return;
          setCenterCache((prev) => ({
            ...prev,
            [campaign.center_id!]: resp,
          }));
        } catch (_err) {
          console.error('Error fetching center:', _err);
        }
      };
      getCenter();
    }
  }, [campaign?.center_id, centerCache]);

  const centerData = centerCache[Number(campaign?.center_id)];
  const remaining = Math.max(0, Number(campaign?.goal || 0) - Number(campaign?.raised || 0));

  // Clamp amounts over remaining goal (personal campaigns only)
  useEffect(() => {
    if (!campaign || campaign.center_id) return;
    if (remaining <= 0) return;
    if (amount !== 'custom' && Number(amount) > remaining) {
      setAmount(String(remaining));
    }
    if (amount === 'custom' && Number(customAmount) > remaining) {
      setCustomAmount(String(remaining));
    }
  }, [campaign, amount, customAmount, remaining]);

  const handleAmountSelect = (val: string) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    setAmount('custom');
  };

  const progressPercent = useMemo(() => {
    if (!campaign?.goal) return 0;
    return Math.min(Math.round((Number(campaign.raised) / Number(campaign.goal)) * 100), 100);
  }, [campaign]);

  const symbol = currency === 'NG' ? '₦' : currency === 'USD' ? '$' : '£';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <NavBar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <DualRingSpinner label="Preparing secure checkout…" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <NavBar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4 bg-white p-8 rounded-3xl border border-gray-150 shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <XCircle size={28} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Campaign Not Found</h2>
            <p className="text-gray-500 mb-6">
              The campaign you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/causes/get')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Explore Causes
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const campaignImg =
    campaign.main_img?.url ||
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&fit=crop';

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <NavBar />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - Campaign Details Preview Card */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-gray-100">
                <img src={campaignImg} alt={campaign.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/10 uppercase tracking-wider">
                    <Heart className="w-3 h-3 fill-current text-rose-500" />
                    {campaign.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-gray-950 mb-2 leading-tight">
                  {campaign.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                  {campaign.details || campaign.story}
                </p>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="font-bold text-gray-900">
                      {symbol}
                      {Number(campaign.raised).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">
                      raised of {symbol}
                      {Number(campaign.goal).toLocaleString()} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--brand)] to-[var(--brand-hover)] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-[var(--brand)]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Secure Payments</h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      100% encrypted & secure via Paystack
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Donation Checkout Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-955 mb-1">Make a Donation</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Support this campaign by selecting a preset amount or entering your own.
                </p>
              </div>

              {/* Verified Organization Tag */}
              {campaign.center_id && (
                <div className="mb-6 p-4 bg-[var(--brand-soft)]/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={centerData?.image || '/placeholder-avatar.jpg'}
                      alt={centerData?.full_name || 'Organization'}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          {centerData?.full_name || campaign.center_name}
                        </span>
                        <svg
                          className="h-4 w-4 text-[var(--brand)] fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                        </svg>
                      </div>
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                        Verified Organization
                      </p>
                    </div>
                  </div>

                  <Explain
                    topic={centerData?.full_name || campaign.center_name || ''}
                    details="This is a charity center profile"
                    link={`/dashboard/centers/profile?id=${campaign?.center_id}`}
                    link_details="View Profile"
                  />
                </div>
              )}

              <div className="space-y-6">
                {/* 1. Select Amount */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    1. Choose Amount ({symbol})
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`
                          py-3 px-2.5 rounded-2xl border text-sm font-bold transition-all duration-200 text-center
                          ${
                            amount === amt && customAmount === ''
                              ? 'bg-[var(--brand)] border-[var(--brand)] text-white shadow-md shadow-[var(--brand-soft)]'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-[var(--brand-hover)] hover:bg-[var(--brand-soft)]/30'
                          }
                        `}
                      >
                        {symbol}
                        {Number(amt).toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      {symbol}
                    </span>
                    <input
                      type="number"
                      placeholder="Or enter custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      className={`
                        w-full bg-white border rounded-2xl py-3.5 pl-8 pr-4 text-gray-900 font-bold placeholder-gray-400 outline-none transition-all
                        ${
                          amount === 'custom'
                            ? 'border-[var(--brand)] ring-2 ring-[var(--brand-soft)]'
                            : 'border-gray-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]'
                        }
                      `}
                    />
                  </div>
                </div>

                {/* 2. Anonymous Toggle */}
                <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-200/60 flex items-center justify-center text-gray-500">
                      <UserCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Donate Anonymously</h4>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Hide your identity on the public donors tab
                      </p>
                    </div>
                  </div>

                  {/* Premium Slide Switch */}
                  <button
                    type="button"
                    onClick={() => setIsBlind(!isBlind)}
                    className={`
                      w-11 h-6 rounded-full transition-colors duration-200 outline-none shrink-0 relative
                      ${isBlind ? 'bg-[var(--brand)]' : 'bg-gray-200'}
                    `}
                  >
                    <span
                      className={`
                        absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-200
                        ${isBlind ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>

                {/* 3. Donor Information */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    2. Donor Details
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {!isBlind && status === 'unauthenticated' && (
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <UserCircle size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] transition-all font-semibold"
                        />
                      </div>
                    )}

                    {status !== 'authenticated' && (
                      <div className="relative col-span-1 sm:col-span-2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] transition-all font-semibold"
                        />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      placeholder="Leave a message of encouragement (optional)"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] transition-all resize-none font-semibold leading-relaxed"
                    />
                  </div>
                </div>

                {/* 4. Optional Tips */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                      3. Optional Tip (Supports Chari-T)
                    </label>
                    {platFormFee > 0 && (
                      <span className="text-xs text-emerald-600 font-bold">
                        100% of donation goes to cause
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {FEE_PRESETS.map((fee) => (
                      <button
                        key={fee}
                        type="button"
                        onClick={() => setPlatformFee(fee)}
                        className={`
                          px-4 py-2 rounded-xl text-xs font-bold transition-all border
                          ${
                            platFormFee === fee
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
                          }
                        `}
                      >
                        {fee === 0 ? 'None' : `₦${fee}`}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      ₦
                    </span>
                    <input
                      type="number"
                      placeholder="Enter custom tip"
                      value={!FEE_PRESETS.includes(platFormFee) ? platFormFee || '' : ''}
                      onChange={(e) => setPlatformFee(Math.abs(Number(e.target.value)))}
                      className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-8 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all font-semibold"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                    {platFormFee > 0
                      ? `Tip of ₦${platFormFee.toLocaleString()} supports Chari-T. Campaign receives ₦${baseDonation.toLocaleString()} (100% of gift).`
                      : 'No tip selected — 100% of your gift goes to the campaign. Standard processor fees may apply.'}
                  </p>
                </div>

                {/* Paystack Popup Secure Trigger */}
                <div className="pt-4 border-t border-gray-100">
                  <PaystackPopup
                    email={session?.user.email || formData.email}
                    publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}
                    subaccount={campaign.bank_details?.subAccountCode}
                    onSuccess={() => {}}
                    onCancel={() => {}}
                    amount={totalCharge}
                    metadata={{
                      campaign_id: campaign.id,
                      center_id: campaign.center_id || undefined,
                      platform_fee: platFormFee,
                      isBlind: isBlind,
                      donor_name: formData.name || undefined,
                      custom_fields: [
                        {
                          display_name: 'Campaign ID',
                          variable_name: 'campaign_id',
                          value: String(campaign.id),
                        },
                        {
                          display_name: 'Platform Fee',
                          variable_name: 'platform_fee',
                          value: String(platFormFee),
                        },
                        {
                          display_name: 'Blind',
                          variable_name: 'is_blind',
                          value: String(isBlind),
                        },
                      ],
                    }}
                    platform_fee={platFormFee}
                    name={
                      isBlind
                        ? null
                        : status === 'authenticated'
                          ? session.user.name
                          : formData.name
                    }
                    isBlind={isBlind}
                    isAuthed={status === 'authenticated'}
                    homeUrl="/causes/get"
                    causesUrl="/causes/get"
                    id={campaign.id}
                    owner_id={campaign.user_id}
                    donor_name={formData.name}
                    message={formData.message}
                    center_id={campaign.center_id ? campaign.center_id : null}
                  />
                </div>

                <p className="text-center text-gray-400 text-[10px] font-semibold">
                  Secure processing by Paystack. By donating, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
