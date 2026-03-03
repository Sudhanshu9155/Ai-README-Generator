import { FaHistory } from "react-icons/fa";

const HistorySkeleton = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-x-hidden font-sans pb-10">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[210px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="mb-10 flex flex-col items-center md:flex-row md:items-start text-center md:text-left gap-4">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <FaHistory className="text-purple-400 text-2xl opacity-50" />
          </div>

          <div className="space-y-3 flex flex-col items-center md:items-start">
            <div className="h-8 w-56 bg-slate-700 rounded"></div>
            <div className="h-3 w-72 bg-slate-700 rounded"></div>
          </div>
        </div>

        {/* Timeline Skeleton */}
        <div className="space-y-8">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="relative">

              {/* Timeline Line */}
              {idx !== 4 && (
                <span className="absolute top-12 left-5 md:left-6 -ml-px h-full w-0.5 bg-gradient-to-b from-white/10 to-transparent"></span>
              )}

              <div className="relative flex items-start space-x-4 md:space-x-6">

                {/* Icon Circle Skeleton */}
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-slate-700"></div>

                {/* Content Card Skeleton */}
                <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 space-y-3">
                  <div className="h-3 w-40 bg-slate-700 rounded"></div>
                  <div className="h-3 w-64 bg-slate-700 rounded"></div>
                  <div className="h-3 w-32 bg-slate-700 rounded"></div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HistorySkeleton;