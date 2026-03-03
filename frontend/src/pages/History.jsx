import { useState, useEffect } from 'react';
import { getUserActivity } from '../api/analyticsApi';
import Loader from '../components/common/Loader';
import { FaPlus, FaEdit, FaTrash, FaHistory, FaRobot, FaClock } from 'react-icons/fa';
import HistorySkeleton from '../components/skeletons/HistorySkeleton';

const History = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getUserActivity();
                setActivities(data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getActionStyles = (action) => {
        switch (action) {
            case 'CREATED_README':
                return { color: 'bg-emerald-500', icon: <FaPlus />, glow: 'shadow-[0_0_15px_#10b981]' };
            case 'UPDATED_README':
                return { color: 'bg-blue-500', icon: <FaEdit />, glow: 'shadow-[0_0_15px_#3b82f6]' };
            case 'DELETED_README':
                return { color: 'bg-red-500', icon: <FaTrash />, glow: 'shadow-[0_0_15px_#ef4444]' };
            default:
                return { color: 'bg-purple-500', icon: <FaRobot />, glow: 'shadow-[0_0_15px_#a855f7]' };
        }
    };

    // if (loading) return <Loader />;
    if (loading) return <HistorySkeleton/>;

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-x-hidden font-sans pb-10">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="stars-small opacity-40"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[210px] rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
                
                {/* Page Header: Responsive Alignment */}
                <div className="mb-10 flex flex-col items-center md:flex-row md:items-start text-center md:text-left gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                        <FaHistory className="text-purple-400 text-2xl" />
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                            System Logs
                        </h1>
                        <p className="text-slate-500 font-medium tracking-wide uppercase text-[9px] md:text-[10px] mt-1">
                            Tracking neural generations & workspace changes
                        </p>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="relative">
                    {activities.length === 0 ? (
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-white/5 rounded-full text-slate-700">
                                <FaClock size={40} className="opacity-20" />
                            </div>
                            <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">
                                No activity recorded in history.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {activities.map((activity, activityIdx) => {
                                const style = getActionStyles(activity.action);
                                return (
                                    <div key={activity._id} className="relative group">
                                        {/* Vertical Timeline Line - Fixed for mobile positioning */}
                                        {activityIdx !== activities.length - 1 && (
                                            <span 
                                                className="absolute top-12 left-5 md:left-6 -ml-px h-full w-0.5 bg-gradient-to-b from-white/10 to-transparent" 
                                                aria-hidden="true"
                                            ></span>
                                        )}

                                        <div className="relative flex items-start space-x-4 md:space-x-6">
                                            {/* Action Icon Circle */}
                                            <div className="relative shrink-0">
                                                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white z-10 relative transition-transform group-hover:scale-110 duration-300 ${style.color} ${style.glow}`}>
                                                    <span className="text-sm md:text-base">{style.icon}</span>
                                                </div>
                                            </div>

                                            {/* Log Content Card */}
                                            <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 hover:bg-white/[0.08] transition-all">
                                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
                                                    <div>
                                                        <span className="text-xs md:text-sm font-bold text-slate-100 block mb-1 uppercase tracking-wider">
                                                            {activity.action.replace(/_/g, ' ')}
                                                        </span>
                                                        <p className="text-slate-400 leading-relaxed italic font-mono text-[10px] md:text-xs">
                                                            {activity.details}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Timestamp Badge */}
                                                    <div className="flex justify-start lg:justify-end">
                                                        <time className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 whitespace-nowrap">
                                                            {new Date(activity.createdAt).toLocaleDateString()} — {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;