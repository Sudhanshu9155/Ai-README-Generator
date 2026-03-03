import { useState, useEffect } from 'react';
import { getUserReadmes, deleteReadme } from '../api/entityApi';
import { getDashboardStats } from '../api/analyticsApi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaGithub, FaHistory, FaTrash, FaEdit, FaCrown, FaTerminal, FaRobot, FaExternalLinkAlt } from 'react-icons/fa';
// import Loader from '../components/common/Loader';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

const Dashboard = () => {
    const { user } = useAuth(); 
    const [stats, setStats] = useState({ totalReadmes: 0, totalLines: 0, recentActivity: [] });
    const [readmes, setReadmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const isProUser = user?.isPro === true;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, readmesData] = await Promise.all([
                    getDashboardStats(),
                    getUserReadmes()
                ]);
                setStats(statsData);
                setReadmes(readmesData);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this README?')) {
            try {
                await deleteReadme(id);
                setReadmes(readmes.filter(r => r._id !== id));
                setStats(prev => ({ ...prev, totalReadmes: prev.totalReadmes - 1 }));
            } catch (err) {
                alert("Failed to delete README");
            }
        }
    };

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-x-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="stars-small opacity-40"></div>
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative z-10">
                
                {/* Header Section: Optimized for Stacking */}
                <div className="mb-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <FaRobot className="text-purple-500 animate-pulse" />
                            <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase text-purple-400/80">AI ReadME Dashboard</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent tracking-tighter leading-tight">
                            {user?.name ? `Welcome, ${user.name.split(' ')[0]}` : 'Initializing...'}
                        </h1>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <Link
                            to="/create"
                            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3 rounded-full bg-indigo-600 font-bold text-white transition-all hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                        >
                            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
                            New Project
                        </Link>
                        {!isProUser && (
                            <Link to="/upgrade" className="w-full sm:w-auto p-[1px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                <div className="px-6 py-2.5 rounded-full bg-[#030712] flex items-center justify-center gap-2">
                                    <FaCrown className="text-yellow-500" />
                                    <span className="text-md font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pro</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
                    <StatCard title="Total READMEs" value={stats.totalReadmes} icon={<FaHistory />} color="from-purple-500 to-indigo-600" />
                    <StatCard title="Lines Generated" value={stats.totalLines.toLocaleString()} icon={<FaTerminal />} color="from-blue-500 to-cyan-500" />
                    <StatCard title="GitHub Sync" value={user?.githubUsername || "Not Linked"} icon={<FaGithub />} color="from-slate-700 to-slate-900" isStatus={true} />
                </div>

                {/* Projects Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="px-6 md:px-8 py-5 md:py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <h2 className="text-lg md:text-xl font-bold text-white">Project History</h2>
                        <div className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                    </div>

                    {/* DESKTOP TABLE: Hidden on mobile */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-[11px] uppercase tracking-[0.2em] font-bold">
                                    <th className="px-8 py-5">Name</th>
                                    <th className="px-8 py-5">Access</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {readmes.map((readme) => (
                                    <tr key={readme._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6 font-bold text-slate-100">{readme.title}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${readme.isPublic ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>
                                                {readme.isPublic ? 'Public' : 'Private'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-400">{new Date(readme.createdAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex gap-4 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/edit/${readme._id}`} className="hover:text-purple-400"><FaEdit /></Link>
                                                <button onClick={() => handleDelete(readme._id)} className="hover:text-red-400"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE LIST VIEW: Visible only on mobile */}
                    <div className="block md:hidden divide-y divide-white/5">
                        {readmes.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">No data sequences found.</div>
                        ) : (
                            readmes.map((readme) => (
                                <div key={readme._id} className="p-5 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-100 mb-1">{readme.title}</h3>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(readme.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${readme.isPublic ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>
                                            {readme.isPublic ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/edit/${readme._id}`} className="flex-1 flex justify-center items-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-purple-400">
                                            <FaEdit size={12}/> Edit
                                        </Link>
                                        <button onClick={() => handleDelete(readme._id)} className="flex-1 flex justify-center items-center gap-2 py-3 bg-red-500/5 border border-red-500/10 rounded-xl text-xs font-bold text-red-400">
                                            <FaTrash size={12}/> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, isStatus }) => (
    <div className="relative group overflow-hidden bg-slate-900/50 backdrop-blur-md border border-white/10 p-5 md:p-6 rounded-2xl md:rounded-3xl transition-all">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl md:rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{title}</p>
                <p className={`text-xl md:text-2xl font-black mt-1 truncate ${isStatus && value !== 'Not Linked' ? 'text-green-400' : 'text-white'}`}>
                    {value}
                </p>
            </div>
        </div>
    </div>
);

export default Dashboard;