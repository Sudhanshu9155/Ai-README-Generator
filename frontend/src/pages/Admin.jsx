import React, { useState, useEffect, Component } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from '../config/api';
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

// ── Chart Error Boundary ──────────────────────────────────────
// Catches ANY recharts crash (d.slice().map, invalid domain, etc.)
// and renders a graceful fallback instead of breaking the page.
class ChartErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(err) {
        console.warn('[ChartErrorBoundary] recharts crash caught:', err.message);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">
                    Chart unavailable — data may still be loading.
                </div>
            );
        }
        return this.props.children;
    }
}

// ── Sanitise chart data ───────────────────────────────────────
// Ensures every item in the array has a numeric value for the
// given key so recharts domain computation never sees undefined.
const safeChartData = (data, valueKey = 'value') => {
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
        ...item,
        [valueKey]: typeof item[valueKey] === 'number' ? item[valueKey] : 0,
    }));
};

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');
const API_BASE = trimTrailingSlash(
    import.meta.env.VITE_ADMIN_API_URL || `${getApiBaseUrl()}/admin`
);
const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isInitialising, setIsInitialising] = useState(!!localStorage.getItem('adminToken'));
    const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
    const [fetchError, setFetchError] = useState(null);
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
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    // On mount: if a stored token exists, validate it by calling fetchData.
    // Pass the token directly to avoid the stale-closure race condition.
    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        if (storedToken) {
            fetchData(storedToken);
        } else {
            setIsInitialising(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // fetchData — uses Promise.allSettled so ONE failing endpoint cannot kill all data.
    // Each API result is checked individually; partial failures show an error banner
    // but still populate all successfully fetched sections.
    const fetchData = async (authToken) => {
        const t = authToken || token;
        if (!t) return;
        setLoading(true);
        setFetchError(null);
        try {
            const headers = { Authorization: `Bearer ${t}` };

            const [uRes, aRes, sRes, statsRes, nRes, tRes, sysRes] = await Promise.allSettled([
                axios.get(`${API_BASE}/users`, { headers }),
                axios.get(`${API_BASE}/activities`, { headers }),
                axios.get(`${API_BASE}/suspicious`, { headers }),
                axios.get(`${API_BASE}/stats`, { headers }),
                axios.get(`${API_BASE}/notifications`, { headers }),
                axios.get(`${API_BASE}/analytics/tech-stacks`, { headers }),
                axios.get(`${API_BASE}/system/status`, { headers })
            ]);

            // Helper: safely get data from a settled result
            const ok = (r, fallback) => r.status === 'fulfilled' ? r.value.data : fallback;

            // Check if the AUTH endpoints (users/stats) failed with 401/403
            const authFailed = [uRes, statsRes].some(r =>
                r.status === 'rejected' &&
                (r.reason?.response?.status === 401 || r.reason?.response?.status === 403)
            );
            if (authFailed) { handleLogout(); return; }

            // Populate every section with whatever data arrived
            setUsers(Array.isArray(ok(uRes, [])) ? ok(uRes, []) : []);
            setActivities(Array.isArray(ok(aRes, [])) ? ok(aRes, []) : []);
            setSuspicious(Array.isArray(ok(sRes, [])) ? ok(sRes, []) : []);
            setStats(ok(statsRes, { totalUsers: 0, proUsers: 0, gensToday: 0, totalReadmes: 0 }));
            setNotifications(Array.isArray(ok(nRes, [])) ? ok(nRes, []) : []);
            setTechAnalytics(Array.isArray(ok(tRes, [])) ? ok(tRes, []) : []);
            setSystemStatus(ok(sysRes, null));

            // Collect any non-auth errors for the banner
            const failures = [uRes, aRes, sRes, statsRes, nRes, tRes, sysRes]
                .filter(r => r.status === 'rejected')
                .map(r => r.reason?.response?.data?.message || r.reason?.message || 'Unknown');
            if (failures.length > 0) {
                console.warn('Admin: some endpoints failed:', failures);
                setFetchError(`${failures.length} endpoint(s) failed: ${failures.join(' | ')}`);
            }

            setToken(t);
            setIsLoggedIn(true);
        } catch (err) {
            // Only reaches here for unexpected JS errors (not HTTP errors)
            console.error('Admin fetchData unexpected error:', err);
            setFetchError(`Unexpected error: ${err.message}`);
            setIsLoggedIn(true);
            setToken(t);
        } finally {
            setLoading(false);
            setIsInitialising(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/login`, loginData);
            const newToken = res.data.token;
            setToken(newToken);
            localStorage.setItem('adminToken', newToken);
            await fetchData(newToken);
        } catch (err) {
            alert('Invalid Admin Credentials');
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
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        try {
            await axios.delete(`${API_BASE}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedUser(null);
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

    // ── INITIALISING (validating stored token) ─────────────────
    if (isInitialising) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] gap-4">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sky-400 text-xs font-black uppercase tracking-[0.3em]">Authenticating…</p>
            </div>
        );
    }

    // ── LOGIN SCREEN ──────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
                <div
                    className="p-8 rounded-2xl w-full max-w-md border border-white/10"
                    style={{
                        background: 'rgba(30,41,59,0.7)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 0 15px rgba(14,165,233,0.4)'
                    }}
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(14,165,233,0.5)]">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                        <p className="text-gray-400 text-sm mt-1">Secure Management Dashboard</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">
                                Username
                            </label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                placeholder="admin"
                                value={loginData.username}
                                onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                placeholder="••••••••"
                                value={loginData.password}
                                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]"
                        >
                            Authenticate
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── DASHBOARD ─────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#020617] text-gray-100 flex">

            {/* ── Sidebar ── */}
            <div
                className="w-64 flex flex-col p-4 fixed h-screen z-40 border-r border-white/5"
                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
            >
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">AI README</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarLink icon={<BarChart3 size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarLink icon={<Users size={20} />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <SidebarLink icon={<Activity size={20} />} label="Activity Logs" active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
                    <SidebarLink icon={<BarChart3 size={20} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
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
                                <span className="text-white">
                                    {Math.floor(Number(systemStatus.uptime) / 3600)}h{' '}
                                    {Math.floor((Number(systemStatus.uptime) % 3600) / 60)}m
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Collections</span>
                                <span className="text-white">{systemStatus.collections ?? '—'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Memory</span>
                                <span className="text-white">{systemStatus.memory ? `${Math.round(systemStatus.memory)}MB` : '—'}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-white/5 mt-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto p-8 ml-64">

                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white capitalize">
                            {activeTab.replace('-', ' ')}
                        </h2>
                        <p className="text-gray-400">System command center and insights</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
                                placeholder="Search systems..."
                            />
                        </div>
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-3 hover:bg-white/5 rounded-2xl relative transition-all border ${showNotifications ? 'bg-sky-500/10 border-sky-500/20' : 'border-white/5'}`}
                            >
                                <Bell size={20} className={notifications.length > 0 ? 'text-sky-400' : 'text-gray-400'} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </button>
                            {showNotifications && (
                                <div
                                    className="absolute right-0 mt-3 w-80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 border border-white/10 overflow-hidden"
                                    style={{ background: 'rgba(30,41,59,0.9)', backdropFilter: 'blur(12px)' }}
                                >
                                    <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                        <h3 className="font-bold text-sm">Real-time Feed</h3>
                                        <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-bold uppercase">Live</span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? notifications.map((n, i) => (
                                            <div key={i} className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${n.action === 'REGISTER' ? 'bg-emerald-500' : 'bg-sky-600'} text-white`}>
                                                        {n.user?.name?.[0] || 'U'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-white truncate">{n.user?.name || 'Unknown'}</p>
                                                        <p className="text-[10px] text-gray-500">{n.action === 'REGISTER' ? 'NEW REGISTRATION' : 'SYSTEM LOGIN'}</p>
                                                    </div>
                                                    <span className="text-[10px] text-gray-600 font-mono">
                                                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-12 text-center">
                                                <Bell size={20} className="text-gray-600 mx-auto mb-3" />
                                                <p className="text-gray-500 text-xs italic">All quiet today.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-white/[0.02] text-center border-t border-white/5">
                                        <button
                                            onClick={() => { setActiveTab('activity'); setShowNotifications(false); }}
                                            className="text-[10px] font-black text-sky-500 hover:text-sky-400 uppercase tracking-[0.2em]"
                                        >
                                            Full Audit Trail
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="text-sky-500 font-mono text-xs animate-pulse tracking-widest uppercase">Syncing Data…</p>
                    </div>
                ) : (
                    <div>
                        {/* ── Error Banner ── */}
                        {fetchError && (
                            <div className="mb-6 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert size={20} className="text-red-400 shrink-0" />
                                    <div>
                                        <p className="text-red-400 text-xs font-black uppercase tracking-widest mb-0.5">Data Load Failed</p>
                                        <p className="text-red-300/70 text-[11px] font-mono">{fetchError}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => fetchData()}
                                    className="shrink-0 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/20"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* ── DASHBOARD TAB ── */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <AdminStatCard label="Total Users" value={stats?.totalUsers ?? 0} sub="Lifetime Growth" icon={<Users className="text-blue-400" />} trend="+12.5%" />
                                    <AdminStatCard label="Premium Members" value={stats?.proUsers ?? 0} sub="Elite Status" icon={<UserCheck className="text-emerald-400" />} trend="+4.2%" />
                                    <AdminStatCard label="Daily Creations" value={stats?.gensToday ?? 0} sub="AI Performance" icon={<Activity className="text-orange-400" />} trend="+18.1%" />
                                    <AdminStatCard label="Total READMEs" value={stats?.totalReadmes ?? 0} sub="All Time" icon={<BarChart3 className="text-purple-400" />} trend="+9.8%" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Generation Velocity Line Chart */}
                                    <div className="p-8 rounded-[2rem] border border-white/5" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold flex items-center gap-3 text-lg">
                                                <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                                                Generation Velocity
                                            </h3>
                                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-500 font-bold">7D VIEW</span>
                                        </div>
                                        <div className="h-64">
                                            <ChartErrorBoundary>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={safeChartData([
                                                        { name: 'Mon', count: 4 }, { name: 'Tue', count: 7 }, { name: 'Wed', count: 12 },
                                                        { name: 'Thu', count: 8 }, { name: 'Fri', count: 15 }, { name: 'Sat', count: 20 },
                                                        { name: 'Sun', count: Number(stats?.gensToday) || 0 }
                                                    ], 'count')}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                                        <XAxis dataKey="name" stroke="#4a5568" axisLine={false} tickLine={false} />
                                                        <YAxis stroke="#4a5568" axisLine={false} tickLine={false} allowDecimals={false} domain={[0, 'dataMax + 1']} />
                                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} itemStyle={{ color: '#0ea5e9' }} />
                                                        <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={4} dot={{ fill: '#0ea5e9', r: 5, strokeWidth: 2, stroke: '#020617' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </ChartErrorBoundary>
                                        </div>
                                    </div>

                                    {/* System Pulse */}
                                    <div className="p-8 rounded-[2rem] border border-white/5 flex flex-col" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                        <h3 className="font-bold mb-6 text-lg">System Pulse</h3>
                                        <div className="space-y-4 flex-1">
                                            {activities.slice(0, 5).map((act, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/[0.03] hover:bg-white/[0.05] transition-all">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center border border-white/10">
                                                        <Activity size={18} className="text-gray-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{act.action.replace('_', ' ')}</p>
                                                        <p className="text-sm font-medium text-white truncate max-w-[200px]">{act.details || 'System Operation'}</p>
                                                    </div>
                                                    <p className="text-[10px] text-gray-600 font-mono">{new Date(act.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── USERS TAB ── */}
                        {activeTab === 'users' && (
                            <div className="rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/[0.03] border-b border-white/5">
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">User</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Email</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Access Level</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Utilization</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {users.map(user => (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-white/[0.01] transition-colors cursor-pointer"
                                                onClick={() => fetchUserDetails(user._id)}
                                            >
                                                <td className="px-8 py-5 font-medium">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-black">
                                                            {user.name?.[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{user.name}</p>
                                                            <p className="text-[10px] text-gray-600 font-mono">ID: {user._id.slice(-8)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-gray-400 text-sm font-mono">{user.email}</td>
                                                <td className="px-8 py-5">
                                                    {user.isPro ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black border border-emerald-500/20">
                                                            <ShieldCheck size={12} /> PRO
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black border border-blue-500/20">
                                                            FREE
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold text-white">{user.freeGenerationsUsed || 0}</span>
                                                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="bg-sky-500 h-full" style={{ width: `${Math.min((user.freeGenerationsUsed / 10) * 100, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-3" onClick={e => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => togglePro(user._id)}
                                                            className={`p-2.5 rounded-xl border transition-all ${user.isPro ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20' : 'bg-sky-500/10 border-sky-500/20 text-sky-500 hover:bg-sky-500/20'}`}
                                                            title={user.isPro ? 'Revoke Pro' : 'Grant Pro'}
                                                        >
                                                            {user.isPro ? <UserX size={18} /> : <UserCheck size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user._id)}
                                                            className="p-2.5 rounded-xl border bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
                                                            title="Delete User"
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

                        {/* ── ACTIVITY TAB ── */}
                        {activeTab === 'activity' && (
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {activities.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Activity size={28} className="text-gray-600" />
                                        </div>
                                        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">No Activity Logs Yet</p>
                                        <p className="text-gray-700 text-[11px]">Activity will appear here as users generate READMEs, login, or register.</p>
                                    </div>
                                ) : activities.map((act, i) => (
                                    <div key={i} className="p-5 rounded-2xl flex items-center gap-5 border border-white/5 hover:bg-white/[0.02] transition-all" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                        <div className="h-12 w-12 rounded-2xl bg-sky-600/20 flex items-center justify-center text-sky-500 border border-sky-500/10">
                                            <Activity size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-white">{act.user?.name || 'System'}</span>
                                                <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded-md text-gray-500 font-mono">{act.user?.email || 'SYSTEM'}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <span className="text-sky-500 font-black text-xs uppercase tracking-widest">{act.action}</span>
                                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                                <span>{act.details || 'Operation processed'}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-white px-2 py-1 bg-white/5 rounded-lg mb-1">
                                                {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-bold uppercase">
                                                {new Date(act.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── ANALYTICS TAB ── */}
                        {activeTab === 'analytics' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-5 gap-8">
                                    {/* Bar Chart */}
                                    <div className="col-span-3 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                        <h3 className="font-black text-2xl text-white tracking-tight flex items-center gap-3 mb-2">
                                            <BarChart3 className="text-sky-500" size={32} />
                                            Library Adoption Rate
                                        </h3>
                                        <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.1em] mb-10">Most frequent dependencies</p>
                                        <div className="h-[400px]">
                                            <ChartErrorBoundary>
                                                {safeChartData(techAnalytics).length > 0 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={safeChartData(techAnalytics)} layout="vertical">
                                                            <defs>
                                                                <linearGradient id="adminBarGradient" x1="0" y1="0" x2="1" y2="0">
                                                                    <stop offset="0%" stopColor="#0ea5e9" />
                                                                    <stop offset="100%" stopColor="#6366f1" />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                                                            <XAxis type="number" hide domain={[0, 'dataMax + 1']} />
                                                            <YAxis dataKey="name" type="category" stroke="#718096" width={110} fontSize={10} axisLine={false} tickLine={false} />
                                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                                                            <Bar dataKey="value" fill="url(#adminBarGradient)" radius={[0, 10, 10, 0]} barSize={20} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                                                        No tech stack data yet — generate some READMEs first.
                                                    </div>
                                                )}
                                            </ChartErrorBoundary>
                                        </div>
                                    </div>

                                    {/* Pie Chart */}
                                    <div className="col-span-2 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                        <h3 className="font-black text-lg text-white mb-8 self-start uppercase tracking-widest">Ecosystem Mix</h3>
                                        <div className="h-[300px] w-full">
                                            <ChartErrorBoundary>
                                                {safeChartData(techAnalytics).length > 0 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                                                            <Pie data={safeChartData(techAnalytics).slice(0, 5)} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                                                {safeChartData(techAnalytics).slice(0, 5).map((_, index) => (
                                                                    <Cell key={`cell-${index}`} fill={['#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'][index % 5]} />
                                                                ))}
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">No data</div>
                                                )}
                                            </ChartErrorBoundary>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 w-full mt-4">
                                            {safeChartData(techAnalytics).slice(0, 4).map((tech, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899'][i] }} />
                                                    <span className="text-[10px] font-bold text-gray-400 truncate uppercase">{tech.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    {/* Radar Chart */}
                                    <div className="p-10 rounded-[2.5rem] border border-white/5 shadow-2xl" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                        <h3 className="font-black text-lg text-white mb-8 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="text-sky-500" size={20} /> Stack Reliability
                                        </h3>
                                        <div className="h-[300px]">
                                            <ChartErrorBoundary>
                                                {safeChartData(techAnalytics).length >= 3 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius={80} data={safeChartData(techAnalytics).slice(0, 6)}>
                                                            <PolarGrid stroke="#ffffff10" />
                                                            <PolarAngleAxis dataKey="name" tick={{ fill: '#718096', fontSize: 10 }} />
                                                            <PolarRadiusAxis tick={false} axisLine={false} />
                                                            <Radar name="Usage" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                                                        Need at least 3 tech stacks to display radar chart.
                                                    </div>
                                                )}
                                            </ChartErrorBoundary>
                                        </div>
                                    </div>

                                    {/* Market Trend Insight */}
                                    <div className="p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col justify-center" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em] mb-4">Market Trend Insight</p>
                                                <h4 className="text-3xl font-black text-white leading-tight">
                                                    Surge in <span className="text-sky-400">@clerk</span> and{' '}
                                                    <span className="text-purple-400">@radix-ui</span> integrations this week.
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

                        {/* ── SUSPICIOUS TAB ── */}
                        {activeTab === 'suspicious' && (
                            <div className="space-y-8 max-w-5xl mx-auto">
                                <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-[2.5rem] flex items-center gap-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="p-5 bg-red-500 rounded-[1.5rem] shadow-[0_0_30px_rgba(239,68,68,0.5)] z-10">
                                        <ShieldAlert className="text-white" size={40} />
                                    </div>
                                    <div className="z-10">
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">Threat Mitigation Center</h3>
                                        <p className="text-red-400 text-sm font-medium max-w-xl">
                                            Intelligent pattern recognition flagged the following entities for irregular interaction patterns.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {suspicious.map((s, i) => (
                                        <div key={i} className="p-8 rounded-[2rem] border-l-[6px] border-red-600 hover:bg-red-500/5 transition-all" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.overallSeverity === 'critical' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'}`}>
                                                        <UserX size={28} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-xl text-white">{s.user.name}</h4>
                                                        <p className="text-xs text-gray-500 font-mono">{s.user.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${s.overallSeverity === 'critical' ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-600 text-white'}`}>
                                                    {s.overallSeverity}
                                                </span>
                                            </div>
                                            <div className="space-y-4 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                                {s.triggers.map((t, ti) => (
                                                    <div key={ti} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 font-bold uppercase text-[8px] tracking-[0.2em]">{t.severity} RISK</span>
                                                            <span className="text-white font-black text-xs">{t.reason}</span>
                                                        </div>
                                                        <span className={`font-black ${t.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`}>{t.count}x</span>
                                                    </div>
                                                ))}
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
                                        <div className="col-span-2 p-20 text-center rounded-[3rem] border border-white/5" style={{ background: 'rgba(30,41,59,0.7)' }}>
                                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <ShieldCheck className="text-emerald-500" size={40} />
                                            </div>
                                            <h4 className="text-xl font-black text-white mb-2 uppercase">Secure Perimeter</h4>
                                            <p className="text-gray-500 text-sm max-w-sm mx-auto">No anomalous behaviour detected. All system nodes are optimal.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </main>

            {/* ── User Detail Modal ── */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-2xl">
                    <div
                        className="w-full max-w-6xl max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10"
                        style={{ background: 'rgba(30,41,59,0.95)', backdropFilter: 'blur(20px)' }}
                    >
                        <div className="p-12 bg-gradient-to-br from-sky-600/20 to-transparent border-b border-white/5 flex justify-between items-start">
                            <div className="flex items-center gap-10">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-4xl font-black text-white shadow-[0_20px_40px_rgba(14,165,233,0.4)]">
                                    {selectedUser.user.name[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <h2 className="text-4xl font-black text-white tracking-tighter">{selectedUser.user.name}</h2>
                                        <span className={`px-4 py-1 rounded-xl text-[10px] font-black tracking-widest border ${selectedUser.user.isPro ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                            {selectedUser.user.isPro ? 'PRO' : 'FREE'}
                                        </span>
                                    </div>
                                    <span className="text-gray-500 font-mono text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">{selectedUser.user.email}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10">
                                <LogOut size={24} className="rotate-90 text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 grid grid-cols-4 gap-12">
                            <div className="col-span-3 space-y-12">
                                {/* README list */}
                                <div>
                                    <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tighter">
                                        <Activity className="text-sky-500" size={28} /> Deployment Registry
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {selectedUser.readmes.map((r, i) => (
                                            <div key={i} className="p-8 bg-white/[0.03] rounded-[2rem] border border-white/[0.05] hover:border-sky-500/40 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-black text-lg text-white uppercase truncate max-w-[180px]">{r.title}</h4>
                                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-600 font-mono">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {r.techStack.map((t, ti) => (
                                                        <span key={ti} className="text-[10px] font-black bg-sky-500/10 text-sky-400 px-3 py-1 rounded-lg border border-sky-500/20">{t}</span>
                                                    ))}
                                                    {r.techStack.length === 0 && <span className="text-[10px] italic text-gray-600">No tech data</span>}
                                                </div>
                                            </div>
                                        ))}
                                        {selectedUser.readmes.length === 0 && (
                                            <div className="col-span-2 p-16 text-center border border-dashed border-white/10 rounded-[2rem]">
                                                <p className="text-gray-600 font-bold italic">No deployments found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Activity */}
                                <div>
                                    <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tighter">
                                        <Search className="text-sky-500" size={28} /> Activity Fingerprint
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedUser.activity.map((a, i) => (
                                            <div key={i} className="flex items-center gap-6 text-sm p-4 bg-white/[0.015] rounded-2xl border border-white/[0.03] hover:bg-white/[0.04] transition-all">
                                                <span className="font-mono text-[10px] text-gray-600 px-3 py-1 bg-white/5 rounded-lg">{new Date(a.createdAt).toLocaleString()}</span>
                                                <span className="text-white font-black flex-1 tracking-widest uppercase text-xs">{a.action.replace('_', ' ')}</span>
                                                <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Verified</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar panel */}
                            <div className="space-y-8">
                                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
                                    <h3 className="font-black mb-6 text-xs uppercase tracking-[0.2em] text-gray-500">Technology Profile</h3>
                                    <div className="space-y-5">
                                        {selectedUser.techProfile.map(([name, count], i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-sm font-black text-white">{name}</span>
                                                    <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-md">{count}x</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="bg-gradient-to-r from-sky-600 to-blue-500 h-full rounded-full" style={{ width: `${(count / selectedUser.readmes.length) * 100}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                        {selectedUser.techProfile.length === 0 && <p className="text-gray-700 italic text-center py-8">No data.</p>}
                                    </div>
                                </div>

                                <div className="p-8 border border-white/5 rounded-[2rem] bg-white/[0.01] text-center">
                                    <button onClick={() => deleteUser(selectedUser.user._id)} className="w-full py-4 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500/10 rounded-2xl transition-all">
                                        DELETE USER
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

// ── Helper Components ─────────────────────────────────────────

const SidebarLink = ({ icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${active
            ? 'bg-sky-600/10 text-sky-400 border border-sky-500/10'
            : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'
            }`}
    >
        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-sky-500 rounded-r-full shadow-[0_0_15px_rgba(14,165,233,1)]" />}
        <span className={`${active ? 'scale-125 text-sky-500' : 'group-hover:text-sky-400'} transition-all`}>{icon}</span>
        <span className={`flex-1 text-left font-bold text-sm tracking-wide ${active ? 'text-white' : ''}`}>{label}</span>
        {badge > 0 && (
            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg shadow-red-600/20">
                {badge}
            </span>
        )}
    </button>
);

const AdminStatCard = ({ label, value, icon, trend, sub }) => (
    <div className="p-8 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 cursor-default relative overflow-hidden border border-white/5" style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full -translate-y-24 translate-x-24" />
        <div className="flex justify-between items-start mb-6 relative">
            <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                {icon}
            </div>
            <span className="text-emerald-400 text-xs font-black flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                <ArrowUpRight size={14} /> {trend}
            </span>
        </div>
        <div className="relative">
            <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">{value}</h3>
            <p className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">{label}</p>
            <p className="text-[10px] text-gray-700 mt-3 font-bold border-t border-white/5 pt-3 uppercase italic">{sub}</p>
        </div>
    </div>
);

export default Admin;
