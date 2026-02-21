import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import RepoSelector from './RepoSelector';
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
    const [showRepoSelector, setShowRepoSelector] = useState(false);
    const { user } = useAuth();

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

    const handleRepoSelect = (repoData) => {
        setFormData(prev => ({
            ...prev,
            title: repoData.title,
            description: repoData.description,
            techStack: repoData.techStack.join(', '),
            features: "Analysis pending features...", // Or leave empty if analysis doesn't give features
            repoUrl: repoData.repoUrl,
            isPublic: true // Likely want it public if from GH
        }));
        setShowRepoSelector(false);
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

    if (showRepoSelector) {
        return (
            <div className="card space-y-6">
                <h2 className="text-xl font-bold mb-4">Select Repository</h2>
                <RepoSelector
                    onSelect={handleRepoSelect}
                    onCancel={() => setShowRepoSelector(false)}
                />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="card space-y-6">
            {/* Title Field */}
            <div className="form-group">
                <label className="form-label">
                    Project Title
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. My Awesome Project"
                />
                <p className="form-hint">Give your project a unique and descriptive name</p>
            </div>

            {/* Description Field */}
            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea-field"
                    placeholder="Briefly describe what your project does..."
                />
                <p className="form-hint">Max 500 characters recommended</p>
            </div>

            {/* Tech Stack Field */}
            <div className="form-group">
                <label className="form-label">
                    Tech Stack
                    <span className="text-gray-400 font-normal text-xs ml-2">(comma separated)</span>
                </label>
                <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="React, Node.js, MongoDB, Tailwind..."
                />
                <div className="flex flex-wrap gap-2 mt-3">
                    {formData.techStack.split(',').map((tech, idx) => (
                        tech.trim() && (
                            <span key={idx} className="badge-primary text-xs">
                                {tech.trim()}
                            </span>
                        )
                    ))}
                </div>
            </div>

            {/* Key Features Field */}
            <div className="form-group">
                <label className="form-label">
                    Key Features
                    <span className="text-gray-400 font-normal text-xs ml-2">(one per line)</span>
                </label>
                <textarea
                    name="features"
                    rows="5"
                    value={formData.features}
                    onChange={handleChange}
                    className="textarea-field font-mono text-sm"
                    placeholder="- User Authentication&#10;- Real-time updates&#10;- Responsive Design"
                />
            </div>

            {/* Repository URL or Selection */}
            <div className="form-group">
                <label className="form-label">Repository</label>
                {user?.githubUsername ? (
                    <div className="space-y-3">
                        {formData.repoUrl ? (
                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <FaGithub className="text-gray-700 text-xl" />
                                    <div>
                                        <p className="font-medium text-gray-900 truncate max-w-xs">{formData.repoUrl}</p>
                                        <p className="text-xs text-green-600 font-semibold">✓ Connected</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowRepoSelector(true)}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowRepoSelector(true)}
                                className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors bg-gray-50 hover:bg-white"
                            >
                                <FaGithub className="text-xl" />
                                <span className="font-medium">Select Repository from GitHub</span>
                            </button>
                        )}
                        <p className="form-hint">Select a repository to automatically analyze and fill details</p>
                    </div>
                ) : (
                    <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                        <input
                            type="url"
                            name="repoUrl"
                            value={formData.repoUrl}
                            onChange={handleChange}
                            className="flex-1 block w-full px-4 py-2.5 bg-white border-0 focus:outline-none focus:ring-0 sm:text-sm"
                            placeholder="https://github.com/username/repo"
                        />
                    </div>
                )}
            </div>

            {/* Public Toggle */}
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-800 font-medium cursor-pointer flex-1">
                    <span className="block font-semibold text-gray-900">Make Public</span>
                    <span className="text-xs text-gray-600">Allow others to view and share this README</span>
                </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    className="btn-outline"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isGenerating}
                    className={`btn-primary flex items-center gap-2 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating AI Content...</span>
                        </>
                    ) : (
                        <>
                            <span>✨</span>
                            <span>Generate README</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};


export default ReadmeForm;
