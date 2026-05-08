

const InfinityLoader = () => (
  <svg className="w-10 h-6 mx-auto" viewBox="0 0 50 24">
    <path
      d="M12 12c0-6 4-10 10-10s10 4 10 10-4 10-10 10S12 18 12 12zm26 0c0-6 4-10 10-10s10 4 10 10-4 10-10 10S38 18 38 12z"
      fill="none"
      stroke="#3B82F6"
      strokeWidth="3"
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
  <svg className="w-20 h-20 mx-auto" viewBox="0 0 24 24">
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={6 + i * 6} cy="12" r="2" fill="#3B82F6">
        <animate
          attributeName="opacity"
          values="0.2;1;0.2"
          dur="1.2s"
          repeatCount="indefinite"
          begin={`${i * 0.15}s`}
        />
        <animate
          attributeName="cy"
          values="12;8;12"
          dur="1.2s"
          repeatCount="indefinite"
          begin={`${i * 0.15}s`}
        />
      </circle>
    ))}
  </svg>
);

    const DualRingSpinner = () => (
  <div className="relative w-12 h-12 mx-auto">
    <svg className="absolute w-full h-full animate-spin" viewBox="0 0 24 24" style={{ animationDuration: '1.2s' }}>
      <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="30 70" opacity="0.3" />
    </svg>
    <svg className="absolute w-full h-full animate-spin" viewBox="0 0 24 24" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}>
      <circle cx="12" cy="12" r="7" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="20 80" />
    </svg>
  </div>
);

    const LoadingSpinner = () => (
  <svg className="w-12 h-12 animate-spin mx-auto " viewBox="0 0 24 24">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="url(#gradient)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="40 60"
    />
  </svg>
);

const PulseRing = () => (
  <div className="relative w-12 h-12 mx-auto">
    <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-20 animate-ping" />
    <svg className="relative w-full h-full animate-spin" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="15 85" />
    </svg>
  </div>
);

const OrbitLoader = () => (
  <svg className="w-12 h-12 mx-auto" viewBox="0 0 40 40">
    <defs>
      <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="15" stroke="url(#orbitGrad)" strokeWidth="1" fill="none" />
    <circle cx="20" cy="20" r="8" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.5" />
    <circle cx="20" cy="5" r="3" fill="#3B82F6">
      <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="20" cy="12" r="2" fill="#8B5CF6">
      <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="-360 20 20" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);


export {InfinityLoader , DotsWave , LoadingSpinner, OrbitLoader, PulseRing , DualRingSpinner}