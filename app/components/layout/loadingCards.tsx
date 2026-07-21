interface LoadingCardsProps {
  mm?: boolean;
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[var(--shadow-sm)]">
      <div className="h-48 ct-shimmer" />
      <div className="p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 rounded-full ct-shimmer" />
          <div className="h-5 w-20 rounded-full ct-shimmer ml-auto" />
        </div>
        <div className="h-5 w-4/5 rounded-lg ct-shimmer" />
        <div className="h-4 w-full rounded-lg ct-shimmer" />
        <div className="h-4 w-2/3 rounded-lg ct-shimmer" />
        <div className="pt-2 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded ct-shimmer" />
            <div className="h-4 w-10 rounded ct-shimmer" />
          </div>
          <div className="h-2 w-full rounded-full ct-shimmer" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-10 flex-1 rounded-xl ct-shimmer" />
          <div className="h-10 w-10 rounded-xl ct-shimmer" />
        </div>
      </div>
    </div>
  );
}

const LoadingCards: React.FC<LoadingCardsProps> = ({ mm, count = 3 }) => {
  if (mm) {
    return (
      <div className="md:w-4/5 mx-auto">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      role="status"
      aria-label="Loading campaigns"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      <span className="sr-only">Loading campaigns…</span>
    </div>
  );
};

export default LoadingCards;
