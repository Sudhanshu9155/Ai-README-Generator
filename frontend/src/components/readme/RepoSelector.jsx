
import { useState, useEffect } from 'react';
import { listRepos, analyzeRepo } from '../../api/githubApi';

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
                setError('Failed to fetch repositories. Please make sure you have connected your GitHub account.');
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    const handleSelectRepo = async (repo) => {
        setAnalyzing(true);
        try {
            // Call analyzeRepo to get insights
            const analysis = await analyzeRepo(repo.clone_url, repo.name);

            // Combine repo data with analysis data
            const enrichedData = {
                title: analysis.title || repo.name,
                description: analysis.description || repo.description,
                techStack: analysis.techStack || [repo.language].filter(Boolean),
                repoUrl: repo.html_url,
                features: [], // Analysis might not return this yet, but structure is there
                isPublic: !repo.private
            };

            onSelect(enrichedData);
        } catch (err) {
            setError('Failed to analyze repository. Please try again.');
            setAnalyzing(false);
        }
    };

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your repositories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={onCancel}
                    className="text-gray-600 hover:text-gray-900 underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800">Select a Repository</h3>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    ✕
                </button>
            </div>

            <div className="p-4 bg-white">
                <input
                    type="text"
                    placeholder="Search repositories..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="max-h-96 overflow-y-auto">
                {analyzing ? (
                    <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                        <p className="text-indigo-600 font-medium">Analyzing repository structure...</p>
                        <p className="text-gray-500 text-sm mt-1">This might take a few seconds</p>
                    </div>
                ) : filteredRepos.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                        {filteredRepos.map(repo => (
                            <li key={repo.id} className="hover:bg-gray-50 transition-colors">
                                <button
                                    onClick={() => handleSelectRepo(repo)}
                                    className="w-full text-left px-6 py-4 flex items-center justify-between group"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {repo.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 truncate max-w-md">
                                            {repo.description || 'No description'}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {repo.language && (
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="text-gray-400 group-hover:text-indigo-500">
                                            →
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No repositories found matching "{filter}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepoSelector;
