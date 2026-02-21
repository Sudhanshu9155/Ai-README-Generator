import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createOrder, verifyPayment } from '../api/paymentApi';
import { FaCrown, FaCheck } from 'react-icons/fa';

const Upgrade = () => {
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const isProUser = user?.isPro === true;

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
        setLoading(true);

        const res = await loadRazorpay();
        if (!res) {
            alert('Razorpay SDK failed to load.');
            setLoading(false);
            return;
        }

        try {
            const order = await createOrder();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'AI Readme Generator',
                description: 'Upgrade to Pro',
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await verifyPayment(response);
                    if (verifyRes.success) {
                        await checkAuth();
                        navigate('/dashboard');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: '#4F46E5' }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            alert('Payment failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-center mb-10">
                Choose Your Plan
            </h1>

            <div className="grid md:grid-cols-2 gap-8">

                {/* FREE PLAN */}
                <div className={`rounded-xl border p-6 shadow-sm 
                    ${!isProUser ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}`}>
                    
                    <h2 className="text-xl font-semibold mb-2">Free</h2>
                    <p className="text-3xl font-bold mb-4">₹0</p>

                    <ul className="space-y-3 text-sm text-gray-600 mb-6">
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500" /> Create up to 2 READMEs
                        </li>
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500" /> Basic analytics
                        </li>
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500" /> GitHub integration
                        </li>
                    </ul>

                    {!isProUser && (
                        <button
                            disabled
                            className="w-full bg-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium"
                        >
                            Current Plan
                        </button>
                    )}
                </div>

                {/* PRO PLAN */}
                <div className={`rounded-xl border p-6 shadow-md relative
                    ${isProUser ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200'}`}>

                    <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-semibold">
                        MOST POPULAR
                    </div>

                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <FaCrown className="text-amber-500" /> Pro
                    </h2>

                    <p className="text-3xl font-bold mb-4">₹500</p>

                    <ul className="space-y-3 text-sm text-gray-600 mb-6">
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500" /> Unlimited READMEs
                        </li>
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500" /> Advanced analytics
                        </li>
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500" /> Priority support
                        </li>
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500" /> Future premium features
                        </li>
                    </ul>

                    {isProUser ? (
                        <button
                            disabled
                            className="w-full bg-amber-100 text-amber-700 py-2 rounded-lg text-sm font-semibold"
                        >
                            You are Pro
                        </button>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                        >
                            {loading ? 'Processing...' : 'Upgrade to Pro'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Upgrade;