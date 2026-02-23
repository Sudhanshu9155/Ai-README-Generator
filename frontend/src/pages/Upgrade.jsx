import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createOrder, verifyPayment } from '../api/paymentApi';
import { FaCrown, FaCheck, FaStar } from 'react-icons/fa';
import Loader from '../components/common/Loader';

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
                theme: { color: '#8b5cf6' }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            alert('Payment failed.');
        } finally {
            setLoading(false);
        }
    };

    const PlanFeature = ({ text, active }) => (
        <li className="flex items-center gap-3 text-xs md:text-sm text-slate-300 font-medium">
            <div className={`p-1 rounded-full shrink-0 ${active ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-600'}`}>
                <FaCheck size={10} />
            </div>
            {text}
        </li>
    );

    if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Loader /></div>;

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-x-hidden py-10 md:py-20 px-4 md:px-8">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="stars-small opacity-20"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[210px] rounded-full"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent mb-3 tracking-tight">
                        Choose Your Plan
                    </h1>
                    <p className="text-slate-500 font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em]">
                        Unlock the full potential of AI documentation
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">

                    {/* STANDARD PLAN */}
                    <div className={`relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border transition-all duration-500 flex flex-col
                        ${!isProUser ? 'border-purple-500/30 bg-purple-500/[0.02]' : 'border-white/5 opacity-50'}`}>
                        
                        <div className="mb-6">
                            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Standard</h2>
                            <p className="text-3xl md:text-4xl font-black text-white">₹0</p>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            <PlanFeature text="Create up to 2 READMEs" active={!isProUser} />
                            <PlanFeature text="Basic analytics" active={!isProUser} />
                            <PlanFeature text="GitHub integration" active={!isProUser} />
                        </ul>

                        {!isProUser ? (
                            <div className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-center text-slate-500 font-black text-[10px] tracking-widest uppercase">
                                Active Plan
                            </div>
                        ) : (
                            <div className="h-12"></div> 
                        )}
                    </div>

                    {/* PRO PLAN */}
                    <div className={`relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/60 backdrop-blur-2xl border-2 transition-all duration-500 flex flex-col
                        ${isProUser ? 'border-amber-500/40' : 'border-purple-500 shadow-[0_0_40px_rgba(139,92,246,0.15)]'}`}>

                        {/* Popular Badge for Mobile */}
                        {!isProUser && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                                Recommended
                            </div>
                        )}

                        <div className="mb-6">
                            <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-2 justify-center md:justify-start">
                                <FaCrown className="text-amber-400" /> Pro Access
                            </h2>
                            <p className="text-3xl md:text-4xl font-black text-white">₹500</p>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            <PlanFeature text="Unlimited READMEs" active />
                            <PlanFeature text="Advanced analytics" active />
                            <PlanFeature text="Priority Support (24/7)" active />
                            <PlanFeature text="Early access to new models" active />
                        </ul>

                        {isProUser ? (
                            <div className="w-full py-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-amber-500 font-black text-[10px] tracking-widest uppercase">
                                Pro Status Enabled
                            </div>
                        ) : (
                            <button
                                onClick={handlePayment}
                                className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-purple-900/20"
                            >
                                UPGRADE TO PRO
                            </button>
                        )}
                    </div>
                </div>

                {/* Secure Payment Note */}
                <div className="mt-10 text-center">
                    <p className="flex items-center justify-center gap-2 text-slate-600 text-[9px] font-bold uppercase tracking-widest">
                        <FaStar className="text-purple-500/40" /> Secure transaction powered by Razorpay
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Upgrade;