const DashboardSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-x-hidden font-sans animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header Skeleton */}
                <div className="mb-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                    <div className="space-y-3 w-full md:w-1/2">
                        <div className="h-3 w-40 bg-slate-700 rounded"></div>
                        <div className="h-8 md:h-12 w-64 bg-slate-700 rounded"></div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="h-12 w-40 bg-slate-700 rounded-full"></div>
                        <div className="h-12 w-24 bg-slate-700 rounded-full"></div>
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
                    {[1,2,3].map((i) => (
                        <div key={i} className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-slate-700 rounded-2xl"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-3 w-24 bg-slate-700 rounded"></div>
                                    <div className="h-6 w-32 bg-slate-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5">
                        <div className="h-5 w-40 bg-slate-700 rounded"></div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {[1,2,3,4].map((i) => (
                            <div key={i} className="px-8 py-6 flex justify-between items-center">
                                <div className="h-5 w-48 bg-slate-700 rounded"></div>
                                <div className="h-4 w-20 bg-slate-700 rounded"></div>
                                <div className="h-4 w-24 bg-slate-700 rounded"></div>
                                <div className="h-4 w-16 bg-slate-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardSkeleton;