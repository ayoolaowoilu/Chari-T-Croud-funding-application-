'use client';

import Button from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { redirect } from 'next/navigation';
import { Clock, Users, MapPin, MoreVertical, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { categoryLabel } from '@/app/lib/categories';

interface Don {
  img: string;
  title: string;
  donors: number;
  goal: number;
  raised: number;
  category: string;
  desc: string;
  currency: 'NG' | 'EURO' | 'USD';
  id: number;
  centerName?: string;
  location?: string;
  daysLeft?: number | string;
  isUrgent?: boolean;
  isVerified?: boolean;
  organizer?: string;
  safety_level?: string | 'verified_safe' | 'likely_safe' | 'uncertain' | 'likely_risky' | 'unsafe';
  center_id: string | null;
  center_name: string | null;
}

const currencySymbols: Record<string, string> = {
  NG: '₦',
  EURO: '€',
  USD: '$',
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num?.toString() ?? '0';
};

const safetyStyles: Record<string, string> = {
  verified_safe: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  likely_safe: 'bg-teal-50 text-teal-700 border-teal-200',
  uncertain: 'bg-amber-50 text-amber-700 border-amber-200',
  likely_risky: 'bg-orange-50 text-orange-700 border-orange-200',
  unsafe: 'bg-red-50 text-red-700 border-red-200',
};

function safetyLabel(level?: string) {
  if (!level) return null;
  return level.replace(/_/g, ' ');
}

const CardMenu = ({
  id,
  onCopyLink,
}: {
  id: number;
  title?: string;
  onCopyLink: () => void;
  onGetFlier?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center"
        aria-label="More options"
      >
        <MoreVertical className="w-4 h-4 text-slate-600" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 bottom-full mb-2 z-50 w-44 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => {
                  onCopyLink();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Copy className="w-4 h-4 text-[var(--brand)]" />
                Copy link
              </button>
              <div className="border-t border-slate-100" />
              <button
                type="button"
                onClick={() => {
                  redirect(`/causes/cause?id=${id}`);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[var(--brand)]" />
                View more
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CampaignCard: React.FC<Don> = ({
  img,
  title,
  donors,
  goal,
  raised,
  category,
  desc,
  currency,
  id,
  location,
  daysLeft,
  isUrgent,
  safety_level,
  center_id,
  centerName,
  isVerified: _isVerified,
}) => {
  const progressPct = Math.min(100, Math.max(0, (raised / goal) * 100));
  const symbol = currencySymbols[currency] || '₦';
  const isFullyFunded = progressPct >= 100;
  const daysleftt = Math.floor((Number(daysLeft) - Date.now()) / (1000 * 60 * 60 * 24));
  const isNearDeadline = daysLeft !== undefined && daysleftt <= 7 && daysleftt > 0;
  const isCenter = center_id !== null && center_id !== undefined;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/causes/cause?id=${id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <motion.article
      className="bg-white w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] transition-all duration-300 cursor-pointer group flex flex-col h-full"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <div className="relative h-48 shrink-0 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-white/95 backdrop-blur text-slate-900 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/40">
            {categoryLabel(category)}
          </span>
          {isCenter && (
            <span className="bg-[var(--brand)] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Center
            </span>
          )}
          {isUrgent && (
            <span className="bg-red-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Urgent
            </span>
          )}
          {isFullyFunded && (
            <span className="bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              Funded
            </span>
          )}
        </div>

        {daysLeft !== undefined && (
          <div className="absolute bottom-3 right-3">
            <span
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full text-white ${
                isNearDeadline ? 'bg-red-500/90' : 'bg-slate-900/45 backdrop-blur-sm'
              }`}
            >
              {daysleftt > 0 ? `${daysleftt}d left` : 'Ended'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col grow p-5">
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>

        {isCenter && centerName && (
          <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-slate-600">
            <span className="truncate">{centerName}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 min-h-5">
          {location ? (
            <>
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{location}</span>
            </>
          ) : (
            <span />
          )}
          {safety_level && (
            <span
              className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${
                safetyStyles[safety_level] || safetyStyles.uncertain
              }`}
            >
              {safetyLabel(safety_level)}
            </span>
          )}
        </div>

        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4 min-h-10">{desc}</p>

        <div className="mt-auto">
          {!isCenter && (
            <>
              <div className="flex items-end justify-between mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-900">
                    {symbol}
                    {formatNumber(raised)}
                  </span>
                  <span className="text-xs text-slate-500">raised</span>
                </div>
                <span className="text-xs font-semibold text-[var(--brand)]">
                  {Math.round(progressPct)}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <motion.div
                  className={`h-full rounded-full ${
                    isFullyFunded ? 'bg-emerald-500' : isUrgent ? 'bg-red-500' : 'bg-[var(--brand)]'
                  }`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                />
              </div>
            </>
          )}

          {isCenter && (
            <div className="flex items-center gap-3 mb-3 text-sm">
              <span className="font-semibold text-slate-900">₦{formatNumber(Number(raised))}</span>
              <span className="text-xs text-slate-500">raised</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {donors} donors
            </span>
            {!isCenter && (
              <span>
                Goal {symbol}
                {formatNumber(goal)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              details="View details"
              variant="outline"
              size="md"
              className="flex-1 border-slate-200 hover:border-[var(--brand)] hover:text-[var(--brand)]"
              onClick={() => window.location.href = `/causes/cause?id=${id}` }
            />
            <CardMenu
              id={id}
              title={title}
              onCopyLink={handleCopyLink}
              onGetFlier={() => undefined}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const Card: React.FC<Don> = (props) => {
  return <CampaignCard {...props} />;
};

export default Card;
