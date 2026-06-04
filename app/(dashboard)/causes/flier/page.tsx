"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/app/components/layout/footer";
import NavBar from "@/app/components/layout/NavBar";

// ─── Types ──────────────────────────────────────────────────────────

type StyleInfo = {
  name: string;
  desc: string;
};

// ─── Constants ──────────────────────────────────────────────────────

const STYLE_LABELS: Record<number, StyleInfo> = {
  1: { name: "Magazine Cover", desc: "Bold hero image with editorial layout and story-driven stats" },
  2: { name: "Poster Dark", desc: "High-contrast dark theme with cinematic image treatment" },
  3: { name: "Ticket Card", desc: "Dashed borders, rounded corners, event-ticket aesthetic" },
  4: { name: "Story Mode", desc: "Full-bleed photography with narrative copy and impact focus" },
  5: { name: "Minimal Impact", desc: "Clean grid layout with bold typography and side image" },
};

const STYLES = [1, 2, 3, 4, 5] as const;

// ─── Helpers ──────────────────────────────────────────────────────────

function formatCurrency(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(num);
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
        copied
          ? "bg-green-50 border-green-300 text-green-700"
          : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
      }`}
    >
      {copied ? "Copied!" : label}
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
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl, downloadUrl]);

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              <span className="text-sm text-gray-400 font-medium">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-center px-6">
              <svg className="w-10 h-10 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-600 font-medium">Failed to load</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-xs text-red-500 hover:text-red-700 underline">
                Retry
              </button>
            </div>
          </div>
        )}

        <img
          src={imageUrl}
          alt={`Style ${style} — ${label.name}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ${loaded ? "group-hover:scale-[1.03]" : "opacity-0"}`}
          loading="lazy"
        />

        {/* Style badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-sm text-gray-900 shadow-sm border border-gray-100">
            Style {style}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">{label.name}</h3>
        <p className="mt-1 text-sm text-gray-500 leading-relaxed">{label.desc}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={!loaded || error}
            className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>

          <CopyButton text={imageUrl} label="Copy Link" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────

export default function Flier() {
  const searchParams = useSearchParams();

  const baseData = useMemo(
    () => ({
      campaign_name: searchParams.get("campaign_name") || "Support Our Cause",
      raised: searchParams.get("raised") || "0",
      goal: searchParams.get("goal") || undefined,
      campaign_id: parseInt(searchParams.get("campaign_id") || "0", 10),
      center_logo_url: searchParams.get("center_logo_url") || undefined,
      campaign_logo_url:
        searchParams.get("campaign_logo_url") ||
        "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&h=800&fit=crop",
      qr_code_url:
        searchParams.get("qr_code_url") ||
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://chari-t.com/donate",
      tagline: searchParams.get("tagline") || undefined,
      details: searchParams.get("details") || undefined,
      center_name: searchParams.get("center_name") || undefined,
      center_handle: searchParams.get("center_handle") || undefined,
      _type: (searchParams.get("_type") as "center" | "normal") || "normal",
    }),
    [searchParams]
  );

  const getFlierUrl = useCallback(
    (style: number) => {
      const sp = new URLSearchParams();
      sp.set("style", String(style));
      sp.set("campaign_name", baseData.campaign_name);
      sp.set("raised", baseData.raised);
      if (baseData.goal) sp.set("goal", baseData.goal);
      sp.set("campaign_id", String(baseData.campaign_id));
      sp.set("campaign_logo_url", baseData.campaign_logo_url);
      sp.set("qr_code_url", baseData.qr_code_url);
      if (baseData.tagline) sp.set("tagline", baseData.tagline);
      if (baseData.details) sp.set("details", baseData.details);
      if (baseData.center_name) sp.set("center_name", baseData.center_name);
      if (baseData.center_handle) sp.set("center_handle", baseData.center_handle);
      if (baseData.center_logo_url) sp.set("center_logo_url", baseData.center_logo_url);
      sp.set("_type", baseData._type);
      return `/api/flier?${sp.toString()}`;
    },
    [baseData]
  );

  const progress = useMemo(() => {
    if (!baseData.goal) return null;
    const r = parseFloat(baseData.raised);
    const g = parseFloat(baseData.goal);
    if (isNaN(r) || isNaN(g) || g === 0) return null;
    return Math.min(Math.round((r / g) * 100), 100);
  }, [baseData]);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Campaign #{baseData.campaign_id}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-900 text-xs font-semibold text-white uppercase tracking-wider">
              Powered by Paystack
            </span>
            {baseData._type === "center" && baseData.center_name && (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                {baseData.center_name} ✓
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Campaign Flier Preview
          </h1>

          <p className="mt-3 text-lg text-gray-500 max-w-2xl">
            All 5 style variations for{" "}
            <span className="font-semibold text-gray-900">{baseData.campaign_name}</span>
          </p>

          {/* Stats bar */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">
                {formatCurrency(baseData.raised)}
              </span>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">raised</span>
            </div>

            {baseData.goal && (
              <>
                <div className="hidden sm:block w-px h-8 bg-gray-200" />
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-600">{formatCurrency(baseData.goal)}</span>
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">goal</span>
                </div>
              </>
            )}

            {progress !== null && (
              <>
                <div className="hidden sm:block w-px h-8 bg-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{progress}%</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Grid */}
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

        {/* URL Builder */}
        <div className="mt-20 p-8 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">URL Parameters</h3>
          </div>

          <code className="block text-sm text-gray-600 font-mono bg-white p-5 rounded-xl border border-gray-200 overflow-x-auto leading-relaxed">
            ?campaign_name=Your+Campaign&raised=15420&goal=50000&campaign_id=42&campaign_logo_url=https://...&qr_code_url=https://...&tagline=...&details=...&center_name=...&center_handle=...&_type=center
          </code>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span><strong>campaign_logo_url</strong> — required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span><strong>qr_code_url</strong> — required (QR image)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span><strong>tagline</strong> — optional short message</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span><strong>details</strong> — optional longer description</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span><strong>center_name</strong> — shows verified badge</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span><strong>_type</strong> — "center" or "normal"</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}