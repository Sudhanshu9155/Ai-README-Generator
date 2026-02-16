import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import RepoSelector from '../github/RepoSelector';
import { analyzeRepo } from '../../api/githubApi';
import { FaGithub } from 'react-icons/fa';

const ReadmeForm = ({ onSubmit, initialData = {}, isGenerating = false }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        techStack: Array.isArray(initialData.techStack) ? initialData.techStack.join(', ') : (initialData.techStack || ''),
        features: Array.isArray(initialData.features) ? initialData.features.join('\n') : (initialData.features || ''),
        repoUrl: initialData.repoUrl || '',
        isPublic: initialData.isPublic || false
    });
    const { user } = useAuth();
    const [showRepoSelector, setShowRepoSelector] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Sync state with initialData when it changes (e.g. key change or parent update)
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(prev => ({
                ...prev,
                title: initialData.title || prev.title,
                description: initialData.description || prev.description,
                techStack: Array.isArray(initialData.techStack) ? initialData.techStack.join(', ') : (initialData.techStack || prev.techStack),
                features: Array.isArray(initialData.features) ? initialData.features.join('\n') : (initialData.features || prev.features),
                repoUrl: initialData.repoUrl || prev.repoUrl,
                isPublic: initialData.isPublic !== undefined ? initialData.isPublic : prev.isPublic
            }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert comma-separated strings to arrays if needed by backend, 
        // but backend logic (step 38) expects arrays for techStack and features.
        // Let's pass them as arrays.

        const processedData = {
            title: formData.title,
            description: formData.description,
            repoUrl: formData.repoUrl,
            isPublic: formData.isPublic,
            techStack: typeof formData.techStack === 'string' ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean) : formData.techStack,
            features: typeof formData.features === 'string' ? formData.features.split('\n').map(s => s.trim()).filter(Boolean) : formData.features
        };

        onSubmit(processedData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g. My Awesome Project"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Briefly describe what your project does..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Tech Stack <span className="text-gray-400 font-normal">(comma separated)</span>
                </label>
                <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="React, Node.js, MongoDB, Tailwind..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Key Features <span className="text-gray-400 font-normal">(one per line)</span>
                </label>
                <textarea
                    name="features"
                    rows="5"
                    value={formData.features}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="- User Authentication&#10;- Real-time updates&#10;- Responsive Design"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Repository URL</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        type="url"
                        name="repoUrl"
                        value={formData.repoUrl}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 px-3 py-2 border"
                        placeholder="https://github.com/username/repo"
                    />
                    {user?.githubId && (
                        <button
                            type="button"
                            onClick={() => setShowRepoSelector(!showRepoSelector)}
                            disabled={isAnalyzing}
                            className={`-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isAnalyzing ? (
                                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <FaGithub className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            )}
                            <span>{isAnalyzing ? 'Analyzing...' : 'Select Repo'}</span>
                        </button>
                    )}
                </div>
                {showRepoSelector && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
                        <div className="relative w-full max-w-2xl">
                            <button
                                type="button"
                                onClick={() => setShowRepoSelector(false)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 flex items-center"
                            >
                                <span className="mr-2">Close</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            <RepoSelector onSelect={async (repo) => {
                                setIsAnalyzing(true);
                                let detectedStack = repo.language ? [repo.language] : [];
                                try {
                                    const analysis = await analyzeRepo(repo.owner.login, repo.name);
                                    if (analysis && analysis.techStack) {
                                        detectedStack = [...detectedStack, ...analysis.techStack];
                                    }
                                } catch (e) {
                                    console.warn("Analysis failed", e);
                                }
                                const uniqueStack = Array.from(new Set(detectedStack)).join(', ');

                                setFormData(prev => ({
                                    ...prev,
                                    repoUrl: repo.html_url,
                                    title: repo.name,
                                    description: repo.description || prev.description,
                                    techStack: uniqueStack
                                }));
                                setIsAnalyzing(false);
                                setShowRepoSelector(false);
                            }} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center">
                <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                    Make Public
                </label>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isGenerating}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating AI Content...
                        </>
                    ) : (
                        'Generate README'
                    )}
                </button>
            </div>
        </form>
    );
};

export default ReadmeForm;
