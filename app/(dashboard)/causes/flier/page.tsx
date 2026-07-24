'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from '@/app/components/layout/footer';
import NavBar from '@/app/components/layout/NavBar';
import { Download, Link as LinkIcon, Check, AlertCircle, RefreshCw } from 'lucide-react';

type StyleInfo = {
  name: string;
  desc: string;
};

const STYLE_LABELS: Record<number, StyleInfo> = {
  1: {
    name: 'Magazine Cover',
    desc: 'Bold hero image with editorial layout and story-driven stats',
  },
  2: { name: 'Poster Dark', desc: 'High-contrast dark theme with cinematic image treatment' },
  3: { name: 'Ticket Card', desc: 'Dashed borders, rounded corners, event-ticket aesthetic' },
  4: { name: 'Story Mode', desc: 'Full-bleed photography with narrative copy and impact focus' },
  5: { name: 'Minimal Impact', desc: 'Clean grid layout with bold typography and side image' },
};

const STYLES = [1, 2, 3, 4, 5] as const;

function formatCurrency(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(num);
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const textToCopy =
      text.startsWith('/') && typeof window !== 'undefined'
        ? `${window.location.origin}${text}`
        : text;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
        copied
          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
          : 'border-gray-200 text-gray-700 hover:bg-[var(--brand-soft)]/40 hover:border-[var(--brand)]/30'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" /> Copied!
        </>
      ) : (
        <>
          <LinkIcon className="w-4 h-4 text-gray-500" /> {label}
        </>
      )}
    </button>
  );
}

function FlierCard({
  style,
  imageUrl,
  downloadUrl,
}: {
  style: number;
  imageUrl: string;
  downloadUrl: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const label = STYLE_LABELS[style];

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl, downloadUrl]);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-3/4 bg-gray-50 overflow-hidden">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-100 border-t-[var(--brand)] rounded-full animate-spin" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Generating Flier...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50/50 z-10">
            <div className="text-center px-6">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600 font-semibold">Failed to generate flier</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium underline flex items-center gap-1 mx-auto"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          </div>
        )}

        <img
          src={imageUrl}
          alt={`Style ${style} — ${label.name}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ${loaded ? 'group-hover:scale-[1.03]' : 'opacity-0'}`}
          loading="lazy"
        />

        {/* Style badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/90 backdrop-blur-md text-[var(--brand-ink)] shadow-sm border border-emerald-100">
            Style {style}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-black text-gray-950">{label.name}</h3>
        <p className="mt-1 text-sm text-gray-500 leading-relaxed min-h-[40px] font-medium">
          {label.desc}
        </p>

        <div className="mt-5 flex gap-2.5">
          <button
            onClick={handleDownload}
            disabled={!loaded || error}
            className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          <CopyButton text={imageUrl} label="Copy Link" />
        </div>
      </div>
    </div>
  );
}

export default function Flier() {
  const searchParams = useSearchParams();
  useEffect(() => {
    document.title = `Flier Preview - ${searchParams.get('campaign_name') || 'Support Our Cause'}`;
  }, [searchParams]);

  const baseData = useMemo(
    () => ({
      campaign_name: searchParams.get('campaign_name') || 'Support Our Cause',
      raised: searchParams.get('raised') || '0',
      goal: searchParams.get('goal') || undefined,
      campaign_id: parseInt(searchParams.get('campaign_id') || '0', 10),
      center_logo_url: searchParams.get('center_logo_url') || undefined,
      campaign_logo_url:
        searchParams.get('campaign_logo_url') ||
        'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&h=800&fit=crop',
      qr_code_url:
        searchParams.get('qr_code_url') ||
        'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://chari-t.com/donate',
      tagline: searchParams.get('tagline') || undefined,
      details: searchParams.get('details') || undefined,
      center_name: searchParams.get('center_name') || undefined,
      center_handle: searchParams.get('center_handle') || undefined,
      _type: (searchParams.get('_type') as 'center' | 'normal') || 'normal',
    }),
    [searchParams],
  );

  const getFlierUrl = useCallback(
    (style: number): string => {
      const sp = new URLSearchParams();
      sp.set('style', String(style));
      sp.set('campaign_name', baseData.campaign_name);
      sp.set('raised', baseData.raised);
      if (baseData.goal) sp.set('goal', baseData.goal);
      sp.set('campaign_id', String(baseData.campaign_id));
      sp.set('campaign_logo_url', baseData.campaign_logo_url);
      sp.set('qr_code_url', baseData.qr_code_url);
      if (baseData.tagline) sp.set('tagline', baseData.tagline);
      if (baseData.details) sp.set('details', baseData.details);
      if (baseData.center_name) sp.set('center_name', baseData.center_name);
      if (baseData.center_handle) sp.set('center_handle', baseData.center_handle);
      if (baseData.center_logo_url) sp.set('center_logo_url', baseData.center_logo_url);
      sp.set('_type', baseData._type);
      return `/api/flier?${sp.toString()}`;
    },
    [baseData],
  );

  const progress = useMemo(() => {
    if (!baseData.goal) return null;
    const r = parseFloat(baseData.raised);
    const g = parseFloat(baseData.goal);
    if (isNaN(r) || isNaN(g) || g === 0) return null;
    return Math.min(Math.round((r / g) * 100), 100);
  }, [baseData]);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        <NavBar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Header Card - Emerald / Brand Theme */}
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-[var(--brand-ink)] to-slate-900 text-white rounded-3xl p-8 lg:p-12 shadow-xl mb-12">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-[var(--brand)]/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-emerald-200 border border-white/10">
                  Campaign #{baseData.campaign_id}
                </span>

                {baseData._type === 'center' && baseData.center_name && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/25">
                    {baseData.center_name} Verified
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none mb-4">
                Campaign Flier Generator
              </h1>

              <p className="text-lg text-emerald-100/80 max-w-2xl font-medium">
                Promote <span className="text-white font-extrabold">{baseData.campaign_name}</span>{' '}
                with professional, print-ready marketing fliers. Select a design style below to
                download or copy the direct link.
              </p>

              {/* Premium Stats bar */}
              <div className="mt-8 flex flex-wrap items-center gap-6 bg-white/5 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-white/10 max-w-3xl">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                    Raised
                  </span>
                  <span className="text-2xl lg:text-3xl font-black text-white">
                    {formatCurrency(baseData.raised)}
                  </span>
                </div>

                {baseData.goal && (
                  <>
                    <div className="hidden sm:block w-px h-10 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                        Goal
                      </span>
                      <span className="text-xl lg:text-2xl font-bold text-white/90">
                        {formatCurrency(baseData.goal)}
                      </span>
                    </div>
                  </>
                )}

                {progress !== null && (
                  <>
                    <div className="hidden sm:block w-px h-10 bg-white/10" />
                    <div className="flex-1 min-w-[150px]">
                      <div className="flex justify-between items-center mb-1 text-xs font-semibold text-emerald-200">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--brand)] to-emerald-400 rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Fliers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {STYLES.map((style) => (
              <FlierCard
                key={style}
                style={style}
                imageUrl={getFlierUrl(style)}
                downloadUrl={`flier-style-${style}-${baseData.campaign_id}.png`}
              />
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
