import { useState, useEffect } from 'react';
import { getUserRepos } from '../../api/githubApi';
import Loader from '../common/Loader';
import { FaSearch, FaGithub, FaChevronDown } from 'react-icons/fa';
import { SiGithub } from 'react-icons/si'; // Using SiGithub for the triangle-ish logo if available, or just FaGithub
// Note: SiGithub might not be available in all react-icons versions or might be in 'react-icons/si'. 
// Let's stick to FaGithub or a custom SVG for the "triangle" logo in the screenshot which looks like Vercel's logo, but this is a GitHub import.
// Actually the screenshot shows a triangle logo for the repos, which is Vercel's logo. User probably wants that "Vercel style".
// I will use a simple triangle SVG or just a placeholder.
import { useAuth } from '../../context/AuthContext';

// Helper for relative time
const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (days > 0) {
        return `${days}d ago`;
    } else if (hours > 0) {
        return `${hours}h ago`;
    } else if (minutes > 0) {
        return `${minutes}m ago`;
    } else {
        return 'Just now';
    }
};

const RepoSelector = ({ onSelect }) => {
    const { user } = useAuth();
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const data = await getUserRepos();
                // Check if data is array (handle API error wrapper if needed)
                if (Array.isArray(data)) {
                    setRepos(data);
                } else {
                    setRepos([]); // Fallback
                }
            } catch (err) {
                console.error("Error fetching repos", err);
                setError("Failed to load repositories. Please ensure GitHub is connected.");
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>;

    return (
        <div className="bg-black text-white p-6 rounded-lg shadow-xl border border-gray-800 w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Import Git Repository</h3>

            <div className="flex gap-4 mb-6">
                {/* User Dropdown */}
                <div className="w-1/3 flex items-center justify-between px-3 py-2 bg-[#111] border border-[#333] rounded-md text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                        <FaGithub className="text-white" />
                        <span className="truncate">{user?.githubUsername || 'Github User'}</span>
                    </div>
                    <FaChevronDown className="text-gray-500 text-xs" />
                </div>

                {/* Search Bar */}
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-3 py-2 bg-[#111] border border-[#333] rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Repository List */}
            <div className="border border-[#333] rounded-lg overflow-hidden">
                <ul className="divide-y divide-[#333] max-h-96 overflow-y-auto">
                    {filteredRepos.length === 0 ? (
                        <li className="px-4 py-8 text-center text-gray-400 text-sm">
                            No repositories found.
                        </li>
                    ) : (
                        filteredRepos.map(repo => (
                            <li
                                key={repo.id}
                                className="px-4 py-4 flex items-center justify-between hover:bg-[#111] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Repo Icon (Simulating the triangle/logo) */}
                                    <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center bg-black">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M3 3h18v18H3zM12 8l-4 4 4 4M12 8l4 4-4 4" /></svg>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{repo.name}</span>
                                            <span className="text-gray-500 text-xs">• {timeAgo(repo.updated_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onSelect(repo)}
                                    className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                                >
                                    Import
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default RepoSelector;
