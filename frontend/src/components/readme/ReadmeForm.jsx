import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import RepoSelector from './RepoSelector';
import { FaGithub, FaMagic, FaTerminal, FaCode } from 'react-icons/fa';

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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRepoSelect = (repoData) => {
        setFormData(prev => ({
            ...prev,
            title: repoData.title,
            description: repoData.description,
            techStack: repoData.techStack.join(', '),
            features: "Analysis pending features...",
            repoUrl: repoData.repoUrl,
            isPublic: true
        }));
        setShowRepoSelector(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const processedData = {
            ...formData,
            techStack: typeof formData.techStack === 'string' ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean) : formData.techStack,
            features: typeof formData.features === 'string' ? formData.features.split('\n').map(s => s.trim()).filter(Boolean) : formData.features
        };
        onSubmit(processedData);
    };

    // Shared Tailwind Styles for AI Dark Theme
    const inputStyle = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all outline-none";
    const labelStyle = "flex items-center gap-2 text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest";

    if (showRepoSelector) {
        return (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaGithub className="text-purple-400" /> Select Repository
                </h2>
                <RepoSelector
                    onSelect={handleRepoSelect}
                    onCancel={() => setShowRepoSelector(false)}
                />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Field */}
            <div className="relative group">
                <label className={labelStyle}>
                    <FaTerminal className="text-purple-500 text-xs" /> Project Title 
                    <span className="text-purple-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="e.g. Neural-Compute-Engine"
                />
            </div>

            {/* Description Field */}
            <div>
                <label className={labelStyle}>Description</label>
                <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className={`${inputStyle} resize-none`}
                    placeholder="Briefly describe the purpose of this project..."
                />
            </div>

            {/* Tech Stack Field */}
            <div>
                <label className={labelStyle}>
                    <FaCode className="text-blue-400 text-xs" /> Tech Stack 
                    <span className="text-[10px] text-slate-500 font-medium ml-auto">COMMA SEPARATED</span>
                </label>
                <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    className={`${inputStyle} resize-none`}
                    placeholder="React, Node.js, Tailwind..."
                />
                <div className="flex flex-wrap gap-2 mt-3">
                    {formData.techStack.split(',').map((tech, idx) => (
                        tech.trim() && (
                            <span key={idx} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-tighter">
                                {tech.trim()}
                            </span>
                        )
                    ))}
                </div>
            </div>

            {/* Key Features Field */}
            <div>
                <label className={labelStyle}>Key Features</label>
                <textarea
                    name="features"
                    rows="4"
                    value={formData.features}
                    onChange={handleChange}
                    className={`${inputStyle} resize-none font-mono text-xs leading-relaxed`}
                    placeholder="- Secure JWT Auth&#10;- Real-time Socket sync&#10;- Dark Mode support"
                />
            </div>

            {/* Repository Section */}
            <div className="pt-4 border-t border-white/5">
                <label className={labelStyle}>Source Repository</label>
                {user?.githubUsername ? (
                    <div className="relative group cursor-pointer" onClick={() => setShowRepoSelector(true)}>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                        <div className="relative flex items-center justify-between p-4 bg-slate-900 border border-white/10 rounded-xl">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-white/5 rounded-lg text-white">
                                    <FaGithub size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-xs">
                                        {formData.repoUrl || 'No repository linked'}
                                    </p>
                                    <p className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">
                                        {formData.repoUrl ? '✓ Data Synced' : 'Ready to link'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-purple-400">CHANGE</span>
                        </div>
                    </div>
                ) : (
                    <input
                        type="url"
                        name="repoUrl"
                        value={formData.repoUrl}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="https://github.com/username/repo"
                    />
                )}
            </div>

            {/* Public Toggle - Modernized */}
            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/[0.08] transition-all">
                <div className="relative inline-flex items-center cursor-pointer">
                    <input
                        id="isPublic"
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </div>
                <label htmlFor="isPublic" className="flex-1 cursor-pointer">
                    <span className="block font-bold text-white text-sm">Deploy to Public History</span>
                    <span className="text-xs text-slate-500">Allow other developers to view your README structure</span>
                </label>
            </div>

            {/* Submit Action Area */}
            <div className="flex items-center justify-end gap-4 pt-6">
                <button
                    type="button"
                    className="px-6 py-3 text-slate-400 font-bold text-sm hover:text-white transition-colors"
                    onClick={() => window.history.back()}
                >
                    Discard
                </button>
                <button
                    type="submit"
                    disabled={isGenerating}
                    className={`relative group px-8 py-3 rounded-xl font-black text-sm tracking-tighter text-white transition-all overflow-hidden ${isGenerating ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                    <div className="relative flex items-center gap-2">
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <span>SYNTHESIZING...</span>
                            </>
                        ) : (
                            <>
                                <FaMagic className="text-xs" />
                                <span>GENERATE README</span>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </form>
    );
};

export default ReadmeForm;