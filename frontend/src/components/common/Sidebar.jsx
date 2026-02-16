import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserReadmes } from '../../api/entityApi';
import {
    FiFileText,
    FiPlusSquare,
    FiClock,
    FiLayout,
    FiMessageSquare,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [readmes, setReadmes] = useState([]);
    const location = useLocation();

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
                h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
                ${isOpen ? 'w-64' : 'w-20'}
                fixed left-0 top-16 z-40
            `}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 z-50 transform transition-transform hover:scale-110"
            >
                {isOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
            </button>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <nav className="space-y-1 px-3">
                    <Link
                        to="/dashboard"
                        className={`
                            flex items-center px-3 py-2.5 rounded-lg transition-colors group relative
                            ${isActive('/dashboard')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                        title="Dashboard"
                    >
                        <FiLayout className={`flex-shrink-0 transition-colors ${isActive('/dashboard') ? 'text-indigo-700' : 'text-gray-400 group-hover:text-indigo-500'}`} size={20} />
                        {isOpen ? <span className="ml-3 font-medium">Dashboard</span> : null}
                    </Link>

                    <Link
                        to="/create"
                        className={`
                            flex items-center px-3 py-2.5 rounded-lg transition-colors group
                            ${isActive('/create')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                        title="New README"
                    >
                        <FiPlusSquare className={`flex-shrink-0 transition-colors ${isActive('/create') ? 'text-indigo-700' : 'text-gray-400 group-hover:text-indigo-500'}`} size={20} />
                        {isOpen ? <span className="ml-3 font-medium">New README</span> : null}
                    </Link>

                    <Link
                        to="/chat"
                        className={`
                            flex items-center px-3 py-2.5 rounded-lg transition-colors group
                            ${isActive('/chat')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                        title="AI Chat"
                    >
                        <FiMessageSquare className={`flex-shrink-0 transition-colors ${isActive('/chat') ? 'text-indigo-700' : 'text-gray-400 group-hover:text-indigo-500'}`} size={20} />
                        {isOpen ? <span className="ml-3 font-medium">AI Chat</span> : null}
                    </Link>

                    <Link
                        to="/history"
                        className={`
                            flex items-center px-3 py-2.5 rounded-lg transition-colors group
                            ${isActive('/history')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                        title="History Log"
                    >
                        <FiClock className={`flex-shrink-0 transition-colors ${isActive('/history') ? 'text-indigo-700' : 'text-gray-400 group-hover:text-indigo-500'}`} size={20} />
                        {isOpen ? <span className="ml-3 font-medium">History Log</span> : null}
                    </Link>
                </nav>

                {isOpen && (
                    <div className="mt-8 px-3 animate-fadeIn">
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Recent Projects
                        </h3>
                        <div className="space-y-1">
                            {readmes.length === 0 ? (
                                <div className="px-3 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p className="text-xs text-gray-400 italic">No READMEs yet</p>
                                    <Link to="/create" className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 block">Create one</Link>
                                </div>
                            ) : (
                                readmes.slice(0, 5).map((readme) => (
                                    <Link
                                        key={readme._id}
                                        to={`/edit/${readme._id}`}
                                        className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                                    >
                                        <FiFileText className="flex-shrink-0 mr-3 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                        <span className="truncate">{readme.title || 'Untitled README'}</span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar Footer (Optional) */}
            {isOpen && (
                <div className="p-4 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-400">
                        &copy; 2024 AI README
                    </p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
