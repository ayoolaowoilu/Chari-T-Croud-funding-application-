"use client";

import Footer from "@/app/components/layout/footer";
import NavBar from "@/app/components/layout/NavBar"
import { FlierImage }from "@/app/lib/FlierGenerator";

export  function CopyButton({ url }: { url: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(url)}
      className="..."
    >
      Copy Link
    </button>
  );
}
type SearchParams = {
  campaign_name?: string;
  raised?: string;
  goal?: string;
  campaign_id?: string;
  center_logo_url?: string;
  campaign_logo_url?: string;
  _type?: string;
}

export default function Flier() {
  const params = {
    campaign_name: "Support Our Cause",
    raised: "0",
    goal: undefined,
    campaign_id: "0",
    center_logo_url: undefined,
    campaign_logo_url: "https://via.placeholder.com/1200x800/f0f0f0/999999?text=Campaign+Image",
    _type: "normal",
    
  } 

  // Build base data from URL params
  const baseData = {
    campaign_name: params.campaign_name || "Support Our Cause",
    raised: params.raised || "0",
    goal: params.goal,
    campaign_id: parseInt(params.campaign_id || "0"),
    center_logo_url: params.center_logo_url,
    campaign_logo_url: params.campaign_logo_url || "https://via.placeholder.com/1200x800/f0f0f0/999999?text=Campaign+Image",
    _type: (params._type as "center" | "normal") || "normal",
  };

  // Generate all 5 style URLs
  const styles = [1, 2, 3, 4, 5] as const;

 const getFlierUrl = (style: number) => { 
      const promise = (async () => {
    const response = FlierImage({
      data: { ...baseData, style: style as 1 | 2 | 3 | 4 | 5 }
    });
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return URL.createObjectURL(blob);
  })();


  return promise;
  }

  const styleLabels: Record<number, { name: string; desc: string }> = {
    1: { name: "Minimal Hero", desc: "Centered layout with large image and bold stats" },
    2: { name: "Split Layout", desc: "50/50 image and stats side by side" },
    3: { name: "Card Stack", desc: "Floating card with shadow and rounded corners" },
    4: { name: "Bold Typography", desc: "Dark theme with dramatic contrast" },
    5: { name: "Clean Grid", desc: "Two-column layout with stat cards" },
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Campaign Flier Preview
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            All 5 style variations for <span className="font-semibold text-gray-900">{baseData.campaign_name}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
              Raised: <span className="ml-1 font-semibold text-gray-900">${parseFloat(baseData.raised).toLocaleString()}</span>
            </span>
            {baseData.goal && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                Goal: <span className="ml-1 font-semibold text-gray-900">${parseFloat(baseData.goal).toLocaleString()}</span>
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
              Campaign #{baseData.campaign_id}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {styles.map((style) => (
            <div
              key={style}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Image container */}
              <div className="relative aspect-3/4 bg-gray-50 overflow-hidden">
                <img
                  src={getFlierUrl(style)}
                  alt={`Style ${style} — ${styleLabels[style].name}`}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                {/* Style badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm border border-gray-200">
                    Style {style}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  {styleLabels[style].name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {styleLabels[style].desc}
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={getFlierUrl(style)}
                    download={`flier-style-${style}-${baseData.campaign_id}.png`}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  >
                    Download PNG
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.origin + getFlierUrl(style))}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* URL Builder hint */}
        <div className="mt-16 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
            URL Parameters
          </h3>
          <code className="block text-sm text-gray-600 font-mono bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto">
            ?campaign_name=Your+Campaign&raised=15420&goal=50000&campaign_id=42&campaign_logo_url=https://...&center_logo_url=https://...
          </code>
          <p className="mt-2 text-xs text-gray-400">
            Pass these params to generate fliers with your campaign data. All params are optional except campaign_logo_url.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}