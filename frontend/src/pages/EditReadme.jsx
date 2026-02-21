import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReadmeById, updateReadme } from '../api/entityApi';
import ReadmePreview from '../components/readme/ReadmePreview';

import ReadmeForm from '../components/readme/ReadmeForm';
import Loader from '../components/common/Loader';

const EditReadme = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [readme, setReadme] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReadme = async () => {
            try {
                const data = await getReadmeById(id);
                setReadme(data);
            } catch (err) {
                console.error("Failed to fetch readme", err);
                setError("Readme not found or access denied");
            } finally {
                setLoading(false);
            }
        };

        fetchReadme();
    }, [id]);

    const handleUpdateContent = async (newContent) => {
        // Only update content (from manual edit in preview - simplistic approach)
        // For now, ReadmePreview is read-only for editing text directly, 
        // so maybe we don't need this yet unless we add a text editor in Preview.
        // Let's rely on Form update.
    };

    const handleFormSubmit = async (data) => {
        try {
            setLoading(true);
            const updated = await updateReadme(id, data);
            setReadme(updated);
            setIsEditing(false); // Go back to preview
        } catch (err) {
            alert("Failed to update README");
        } finally {
            setLoading(false);
        }
    };

    // Push to GitHub UI removed from frontend.

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    {readme.title}
                </h1>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        &larr; Back to Dashboard
                    </button>
                </div>
            </div>

            {isEditing ? (
                <div>
                    <div className="mb-4 flex justify-between">
                        <h2 className="text-xl font-semibold">Edit Details</h2>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                    <ReadmeForm
                        onSubmit={handleFormSubmit}
                        initialData={readme}
                        isGenerating={false}
                    />
                </div>
            ) : (
                <ReadmePreview
                    content={readme.content}
                    onEdit={() => setIsEditing(true)}
                    onSave={() => alert("Changes saved automatically on update!")}
                    entity={readme}
                />
            )}
        </div>
    );
};

export default EditReadme;
