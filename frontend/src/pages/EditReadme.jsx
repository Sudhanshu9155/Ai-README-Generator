import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReadmeById, updateReadme } from '../api/entityApi';
import ReadmePreview from '../components/readme/ReadmePreview';
import ReadmeForm from '../components/readme/ReadmeForm';
// import Loader from '../components/common/Loader';
import { FaArrowLeft, FaEdit, FaTimes } from 'react-icons/fa';
import ReadmePreviewSkeleton from '../components/skeletons/ReadmePreviewSkeleton';

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

    const handleFormSubmit = async (data) => {
        try {
            setLoading(true);
            const updated = await updateReadme(id, data);
            setReadme(updated);
            setIsEditing(false); 
        } catch (err) {
            alert("Failed to update README");
        } finally {
            setLoading(false);
        }
    };

    // if (loading) return (
    //     <div className="min-h-screen bg-[#030712] flex items-center justify-center">
    //         <Loader message="Accessing Neural Database..." />
    //     </div>
    // );
    if(loading) return <ReadmePreviewSkeleton/>;

    if (error) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
            <div className="text-center p-10 bg-red-500/10 border border-red-500/20 rounded-3xl">
                <p className="text-red-400 font-bold uppercase tracking-widest text-sm">{error}</p>
                <button onClick={() => navigate('/dashboard')} className="mt-4 text-slate-400 hover:text-white underline text-xs">Return to Dashboard</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-hidden py-10">
            <div className="absolute inset-0 z-0">
                <div className="stars-small opacity-40"></div>
                <div className="stars-medium opacity-60 animate-pulse"></div>
                <div className="stars-large opacity-80 animate-pulse"></div>
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
            </div>
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500 blur-[210px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-slate-500 hover:text-purple-400 transition-colors mb-4 text-[10px] font-black tracking-[0.2em] uppercase"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight">
                            {readme.title}
                        </h1>
                    </div>
                </div>

                {isEditing ? (
                    <div className="animate-fadeIn">
                        <div className="mb-8 flex justify-between items-center bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <FaEdit className="text-purple-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white tracking-tight">Modify Sequence Details</h2>
                            </div>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                            >
                                <FaTimes /> Discard Changes
                            </button>
                        </div>
                        
                        {/* Form Glass Container */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                            <ReadmeForm
                                onSubmit={handleFormSubmit}
                                initialData={readme}
                                isGenerating={false}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        {/* Preview Glass Container */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl">
                            <ReadmePreview
                                content={readme.content}
                                onEdit={() => setIsEditing(true)}
                                onSave={() => {}} // Save logic handled in Preview's internal edit if added later
                                entity={readme}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditReadme;