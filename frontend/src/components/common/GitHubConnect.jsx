import { useAuth } from '../../context/AuthContext';
import { FaGithub, FaCheckCircle, FaExchangeAlt, FaLink, FaUnlink } from 'react-icons/fa';

const GitHubConnect = () => {
    const { user } = useAuth();
    const isConnected = !!user?.githubUsername;

    const handleConnect = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.location.href = `${apiUrl}/auth/github`;
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] sticky top-8 shadow-2xl transition-all hover:border-purple-500/30 group">
            {/* Header */}
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-white group-hover:text-purple-400 transition-colors">
                    <FaGithub size={18} />
                </div>
                GitHub Uplink
            </h3>

            {/* Status Indicator */}
            <div className="flex items-center justify-between mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signal Status</span>
                {isConnected ? (
                    <span className="flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-tighter bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <FaCheckCircle className="mr-1.5 animate-pulse" />
                        Active
                    </span>
                ) : (
                    <span className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-tighter bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        <FaUnlink className="mr-1.5 opacity-50" />
                        Offline
                    </span>
                )}
            </div>

            {/* User Info / Context */}
            <div className="mb-8">
                {isConnected ? (
                    <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Authenticated Account</p>
                        <p className="text-sm font-black text-white truncate flex items-center gap-2">
                            <span className="text-purple-400 font-mono">@</span>
                            {user.githubUsername}
                        </p>
                        {/* Subtle glow effect behind name */}
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500/10 blur-xl rounded-full"></div>
                    </div>
                ) : (
                    <p className="text-xs text-slate-500 leading-relaxed font-medium px-1">
                        Establish a high-speed data connection to GitHub to synthesize documentation directly from your source code.
                    </p>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={handleConnect}
                className={`w-full group/btn relative overflow-hidden flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 ${
                    isConnected
                        ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                        : 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500'
                }`}
            >
                {isConnected ? (
                    <>
                        <FaExchangeAlt className="group-hover/btn:rotate-180 transition-transform duration-500" />
                        Synchronize Again
                    </>
                ) : (
                    <>
                        <FaLink className="group-hover/btn:scale-110 transition-transform" />
                        Initialize Uplink
                    </>
                )}
                
                {/* Button Shine Animation Layer */}
                {!isConnected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                )}
            </button>

            {/* Footer Tag */}
            <p className="mt-4 text-center text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                {isConnected ? 'Neural Bridge Secured' : 'Encrypted Handshake Required'}
            </p>
        </div>
    );
};

export default GitHubConnect;