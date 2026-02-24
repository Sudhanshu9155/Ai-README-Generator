import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, Activity, ShieldAlert, ShieldCheck,
    Trash2, UserCheck, UserX, BarChart3,
    Search, LogOut, Bell, Settings,
    ArrowUpRight, Info
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LineChart, Line,
    PieChart, Pie, Cell, Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const API_BASE = 'http://localhost:5001/api/admin';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [activities, setActivities] = useState([]);
    const [suspicious, setSuspicious] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, gensToday: 0 });
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [techAnalytics, setTechAnalytics] = useState([]);
    const [systemStatus, setSystemStatus] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Login State
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
            fetchData();
        }
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [uRes, aRes, sRes, statsRes, nRes, tRes, sysRes] = await Promise.all([
                axios.get(`${API_BASE}/users`, { headers }),
                axios.get(`${API_BASE}/activities`, { headers }),
                axios.get(`${API_BASE}/suspicious`, { headers }),
                axios.get(`${API_BASE}/stats`, { headers }),
                axios.get(`${API_BASE}/notifications`, { headers }),
                axios.get(`${API_BASE}/analytics/tech-stacks`, { headers }),
                axios.get(`${API_BASE}/system/status`, { headers })
            ]);
            setUsers(uRes.data);
            setActivities(aRes.data);
            setSuspicious(sRes.data);
            setStats(statsRes.data);
            setNotifications(nRes.data);
            setTechAnalytics(tRes.data);
            setSystemStatus(sysRes.data);
        } catch (err) {
            console.error('Data fetch error:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        }
        setLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/login`, loginData);
            const newToken = res.data.token;
            setToken(newToken);
            localStorage.setItem('adminToken', newToken);
            setIsLoggedIn(true);
        } catch (err) {
            alert('Invalid Credentials');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setIsLoggedIn(false);
    };

    const togglePro = async (userId) => {
        try {
            await axios.post(`${API_BASE}/users/${userId}/toggle-pro`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Error updating user');
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`${API_BASE}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Error deleting user');
        }
    };

    const fetchUserDetails = async (userId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/users/${userId}/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedUser(res.data);
        } catch (err) {
            alert('Could not fetch user profile');
        }
        setLoading(false);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
                <div className="glass-card p-8 rounded-2xl w-full max-w-md border border-white/10 animate-glow">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(14,165,233,0.5)]">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Admin Portal
                        </h1>
                        <p className="text-gray-400 text-sm">Secure Management Dashboard</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">Username</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                                placeholder="admin"
                                value={loginData.username}
                                onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">Password</label>
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                                placeholder="••••••••"
                                value={loginData.password}
                                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                            />
                        </div>
                        <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-primary-500/20 active:scale-[0.98]">
                            Authenticate
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 glass border-r border-white/5 flex flex-col p-4 fixed h-screen z-40">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">AI README</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarLink icon={<BarChart3 size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarLink icon={<Users size={20} />} label="Users Management" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <SidebarLink icon={<Activity size={20} />} label="Activity Logs" active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
                    <SidebarLink icon={<BarChart3 size={20} />} label="System Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                    <SidebarLink icon={<ShieldAlert size={20} />} label="Suspicious" active={activeTab === 'suspicious'} onClick={() => setActiveTab('suspicious')} badge={suspicious.length} />
                </nav>

                {systemStatus && (
                    <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>System Health</span>
                            <span className="text-emerald-400">Online</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">DB State</span>
                                <span className="text-white">{systemStatus.db}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Uptime</span>
                                <span className="text-white">{Math.floor(systemStatus.uptime / 3600)}h {Math.floor((systemStatus.uptime % 3600) / 60)}m</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="bg-primary-500 h-full w-[65%]" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-white/5 mt-4">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 ml-64">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white capitalize font-display">{activeTab.replace('-', ' ')}</h2>
                        <p className="text-gray-400">System command center and insights</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64" placeholder="Search systems..." />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-3 hover:bg-white/5 rounded-2xl relative transition-all ${showNotifications ? 'bg-primary-500/10 border border-primary-500/20' : 'border border-white/5'}`}
                            >
                                <Bell size={20} className={notifications.length > 0 ? 'text-primary-400' : 'text-gray-400'} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 glass-card rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                        <h3 className="font-bold text-sm">Real-time Feed</h3>
                                        <span className="text-[10px] bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Live Monitor</span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((n, i) => (
                                                <div key={i} className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-default group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${n.action === 'REGISTER' ? 'bg-emerald-500 text-white' : 'bg-primary-600 text-white'}`}>
                                                            {n.user?.name?.[0] || 'U'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-white truncate group-hover:text-primary-400 transition-colors">
                                                                {n.user?.name || 'Unknown User'}
                                                            </p>
                                                            <p className="text-[10px] text-gray-500 font-medium">
                                                                {n.action === 'REGISTER' ? 'NEW REGISTRATION' : 'SYSTEM LOGIN'}
                                                            </p>
                                                        </div>
                                                        <span className="text-[10px] text-gray-600 font-mono">
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-12 text-center">
                                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Bell size={20} className="text-gray-600" />
                                                </div>
                                                <p className="text-gray-500 text-xs italic">All quiet on the monitor today.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-white/[0.02] text-center border-t border-white/5">
                                        <button onClick={() => { setActiveTab('activity'); setShowNotifications(false); }} className="text-[10px] font-black text-primary-500 hover:text-primary-400 uppercase tracking-[0.2em]">
                                            Full Audit Trail
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-primary-500 font-mono text-xs animate-pulse tracking-widest uppercase">Syncing Data...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-3 gap-6">
                                    <StatCard label="Total Userbase" value={stats.totalUsers} sub="Lifetime Growth" icon={<Users className="text-blue-400" />} trend="+12.5%" />
                                    <StatCard label="Premium Members" value={stats.proUsers} sub="Elite Status" icon={<UserCheck className="text-emerald-400" />} trend="+4.2%" />
                                    <StatCard label="Daily Creations" value={stats.gensToday} sub="AI Performance" icon={<Activity className="text-orange-400" />} trend="+18.1%" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="glass-card p-8 rounded-[2rem] border-white/5">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold flex items-center gap-3 text-lg">
                                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                                Generation Velocity
                                            </h3>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-500 font-bold">7D VIEW</span>
                                            </div>
                                        </div>
                                        <div className="h-72">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={[
                                                    { name: 'Mon', count: 4 }, { name: 'Tue', count: 7 }, { name: 'Wed', count: 12 },
                                                    { name: 'Thu', count: 8 }, { name: 'Fri', count: 15 }, { name: 'Sat', count: 20 }, { name: 'Sun', count: stats.gensToday }
                                                ]}>
                                                    <defs>
                                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                                    <XAxis dataKey="name" stroke="#4a5568" axisLine={false} tickLine={false} />
                                                    <YAxis stroke="#4a5568" axisLine={false} tickLine={false} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                                        itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                                                    />
                                                    <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={4} dot={{ fill: '#0ea5e9', r: 5, strokeWidth: 2, stroke: '#020617' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="glass-card p-8 rounded-[2rem] overflow-hidden border-white/5 flex flex-col">
                                        <h3 className="font-bold mb-6 text-lg">System Pulse</h3>
                                        <div className="space-y-4 flex-1">
                                            {activities.slice(0, 5).map((act, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/[0.03] group hover:bg-white/[0.05] transition-all">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors shadow-lg">
                                                        <Activity size={18} className="text-gray-400 group-hover:text-primary-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{act.action.replace('_', ' ')}</p>
                                                        <p className="text-sm font-medium text-white truncate max-w-[200px]">{act.details || 'System Operation'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-600 font-mono mb-1">{new Date(act.createdAt).toLocaleDateString()}</p>
                                                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500"><Info size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="glass-card rounded-[2rem] overflow-hidden border-white/5 shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.03] border-b border-white/5">
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Identified User</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Communication</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Access Level</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Utilization</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Overrides</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {users.map(user => (
                                            <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group cursor-pointer" onClick={() => fetchUserDetails(user._id)}>
                                                <td className="px-8 py-5 font-medium flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-black ring-2 ring-white/5 shadow-xl group-hover:scale-110 transition-transform">
                                                        {user.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{user.name}</p>
                                                        <p className="text-[10px] text-gray-600 font-mono">ID: {user._id.slice(-8)}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-gray-400 text-sm font-mono">{user.email}</td>
                                                <td className="px-8 py-5">
                                                    {user.isPro ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black border border-emerald-500/20">
                                                            <ShieldCheck size={12} /> ENTERPRISE
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black border border-blue-500/20">
                                                            SANDBOX
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold text-white">{user.freeGenerationsUsed || 0}</span>
                                                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="bg-primary-500 h-full" style={{ width: `${Math.min((user.freeGenerationsUsed / 10) * 100, 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => togglePro(user._id)}
                                                            className={`p-2.5 rounded-xl border transition-all ${user.isPro ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20 shadow-lg shadow-amber-500/5' : 'bg-primary-500/10 border-primary-500/20 text-primary-500 hover:bg-primary-500/20 shadow-lg shadow-primary-500/5'}`}
                                                            title={user.isPro ? "Revoke Access" : "Grant Access"}
                                                        >
                                                            {user.isPro ? <UserX size={18} /> : <UserCheck size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user._id)}
                                                            className="p-2.5 rounded-xl border bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all shadow-lg shadow-red-500/5"
                                                            title="Purge User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {activities.map((act, i) => (
                                    <div key={i} className="glass-card p-5 rounded-2xl flex items-center gap-5 border-white/5 hover:bg-white/[0.02] transition-all group" style={{ animationDelay: `${i * 30}ms` }}>
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-600/20 to-blue-600/20 flex items-center justify-center text-primary-500 border border-primary-500/10 group-hover:scale-110 transition-transform">
                                            <Activity size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-white text-lg">{act.user?.name || 'Automated System'}</span>
                                                <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded-md text-gray-500 font-mono">{act.user?.email || 'SYSTEM_CORE'}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <span className="text-primary-500 font-black text-xs uppercase tracking-widest">{act.action}</span>
                                                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                <span>{act.details || 'Operation processed successfully'}</span>
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <div className="text-sm font-black text-white px-2 py-1 bg-white/5 rounded-lg mb-1">{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{new Date(act.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-5 gap-8">
                                    <div className="col-span-3 glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
                                        <div className="flex flex-col gap-2 mb-10">
                                            <h3 className="font-black text-2xl text-white tracking-tight flex items-center gap-3">
                                                <BarChart3 className="text-primary-500" size={32} />
                                                Library Adoption Rate
                                            </h3>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.1em]">Most frequent dependencies in user projects</p>
                                        </div>
                                        <div className="h-[400px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={techAnalytics} layout="vertical">
                                                    <defs>
                                                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                            <stop offset="0%" stopColor="#0ea5e9" />
                                                            <stop offset="100%" stopColor="#6366f1" />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" stroke="#718096" width={110} fontSize={10} fontStyle="italic" axisLine={false} tickLine={false} />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                                    />
                                                    <Bar dataKey="value" fill="url(#barGradient)" radius={[0, 10, 10, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="col-span-2 glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl flex flex-col items-center">
                                        <h3 className="font-black text-lg text-white mb-8 self-start uppercase tracking-widest">
                                            Ecosystem Mix
                                        </h3>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                                                    <Pie
                                                        data={techAnalytics.slice(0, 5)}
                                                        innerRadius={60}
                                                        outerRadius={100}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {techAnalytics.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'][index % 5]} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                            {techAnalytics.slice(0, 4).map((tech, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899'][i] }}></div>
                                                    <span className="text-[10px] font-bold text-gray-400 truncate uppercase">{tech.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
                                        <h3 className="font-black text-lg text-white mb-8 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="text-primary-500" size={20} /> Stack Reliability
                                        </h3>
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={techAnalytics.slice(0, 6)}>
                                                    <PolarGrid stroke="#ffffff10" />
                                                    <PolarAngleAxis dataKey="name" tick={{ fill: '#718096', fontSize: 10 }} />
                                                    <Radar name="Usage" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl flex flex-col justify-center">
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-4">Market Trend Insight</p>
                                                <h4 className="text-3xl font-black text-white leading-tight">
                                                    The platform is seeing a 45% surge in <span className="text-primary-400">@clerk</span> and <span className="text-purple-400">@radix-ui</span> integrations this week.
                                                </h4>
                                            </div>
                                            <div className="pt-8 border-t border-white/5 flex gap-10">
                                                <div>
                                                    <p className="text-sm font-black text-white">4.2s</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Avg Gen Time</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">128</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tech Nodes</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">99.9%</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AI Accuracy</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'suspicious' && (
                            <div className="space-y-8 max-w-5xl mx-auto">
                                <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-[2.5rem] flex items-center gap-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="p-5 bg-red-500 rounded-[1.5rem] shadow-[0_0_30px_rgba(239,68,68,0.5)] z-10">
                                        <ShieldAlert className="text-white" size={40} />
                                    </div>
                                    <div className="z-10">
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">Threat Mitigation Center</h3>
                                        <p className="text-red-400 text-sm font-medium leading-relaxed max-w-xl">Intelligent pattern recognition has flagged the following entities for irregular interaction patterns. Immediate audit is recommended.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {suspicious.map((s, i) => (
                                        <div key={i} className="glass-card p-8 rounded-[2rem] border-l-[6px] border-red-600 hover:bg-gradient-to-r hover:from-red-500/5 hover:to-transparent transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${s.overallSeverity === 'critical' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'}`}>
                                                        <UserX size={28} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-xl text-white">{s.user.name}</h4>
                                                        <p className="text-xs text-gray-500 font-mono italic">{s.user.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg ${s.overallSeverity === 'critical' ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-600 text-white'}`}>
                                                    {s.overallSeverity}
                                                </span>
                                            </div>
                                            <div className="space-y-4 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                                <div className="space-y-3">
                                                    {s.triggers.map((t, ti) => (
                                                        <div key={ti} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-500 font-bold uppercase text-[8px] tracking-[0.2em]">{t.severity} RISK</span>
                                                                <span className="text-white font-black text-xs">{t.reason}</span>
                                                            </div>
                                                            <span className={`font-black ${t.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`}>{t.count}x</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-4 flex gap-3">
                                                    <button onClick={() => togglePro(s.user._id)} className="flex-1 bg-white/[0.05] hover:bg-white/10 text-white text-[10px] font-black py-4 rounded-xl transition-all uppercase tracking-widest border border-white/5">
                                                        Restrict
                                                    </button>
                                                    <button onClick={() => fetchUserDetails(s.user._id)} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-red-600/20">
                                                        Investigate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {suspicious.length === 0 && (
                                        <div className="col-span-2 glass-card p-20 text-center rounded-[3rem] border-white/5">
                                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <ShieldCheck className="text-emerald-500" size={40} />
                                            </div>
                                            <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Secure Perimeter</h4>
                                            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">No anomalous behavior detected within the last monitoring cycle. All system nodes optimal.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
                    <div className="glass-card w-full max-w-6xl max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/10 relative">
                        <div className="p-12 bg-gradient-to-br from-primary-600/20 to-transparent border-b border-white/5 flex justify-between items-start">
                            <div className="flex items-center gap-10">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-blue-700 flex items-center justify-center text-5xl font-black text-white shadow-[0_20px_40px_rgba(14,165,233,0.4)] ring-4 ring-white/10">
                                    {selectedUser.user.name[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <h2 className="text-6xl font-black text-white tracking-tighter">{selectedUser.user.name}</h2>
                                        <span className={`px-4 py-1 rounded-xl text-[10px] font-black tracking-widest border ${selectedUser.user.isPro ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                            {selectedUser.user.isPro ? 'PREMIUM NODE' : 'STANDARD CLIENT'}
                                        </span>
                                    </div>
                                    <div className="flex gap-6">
                                        <span className="flex items-center gap-2 text-md text-gray-500 font-mono bg-white/5 px-4 py-2 rounded-2xl border border-white/5">{selectedUser.user.email}</span>
                                        <span className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest px-4 py-2">Account ID: {selectedUser.user._id}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group shadow-lg">
                                <LogOut size={32} className="rotate-90 text-gray-400 group-hover:text-white" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 grid grid-cols-4 gap-12">
                            <div className="col-span-3 space-y-12">
                                <div>
                                    <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tighter">
                                        <Activity className="text-primary-500" size={28} /> Deployment Registry
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {selectedUser.readmes.map((r, i) => (
                                            <div key={i} className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/[0.05] hover:border-primary-500/40 transition-all group scale-in animate-in">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-black text-xl text-white group-hover:text-primary-500 transition-colors uppercase truncate max-w-[200px]">{r.title}</h4>
                                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-600 font-mono">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {r.techStack.map((t, ti) => (
                                                        <span key={ti} className="text-[10px] font-black bg-primary-500/10 text-primary-400 px-3 py-1 rounded-lg border border-primary-500/20">{t}</span>
                                                    ))}
                                                    {r.techStack.length === 0 && <span className="text-[10px] italic text-gray-600">No tech data</span>}
                                                </div>
                                            </div>
                                        ))}
                                        {selectedUser.readmes.length === 0 && (
                                            <div className="col-span-2 p-20 glass-card rounded-[2.5rem] text-center border-dashed border-white/10">
                                                <p className="text-gray-600 font-bold italic">Zero deployments found for this node.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-2xl font-black flex items-center gap-4 text-white uppercase tracking-tighter">
                                            <Search className="text-primary-500" size={28} /> Activity Fingerprint
                                        </h3>
                                        <span className="text-[10px] font-black text-gray-600">SHOWING LAST 20 OPERATIONS</span>
                                    </div>
                                    <div className="space-y-4">
                                        {selectedUser.activity.map((a, i) => (
                                            <div key={i} className="flex items-center gap-6 text-sm p-5 bg-white/[0.015] rounded-3xl border border-white/[0.03] hover:bg-white/[0.04] transition-all">
                                                <span className="font-mono text-[10px] text-gray-600 px-3 py-1 bg-white/5 rounded-lg">{new Date(a.createdAt).toLocaleString()}</span>
                                                <span className="text-white font-black flex-1 tracking-widest uppercase text-xs">{a.action.replace('_', ' ')}</span>
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Verified</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-white/[0.02]">
                                    <h3 className="font-black mb-8 text-xs uppercase tracking-[0.2em] text-gray-500">Technology Profile</h3>
                                    <div className="space-y-6">
                                        {selectedUser.techProfile.map(([name, count], i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-sm font-black text-white">{name}</span>
                                                    <span className="text-[10px] font-black text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-md">{count} DEPLOYMENTS</span>
                                                </div>
                                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                                    <div className="bg-gradient-to-r from-primary-600 to-blue-500 h-full rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]" style={{ width: `${(count / selectedUser.readmes.length) * 100}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                        {selectedUser.techProfile.length === 0 && <p className="text-gray-700 font-bold italic text-center py-10">Insufficient genetic data.</p>}
                                    </div>
                                </div>
                                <div className="p-10 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-1000"></div>
                                    <h4 className="font-black text-white text-xl mb-2 relative z-10">Client Health Index</h4>
                                    <p className="text-primary-100/60 text-[10px] font-bold uppercase tracking-widest mb-8 relative z-10">Algorithmic Satisfaction Score</p>
                                    <div className="text-8xl font-black text-white drop-shadow-2xl relative z-10">94</div>
                                    <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Sentiment</span>
                                            <span className="text-emerald-300 font-black px-3 py-1 bg-white/10 rounded-xl text-xs">POSITIVE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 border border-white/5 rounded-[2.5rem] bg-white/[0.01] text-center">
                                    <button onClick={() => deleteUser(selectedUser.user._id)} className="w-full py-4 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500/10 rounded-2xl transition-all">
                                        TERMINATE SESSION
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarLink = ({ icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${active
            ? 'bg-primary-600/10 text-primary-400 shadow-[inset_0_0_20px_rgba(14,165,233,0.05)] border border-primary-500/10'
            : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'
            }`}
    >
        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-500 rounded-r-full shadow-[0_0_15px_rgba(14,165,233,1)]" />}
        <span className={`${active ? 'scale-125 text-primary-500' : 'group-hover:text-primary-400'} transition-all`}>{icon}</span>
        <span className={`flex-1 text-left font-bold text-sm tracking-wide ${active ? 'text-white' : ''}`}>{label}</span>
        {badge > 0 && (
            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg shadow-red-600/20 translate-x-2">
                {badge}
            </span>
        )}
    </button>
);

const StatCard = ({ label, value, icon, trend, sub }) => (
    <div className="glass-card p-10 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 cursor-default relative overflow-hidden group border-white/5 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full -translate-y-24 translate-x-24 group-hover:scale-150 transition-transform duration-1000" />
        <div className="flex justify-between items-start mb-8 relative">
            <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner">
                {icon}
            </div>
            <div className="flex flex-col items-end">
                <span className="text-emerald-400 text-xs font-black flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                    <ArrowUpRight size={14} /> {trend}
                </span>
            </div>
        </div>
        <div className="relative">
            <h3 className="text-6xl font-black text-white mb-3 tracking-tighter drop-shadow-2xl">{value}</h3>
            <p className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">{label}</p>
            <p className="text-[10px] text-gray-700 mt-4 font-bold border-t border-white/5 pt-4 group-hover:text-primary-500 transition-colors uppercase italic">{sub}</p>
        </div>
    </div>
);

export default App;
