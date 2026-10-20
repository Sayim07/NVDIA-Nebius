export default function AppLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-surface-2 rounded-xl" />
          <div className="h-4 w-72 bg-surface-2 rounded-lg mt-2" />
        </div>
        <div className="h-10 w-32 bg-surface-2 rounded-xl" />
      </div>

      {/* Chips skeleton */}
      <div className="flex gap-2">
        {[80, 100, 70].map((w) => (
          <div key={w} className={`h-7 w-${w > 90 ? '24' : '20'} bg-surface-2 rounded-full`} />
        ))}
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-surface-2 rounded-2xl border border-border" />
        ))}
      </div>

      {/* Feature links skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-surface-2 rounded-2xl border border-border" />
        ))}
      </div>
    </div>
  );
}
