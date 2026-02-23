import { useState, useEffect } from 'react';
import { listRepos, analyzeRepo } from '../../api/githubApi';
import { FaGithub, FaSearch, FaCode, FaChevronRight, FaTimes, FaRobot } from 'react-icons/fa';
import Loader from '../common/Loader';

const RepoSelector = ({ onSelect, onCancel }) => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const data = await listRepos();
                setRepos(data);
            } catch (err) {
                setError('Failed to fetch repositories. Please ensure your GitHub uplink is active.');
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    const handleSelectRepo = async (repo) => {
        setAnalyzing(true);
        try {
            const analysis = await analyzeRepo(repo.clone_url, repo.name);

            const enrichedData = {
                title: analysis.title || repo.name,
                description: analysis.description || repo.description,
                techStack: analysis.techStack || [repo.language].filter(Boolean),
                repoUrl: repo.html_url,
                features: [],
                isPublic: !repo.private
            };

            onSelect(enrichedData);
        } catch (err) {
            setError('Neural analysis failed. Please try again.');
            setAnalyzing(false);
        }
    };

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) return <Loader message="Scanning GitHub Repositories..." />;

    if (error) {
        return (
            <div className="p-6 md:p-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-center mx-4 md:mx-0">
                <p className="text-red-400 font-bold mb-4 uppercase tracking-widest text-[10px] md:text-xs">{error}</p>
                <button
                    onClick={onCancel}
                    className="text-slate-400 hover:text-white underline text-[10px] md:text-xs font-bold transition-colors"
                >
                    Return to Forge
                </button>
            </div>
        );
    }

    return (
        /* Reduced rounded corners on mobile for better edge-to-edge look */
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl max-w-2xl mx-auto">
            
            {/* Header: Responsive Padding */}
            <div className="px-5 md:px-8 py-4 md:py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FaGithub className="text-purple-400 text-lg md:text-xl" />
                    <h3 className="font-black text-white text-[10px] md:text-sm uppercase tracking-widest">Select Source</h3>
                </div>
                <button onClick={onCancel} className="p-2 text-slate-500 hover:text-white transition-colors">
                    <FaTimes />
                </button>
            </div>

            {/* Search Bar: Responsive Padding */}
            <div className="p-4 md:p-6 bg-white/5 border-b border-white/5">
                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        className="w-full bg-[#030712]/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all text-xs md:text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Repo List Area */}
            <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                {analyzing ? (
                    <div className="p-16 md:p-20 text-center flex flex-col items-center justify-center">
                        <div className="relative mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-purple-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin"></div>
                            <FaRobot className="absolute inset-0 m-auto text-purple-400 animate-pulse text-sm md:text-base" />
                        </div>
                        <p className="text-purple-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Analyzing Architecture...</p>
                    </div>
                ) : filteredRepos.length > 0 ? (
                    <ul className="divide-y divide-white/5">
                        {filteredRepos.map(repo => (
                            <li key={repo.id}>
                                <button
                                    onClick={() => handleSelectRepo(repo)}
                                    /* Fixed: Reduced horizontal padding on mobile (px-5 vs px-8) */
                                    className="w-full text-left px-5 md:px-8 py-4 md:py-5 flex items-center justify-between group hover:bg-purple-500/5 transition-all"
                                >
                                    <div className="min-w-0 pr-4">
                                        <div className="font-bold text-slate-200 group-hover:text-purple-400 transition-colors truncate text-sm">
                                            {repo.name}
                                        </div>
                                        {/* Fixed: Hidden description on smallest screens to keep title readable, or truncated more strictly */}
                                        <div className="text-[9px] md:text-[10px] text-slate-500 mt-1 truncate max-w-[200px] md:max-w-sm font-medium">
                                            {repo.description || 'No binary description.'}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                                        {/* Fixed: Language tag hidden on very small screens to prevent row overflow */}
                                        {repo.language && (
                                            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 uppercase">
                                                <FaCode className="text-purple-500" size={10} />
                                                {repo.language}
                                            </span>
                                        )}
                                        <FaChevronRight className="text-slate-700 group-hover:text-purple-400 md:group-hover:translate-x-1 transition-all text-xs" />
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-16 md:p-20 text-center flex flex-col items-center">
                        <FaSearch className="text-slate-800 text-2xl md:text-3xl mb-4" />
                        <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">
                            No signals found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepoSelector;