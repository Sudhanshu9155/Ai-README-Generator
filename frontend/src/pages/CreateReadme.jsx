import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReadmeForm from '../components/readme/ReadmeForm';
import ReadmePreview from '../components/readme/ReadmePreview';
import RepoSelector from '../components/github/RepoSelector';
import GitHubConnect from '../components/github/GitHubConnect';
import { createReadme, updateReadme } from '../api/entityApi';
import { analyzeRepo } from '../api/githubApi';
import { useAuth } from '../context/AuthContext';
import { FaGithub } from 'react-icons/fa';

const CreateReadme = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState('form'); // form, selection, preview
    const [generatedContent, setGeneratedContent] = useState('');
    const [formData, setFormData] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [showRepoSelector, setShowRepoSelector] = useState(false);
    const [readmeId, setReadmeId] = useState(null);

    const handleRepoSelect = async (repo) => {
        setIsGenerating(true);
        try {
            // Initial basic data
            const basicStack = repo.language ? [repo.language] : [];

            // Try to analyze repo content
            let detectedStack = [];
            try {
                const analysis = await analyzeRepo(repo.owner.login, repo.name);
                if (analysis && analysis.techStack) {
                    detectedStack = analysis.techStack;
                }
            } catch (err) {
                console.warn("Repo analysis failed, using basic info", err);
            }

            // Merge stacks
            const finalStack = Array.from(new Set([...basicStack, ...detectedStack]));

            // Pre-fill form with repo data
            setFormData({
                title: repo.name,
                description: repo.description,
                techStack: finalStack,
                repoUrl: repo.html_url,
                features: [] // Could potentially extract features later
            });
        } catch (error) {
            console.error("Selection error:", error);
        } finally {
            setIsGenerating(false);
            setShowRepoSelector(false);
        }
    };

    const handleFormSubmit = async (data) => {
        setIsGenerating(true);
        // Save form data so it persists if user goes back to edit
        setFormData(data);

        try {
            // Include isPublic default
            const payload = { ...data, isPublic: false };

            if (readmeId) {
                // Update existing README
                result = await updateReadme(readmeId, { ...payload, regenerate: true });
            } else {
                // Create new README
                result = await createReadme(payload);
                setReadmeId(result._id);
            }

            setGeneratedContent(result.content);
            setStep('preview');
        } catch (error) {
            console.error("Error creating/updating README:", error);
            alert("Failed to generate README. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        // Redirect to edit page or dashboard
        navigate(`/edit/${readmeId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {step === 'preview' ? 'Your Generated README' : 'Create New README'}
                </h1>
                {step === 'form' && (
                    <p className="mt-2 text-gray-600">
                        Fill in the details below or import from your GitHub repository.
                    </p>
                )}
            </div>

            {step === 'form' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ReadmeForm
                            onSubmit={handleFormSubmit}
                            initialData={formData}
                            isGenerating={isGenerating}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <FaGithub className="mr-2" /> GitHub Integration
                            </h3>

                            {!user?.githubId ? (
                                <GitHubConnect />
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Connected as {user.githubUsername || 'GitHub User'}
                                    </p>
                                    <button
                                        onClick={() => setShowRepoSelector(!showRepoSelector)}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                    >
                                        {showRepoSelector ? 'Cancel Selection' : 'Import from Repository'}
                                    </button>

                                    {showRepoSelector && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm shadow-2xl">
                                            <div className="relative w-full max-w-2xl">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowRepoSelector(false)}
                                                    className="absolute -top-12 right-0 text-white hover:text-gray-300 flex items-center"
                                                >
                                                    <span className="mr-2">Close</span>
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                                <RepoSelector onSelect={handleRepoSelect} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                            <h4 className="font-semibold text-indigo-800 mb-2">Tips for better results</h4>
                            <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1">
                                <li>Be specific about your project features</li>
                                <li>List all major technologies used</li>
                                <li>Mention unique selling points</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {step === 'preview' && (
                <ReadmePreview
                    content={generatedContent}
                    onEdit={() => setStep('form')}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default CreateReadme;
