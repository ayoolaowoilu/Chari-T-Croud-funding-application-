export default function LS() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      role="status"
      aria-label="Loading stats"
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[var(--shadow-sm)]"
        >
          <div className="h-3 w-20 rounded ct-shimmer mb-3" />
          <div className="h-8 w-28 rounded-lg ct-shimmer mb-2" />
          <div className="h-3 w-16 rounded ct-shimmer" />
        </div>
      ))}
    </div>
  );
}
