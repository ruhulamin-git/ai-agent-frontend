export const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-full rounded-xl p-6 border border-white/10 bg-gray-900/50 backdrop-blur-sm animate-pulse"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-700" />
            <div className="w-16 h-6 rounded-full bg-gray-700" />
          </div>

          <div className="space-y-3 mb-4">
            <div className="h-6 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-2/3" />
          </div>

          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-gray-700 rounded w-16" />
            <div className="h-6 bg-gray-700 rounded w-20" />
            <div className="h-6 bg-gray-700 rounded w-14" />
          </div>

          <div className="h-12 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};
