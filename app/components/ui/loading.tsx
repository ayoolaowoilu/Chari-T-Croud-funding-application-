/** Brand-aligned loaders for Chari-T */

const BRAND = '#0f766e';
const BRAND_SOFT = '#99f6e4';

const InfinityLoader = () => (
  <svg className="w-12 h-7 mx-auto" viewBox="0 0 50 24" aria-hidden>
    <path
      d="M12 12c0-6 4-10 10-10s10 4 10 10-4 10-10 10S12 18 12 12zm26 0c0-6 4-10 10-10s10 4 10 10-4 10-10 10S38 18 38 12z"
      fill="none"
      stroke={BRAND}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="60 120"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 25 12"
        to="360 25 12"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

const DotsWave = () => (
  <div className="flex flex-col items-center gap-3 py-6" role="status" aria-label="Loading">
    <svg className="w-14 h-8" viewBox="0 0 48 24" aria-hidden>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={10 + i * 14} cy="12" r="3.5" fill={BRAND}>
          <animate
            attributeName="opacity"
            values="0.25;1;0.25"
            dur="1s"
            repeatCount="indefinite"
            begin={`${i * 0.15}s`}
          />
          <animate
            attributeName="cy"
            values="12;7;12"
            dur="1s"
            repeatCount="indefinite"
            begin={`${i * 0.15}s`}
          />
        </circle>
      ))}
    </svg>
    <p className="text-xs font-medium text-slate-500 tracking-wide">Loading…</p>
  </div>
);

const DualRingSpinner = ({
  label = 'Loading',
  className = '',
  compact = false,
}: {
  label?: string;
  className?: string;
  /** Smaller spinner for inline / partial reloads */
  compact?: boolean;
}) => (
  <div
    className={`flex flex-col items-center justify-center ${
      compact ? 'gap-2.5 py-4' : 'gap-3.5 py-8'
    } ${className}`}
    role="status"
    aria-live="polite"
    aria-label={label || 'Loading'}
  >
    <div className={`relative ${compact ? 'h-8 w-8' : 'h-10 w-10'}`}>
      <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--brand)] animate-spin"
        style={{ animationDuration: '0.75s' }}
      />
    </div>
    {label ? (
      <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-slate-500 tracking-tight`}>
        {label}
      </p>
    ) : null}
  </div>
);

const LoadingSpinner = () => (
  <svg className="w-11 h-11 animate-spin mx-auto" viewBox="0 0 24 24" aria-hidden>
    <defs>
      <linearGradient id="ct-spin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={BRAND_SOFT} />
        <stop offset="100%" stopColor={BRAND} />
      </linearGradient>
    </defs>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="url(#ct-spin-grad)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="40 60"
    />
  </svg>
);

const PulseRing = () => (
  <div className="relative w-12 h-12 mx-auto" aria-hidden>
    <div className="absolute inset-0 rounded-full border-2 border-[var(--brand)] opacity-20 animate-ping" />
    <svg className="relative w-full h-full animate-spin" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={BRAND}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="15 85"
      />
    </svg>
  </div>
);

const OrbitLoader = () => (
  <svg className="w-12 h-12 mx-auto" viewBox="0 0 40 40" aria-hidden>
    <circle cx="20" cy="20" r="15" stroke={BRAND} strokeWidth="1" fill="none" opacity="0.2" />
    <circle cx="20" cy="20" r="8" stroke={BRAND} strokeWidth="1" fill="none" opacity="0.35" />
    <circle cx="20" cy="5" r="3" fill={BRAND}>
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 20 20"
        to="360 20 20"
        dur="1.4s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

/** Full-page centered loading shell used on heavy routes */
const PageLoadingShell = ({
  title = 'Just a moment',
  subtitle = 'Fetching the latest for you…',
}: {
  title?: string;
  subtitle?: string;
}) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-16">
    <DualRingSpinner label="" />
    <h2 className="mt-2 text-base font-semibold text-slate-900">{title}</h2>
    <p className="mt-1 text-sm text-slate-500 text-center max-w-xs">{subtitle}</p>
  </div>
);

export {
  InfinityLoader,
  DotsWave,
  LoadingSpinner,
  OrbitLoader,
  PulseRing,
  DualRingSpinner,
  PageLoadingShell,
};
