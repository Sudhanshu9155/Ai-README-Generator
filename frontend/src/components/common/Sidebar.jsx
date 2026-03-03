import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserReadmes } from '../../api/entityApi';
import {
    FaHome, FaPlusSquare, FaClock, FaChartBar, FaFileAlt,
    FaChevronLeft, FaChevronRight, FaCrown, FaLightbulb
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [readmes, setReadmes] = useState([]);
    const location = useLocation();
    const { user } = useAuth();
    const isProUser = user?.isPro === true;

    useEffect(() => {
        const fetchReadmes = async () => {
            try {
                const data = await getUserReadmes();
                setReadmes(data);
            } catch (error) {
                console.error("Failed to fetch READMEs", error);
            }
        };

        if (isOpen) {
            fetchReadmes();
        }

        const handleReadmeUpdated = () => {
            if (isOpen) {
                fetchReadmes();
            }
        };

        window.addEventListener('readme-list-updated', handleReadmeUpdated);
        return () => window.removeEventListener('readme-list-updated', handleReadmeUpdated);
    }, [isOpen]);

    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`
                h-[calc(100vh-5rem)] bg-[#030712]/60 backdrop-blur-xl border-r border-white/10 
                transition-all duration-300 ease-in-out flex flex-col fixed left-0 top-20 z-40 hidden md:flex
                ${isOpen ? 'w-64' : 'w-20'}
            `}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-4 bg-slate-900 border border-white/10 rounded-full p-1.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-purple-500/50 text-slate-400 hover:text-white transition-all z-50"
            >
                {isOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
            </button>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                <nav className="space-y-2 px-3">
                    <SidebarLink to="/dashboard" icon={<FaHome />} label="Dashboard" active={isActive('/dashboard')} isOpen={isOpen} />
                    <SidebarLink to="/create" icon={<FaPlusSquare />} label="Create" active={isActive('/create')} isOpen={isOpen} />
                    <SidebarLink to="/history" icon={<FaClock />} label="History" active={isActive('/history')} isOpen={isOpen} />
                    <SidebarLink to="/analytics" icon={<FaChartBar />} label="Analytical" active={isActive('/analytics')} isOpen={isOpen} />
                    
                    {!isProUser && (
                        <SidebarLink to="/upgrade" icon={<FaCrown className="text-amber-400" />} label="Upgrade" active={isActive('/upgrade')} isOpen={isOpen} />
                    )}
                </nav>

                {isOpen && (
                    <div className="mt-10 px-4 animate-fadeIn">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></span>
                            Recent Neural Sequences
                        </h3>
                        <div className="space-y-1">
                            {readmes.length === 0 ? (
                                <p className="text-[10px] text-slate-600 italic px-2">No sequences stored.</p>
                            ) : (
                                readmes.slice(0, 5).map((readme) => (
                                    <Link
                                        key={readme._id}
                                        to={`/edit/${readme._id}`}
                                        className="group flex items-center px-3 py-2 text-xs font-bold text-slate-400 rounded-xl hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <FaFileAlt className="mr-3 opacity-30 group-hover:opacity-100 group-hover:text-purple-400 transition-all" />
                                        <span className="truncate">{readme.title || 'Untitled'}</span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Tip */}
            {isOpen && (
                <div className="p-4 border-t border-white/5 bg-white/5">
                    <div className="bg-[#030712]/50 rounded-2xl p-3 border border-white/5">
                        <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest flex items-center gap-2">
                            <FaLightbulb /> Pro Tip
                        </p>
                        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                            Be specific in prompts for higher precision AI synthesis.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarLink = ({ to, icon, label, active, isOpen }) => (
    <Link
        to={to}
        className={`
            flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
            ${active 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
        `}
    >
        <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-purple-400'} transition-colors`}>
            {icon}
        </span>
        {isOpen && <span className="ml-4 font-bold text-xs uppercase tracking-widest">{label}</span>}
    </Link>
);

export default Sidebar;
