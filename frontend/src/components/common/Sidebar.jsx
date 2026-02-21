import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserReadmes } from '../../api/entityApi';
import AnalyticsChart from '../charts/AnalyticsChart';
import {
    FaHome,
    FaPlusSquare,
    FaClock,
    FaChartBar,
    FaFileAlt,
    FaChevronLeft,
    FaChevronRight,
    FaCrown
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [readmes, setReadmes] = useState([]);
    const location = useLocation();
    const { user } = useAuth();
    const isProUser = user?.isPro === true; // control visibility of upgrade link

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
    }, [isOpen]);

    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`
                h-[calc(100vh-4rem)] bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col
                ${isOpen ? 'w-64' : 'w-20'}
                fixed left-0 top-16 z-40 shadow-lg
            `}
        >
            {/* Toggle Button - Professional */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-4 bg-white border-2 border-gray-200 rounded-full p-1.5 shadow-lg hover:bg-indigo-50 hover:border-indigo-300 z-50 transform transition-all hover:scale-110 group"
            >
                {isOpen ? (
                    <FaChevronLeft size={14} className="text-gray-600 group-hover:text-indigo-600" />
                ) : (
                    <FaChevronRight size={14} className="text-gray-600 group-hover:text-indigo-600" />
                )}
            </button>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                <nav className="space-y-2 px-3">
                    <Link
                        to="/dashboard"
                        className={`
                            flex items-center px-3 py-3 rounded-lg transition-all duration-300 group relative
                            ${isActive('/dashboard')
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'}
                        `}
                        title="Dashboard"
                    >
                        <FaHome className={`flex-shrink-0 transition-colors ${isActive('/dashboard') ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} size={18} />
                        {isOpen ? <span className="ml-3 font-semibold text-sm">{isActive('/dashboard') ? 'Dashboard' : 'Dashboard'}</span> : null}
                    </Link>

                    <Link
                        to="/create"
                        className={`
                            flex items-center px-3 py-3 rounded-lg transition-all duration-300 group
                            ${isActive('/create')
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'}
                        `}
                        title="Create README"
                    >
                        <FaPlusSquare className={`flex-shrink-0 transition-colors ${isActive('/create') ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} size={18} />
                        {isOpen ? <span className="ml-3 font-semibold text-sm">Create</span> : null}
                    </Link>

                    <Link
                        to="/history"
                        className={`
                            flex items-center px-3 py-3 rounded-lg transition-all duration-300 group
                            ${isActive('/history')
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'}
                        `}
                        title="History"
                    >
                        <FaClock className={`flex-shrink-0 transition-colors ${isActive('/history') ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} size={18} />
                        {isOpen ? <span className="ml-3 font-semibold text-sm">History</span> : null}
                    </Link>

                    <Link
                        to="/analytics"
                        className={`
                            flex items-center px-3 py-3 rounded-lg transition-all duration-300 group
                            ${isActive('/analytics')
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'}
                        `}
                        title="Analytical"
                    >
                        <FaChartBar className={`flex-shrink-0 transition-colors ${isActive('/analytics') ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} size={18} />
                        {isOpen ? <span className="ml-3 font-semibold text-sm">Analytical</span> : null}
                    </Link>

                    {/* Pro upgrade link - only show for free users */}
                    {!isProUser && (
                        <Link
                            to="/upgrade"
                            className={`
                                flex items-center px-3 py-3 rounded-lg transition-all duration-300 group
                                ${isActive('/upgrade')
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'}
                            `}
                            title="Upgrade to Pro"
                        >
                            <FaCrown className={`flex-shrink-0 transition-colors ${isActive('/upgrade') ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} size={18} />
                            {isOpen ? <span className="ml-3 font-semibold text-sm">Upgrade</span> : null}
                        </Link>
                    )}
                </nav>

                {isOpen && (
                    <div className="mt-8 px-3 animate-slideInUp">
                        <h3 className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-1 h-1 bg-indigo-600 rounded-full"></span>
                            Recent READMEs
                        </h3>
                        <div className="space-y-1">
                            {readmes.length === 0 ? (
                                <div className="px-3 py-4 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 hover:shadow-md transition-shadow duration-300">
                                    <p className="text-xs text-gray-500 italic font-medium">No READMEs yet</p>
                                    <Link to="/create" className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 block font-semibold transition-colors">
                                        → Create one
                                    </Link>
                                </div>
                            ) : (
                                readmes.slice(0, 5).map((readme, index) => (
                                    <Link
                                        key={readme._id}
                                        to={`/edit/${readme._id}`}
                                        className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-300 transform hover:translate-x-0.5"
                                    >
                                        <FaFileAlt className="flex-shrink-0 mr-3 text-gray-300 group-hover:text-indigo-600 transition-colors group-hover:scale-110" />
                                        <span className="truncate group-hover:text-indigo-700 font-medium">{readme.title || 'Untitled README'}</span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            

            {/* Sidebar Footer - Professional */}
            {isOpen && (
                <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm">
                        <p className="text-xs text-center text-gray-600 font-semibold">
                            💡 Pro Tip
                        </p>
                        <p className="text-xs text-center text-gray-500 mt-1 leading-relaxed">
                            Provide detailed descriptions for better AI results
                        </p>
                    </div>
                </div>
            )}
            
        </div>
    );
};


export default Sidebar;
