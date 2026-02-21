import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReadmeForm from '../components/readme/ReadmeForm';
import ReadmePreview from '../components/readme/ReadmePreview';
import GitHubConnect from '../components/common/GitHubConnect';
import { createReadme, updateReadme } from '../api/entityApi';
import { createOrder, verifyPayment } from '../api/paymentApi';

import { useAuth } from '../context/AuthContext';
import { FaGithub, FaCrown } from 'react-icons/fa';

const CreateReadme = () => {
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState('form'); // form, selection, preview
    const [generatedContent, setGeneratedContent] = useState('');
    const [formData, setFormData] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [readmeId, setReadmeId] = useState(null);
    const [readme, setReadme] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this is set in your .env
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
                            alert("Payment Successful! You are now a Pro member.");
                            setShowPaymentModal(false);
                            await checkAuth(); // Refresh user state
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: ""
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error("Payment Error:", err);
            alert("Something went wrong with payment initiation.");
        }
    };

    const handleFormSubmit = async (data) => {
        setIsGenerating(true);
        // Save form data so it persists if user goes back to edit
        setFormData(data);

        try {
            // Include isPublic default
            const payload = { ...data, isPublic: false };
            let result;

            if (readmeId) {
                // Update existing README
                result = await updateReadme(readmeId, { ...payload, regenerate: true });
                    setReadme(result);
            } else {
                // Create new README
                result = await createReadme(payload);
                setReadmeId(result._id);
                    setReadme(result);
            }

            setGeneratedContent(result.content);
            setStep('preview');

            // Auto-push removed from frontend per user request.
        } catch (error) {
            console.error("Error creating/updating README:", error);
            if (error.response && error.response.status === 403 && error.response.data.code === 'LIMIT_REACHED') {
                setShowPaymentModal(true);
            } else {
                alert("Failed to generate README. Please try again.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        // Redirect to edit page or dashboard
        navigate(`/edit/${readmeId}`);
    };

    // Push functionality removed from frontend.

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            {showPaymentModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                                <FaCrown className="text-yellow-600 text-xl" />
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Upgrade to Pro</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    You have reached your free limit of 2 generated READMEs. Upgrade to Pro for unlimited access!
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    id="ok-btn"
                                    onClick={handlePayment}
                                    className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
                                >
                                    Pay ₹500
                                </button>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    <div className="lg:col-span-1">
                        <GitHubConnect />
                    </div>
                </div>
            )}

            {step === 'preview' && (
                <ReadmePreview
                    content={generatedContent}
                    onEdit={() => setStep('form')}
                    onSave={handleSave}
                    entity={readme}
                />
            )}
        </div>
    );
};

export default CreateReadme;
