const ChartSkeleton = ({ title = "Loading Analytics..." }) => {
  return (
    <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-[2rem] shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-3 w-32 bg-slate-700 rounded animate-pulse"></div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
      </div>

      {/* Fake Chart Area */}
      <div className="h-[250px] flex items-end justify-between gap-3">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-purple-600/40 to-indigo-500/20 rounded-t-md animate-pulse"
            style={{ height: `${40 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChartSkeleton;