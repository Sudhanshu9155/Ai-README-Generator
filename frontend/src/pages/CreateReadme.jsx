import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReadmeForm from '../components/readme/ReadmeForm';
import ReadmePreview from '../components/readme/ReadmePreview';
import GitHubConnect from '../components/common/GitHubConnect';
import { createReadme, updateReadme } from '../api/entityApi';
import { createOrder, verifyPayment } from '../api/paymentApi';
import { useAuth } from '../context/AuthContext';
import { FaGithub, FaCrown, FaMagic, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const CreateReadme = () => {
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState('form');
    const [generatedContent, setGeneratedContent] = useState('');
    const [formData, setFormData] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [readmeId, setReadmeId] = useState(null);
    const [readme, setReadme] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // ... (Keep loadRazorpay and handlePayment logic exactly as they are)
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpay();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }
        try {
            const order = await createOrder();
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "AI Readme Generator",
                description: "Upgrade to Pro for Unlimited Generations",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const data = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        const verifyRes = await verifyPayment(data);
                        if (verifyRes.success) {
                            setShowPaymentModal(false);
                            await checkAuth();
                        }
                    } catch (err) { console.error(err); }
                },
                prefill: { name: user?.name, email: user?.email },
                theme: { color: "#8b5cf6" }
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) { console.error("Payment Error:", err); }
    };

    const handleFormSubmit = async (data) => {
        setIsGenerating(true);
        setFormData(data);
        try {
            const payload = { ...data, isPublic: false };
            let result;
            if (readmeId) {
                result = await updateReadme(readmeId, { ...payload, regenerate: true });
                setReadme(result);
            } else {
                result = await createReadme(payload);
                setReadmeId(result._id);
                setReadme(result);
            }
            setGeneratedContent(result.content);
            setStep('preview');
        } catch (error) {
            if (error.response?.status === 403 && error.response.data.code === 'LIMIT_REACHED') {
                setShowPaymentModal(true);
            } else { alert("Failed to generate README."); }
        } finally { setIsGenerating(false); }
    };

    const handleSave = () => navigate(`/edit/${readmeId}`);

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-x-hidden font-sans pb-10">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="stars-small opacity-40"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[210px] rounded-full"></div>
            </div>

            {/* Payment Modal: Optimized for Small Screens */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="relative bg-slate-900 border border-white/10 w-full max-w-md shadow-2xl rounded-[2.5rem] p-6 md:p-10 text-center overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-purple-500/20 mb-6">
                            <FaCrown className="text-purple-400 text-3xl" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-3">Unlock Unlimited Power</h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed px-2">
                            You've hit the free tier limit. Upgrade to Pro for unlimited AI generations and custom templates.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link to="/upgrade">
                                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">
                                    Upgrade to Pro Now
                                </button>
                            </Link>
                            <button onClick={() => setShowPaymentModal(false)} className="w-full py-3 text-slate-400 font-bold text-sm hover:text-white transition-colors">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 relative z-10">

                {/* Mobile-Friendly Header */}
                <div className="mb-8">
                    <button
                        onClick={() => step === 'preview' ? setStep('form') : navigate('/dashboard')}
                        className="flex items-center text-slate-500 hover:text-purple-400 transition-colors mb-6 text-[10px] font-black tracking-widest uppercase"
                    >
                        <FaArrowLeft className="mr-2" /> {step === 'preview' ? 'Back to Editor' : 'Dashboard'}
                    </button>

                    <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-500/20 rounded-xl">
                                <FaMagic className="text-purple-400 text-xl animate-pulse" />
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent tracking-tight">
                                {step === 'preview' ? 'AI Synthesis Complete' : 'Forge Your README'}
                            </h1>
                        </div>
                        {step === 'form' && (
                            <p className="text-slate-500 text-xs md:text-sm font-medium">
                                Professional documentation in seconds.
                            </p>
                        )}
                    </div>
                </div>

                {/* Main Content Area: Responsive Grid */}
                {step === 'form' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                        {/* Form Container: Stacks first */}
                        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl">
                            <ReadmeForm
                                onSubmit={handleFormSubmit}
                                initialData={formData}
                                isGenerating={isGenerating}
                            />
                        </div>

                        {/* Sidebar Utils: Move to bottom on mobile */}
                        <div className="lg:col-span-1 space-y-4 md:space-y-6">
                            <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaGithub className="text-xl text-white opacity-80" />
                                    <h2 className="font-bold text-white text-sm">Import Data</h2>
                                </div>
                                <GitHubConnect />
                            </div>

                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6">
                                <div className="flex items-center gap-3 mb-3 text-purple-400">
                                    <FaShieldAlt size={14} />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest">AI Synthesis Tips</h3>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Be specific about your tech stack (e.g., "MERN") for precise installation guides.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Preview Mode */
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
                        <ReadmePreview
                            content={generatedContent}
                            onEdit={() => setStep('form')}
                            onSave={handleSave}
                            entity={readme}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateReadme;