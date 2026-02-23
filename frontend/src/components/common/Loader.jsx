const Loader = ({ message = "Synthesizing Neural Data..." }) => {
    return (
        <div className="flex flex-col justify-center items-center min-h-[400px] w-full py-20 gap-8 relative overflow-hidden font-sans">
            
            {/* Ambient Background Glow for the Loader */}
            <div className="absolute w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full animate-pulse"></div>

            {/* Main Cyber Spinner */}
            <div className="relative w-24 h-24">
                {/* Outer static ring - very faint */}
                <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
                
                {/* Outer spinning gradient ring with glow effect */}
                <div className="absolute inset-0 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin shadow-[0_0_20px_rgba(168,85,247,0.3)]"></div>
                
                {/* Secondary counter-spinning ring */}
                <div className="absolute inset-2 border-b-2 border-l-2 border-indigo-500 rounded-full animate-spin-slow opacity-60 shadow-[0_0_15px_rgba(99,102,241,0.2)]"></div>
                
                {/* Inner pulsing AI core */}
                <div className="absolute inset-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full opacity-40 animate-pulse flex items-center justify-center">
                    {/* Tiny center "signal" dot */}
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff] animate-ping"></div>
                </div>
            </div>
            
            {/* Loading Text Section */}
            <div className="flex flex-col items-center gap-4 z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">
                    {message}
                </p>
                
                {/* Binary pulse dots */}
                <div className="flex gap-2">
                    <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
            </div>

            {/* System Status Tag */}
            <div className="mt-4 text-[8px] font-bold text-slate-600 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-full bg-white/5">
                Forge Engine Protocol v1.0
            </div>
        </div>
    );
};

export default Loader;