import { FaTerminal } from "react-icons/fa";

const ReadmePreviewSkeleton = () => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl relative">

      {/* HEADER */}
      <div className="bg-white/5 px-4 md:px-6 py-4 flex justify-between items-center border-b border-white/10 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
          </div>
          <FaTerminal className="text-purple-400 text-xs opacity-50" />
          <div className="h-3 w-20 bg-slate-700 rounded"></div>
        </div>

        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-700 rounded-xl"></div>
          <div className="h-8 w-20 bg-slate-700 rounded-xl"></div>
          <div className="hidden md:block h-8 w-24 bg-slate-700 rounded-xl"></div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="h-[55vh] md:h-[60vh] bg-[#030712]/80 p-6 md:p-8 space-y-4 animate-pulse">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="h-3 bg-slate-700 rounded"
            style={{ width: `${60 + Math.random() * 35}%` }}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 md:px-6 md:py-4 border-t border-white/10 bg-white/5 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="h-3 w-20 bg-slate-700 rounded"></div>
            <div className="h-3 w-28 bg-slate-700 rounded"></div>
          </div>
          <div className="hidden md:block h-3 w-24 bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ReadmePreviewSkeleton;