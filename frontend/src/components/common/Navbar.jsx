import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaUserCircle, FaSignOutAlt, FaDatabase, FaHistory,
    FaPlus, FaCog, FaBars, FaTimes, FaChartLine, FaCrown
} from 'react-icons/fa';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isProUser = user?.isPro === true;
    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-500/5">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo & Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    ✨
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black tracking-tighter text-white">
                                    AI <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">README</span>
                                </span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em] -mt-1">Neural Generator</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-1 bg-white/5 ml-40 p-1.5 rounded-2xl border border-white/5">
                            <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<FaDatabase size={12} />} label="Dashboard" />
                            <NavLink to="/create" active={isActive('/create')} icon={<FaPlus size={12} />} label="Create" />
                            <NavLink to="/history" active={isActive('/history')} icon={<FaHistory size={12} />} label="History" />
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {isAuthenticated ? (
                            <>
                                {/* User Info */}
                                <div className="hidden sm:flex items-center gap-3 pr-2">
                                    <span className="text-sm font-bold text-slate-200">{user?.name}</span>
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 p-[1px]">
                                        <div className="w-full h-full bg-[#030712] rounded-xl flex items-center justify-center overflow-hidden">
                                            {user?.avatar || user?.photo ? (
                                                <img src={user.avatar || user.photo} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white font-black text-xs">{user?.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Settings (Desktop) */}
                                <Link
                                    to="/settings"
                                    className={`p-2.5 rounded-xl transition-all active:scale-95 group border hidden md:block ${isActive('/settings')
                                            ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                                        }`}
                                    title="Settings"
                                >
                                    <FaCog className={`transition-transform duration-500 ${isActive('/settings') ? 'animate-spin-slow' : 'group-hover:rotate-90'}`} />
                                </Link>

                                {/* Logout (Desktop) */}
                                {/* <button 
                                    onClick={logout}
                                    className="hidden md:flex p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all"
                                    title="Sign Out"
                                >
                                    <FaSignOutAlt />
                                </button> */}

                                {/* Mobile Toggle */}
                                <button
                                    onClick={toggleMenu}
                                    className="md:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white active:scale-95 transition-all"
                                >
                                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="px-5 py-2 text-slate-400 font-bold text-xs uppercase hover:text-white">Log In</Link>
                                <Link to="/register" className="bg-indigo-600 px-6 py-2.5 rounded-xl font-black text-xs text-white uppercase shadow-lg shadow-indigo-500/20">Initialize</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#030712]/95 backdrop-blur-2xl border-b border-white/10 ${isMenuOpen ? 'max-h-[600px] py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
                }`}>
                <div className="flex flex-col px-4 gap-2">
                    <MobileNavLink to="/dashboard" onClick={toggleMenu} icon={<FaDatabase />} label="Dashboard" active={isActive('/dashboard')} />
                    <MobileNavLink to="/create" onClick={toggleMenu} icon={<FaPlus />} label="Create" active={isActive('/create')} />
                    <MobileNavLink to="/history" onClick={toggleMenu} icon={<FaHistory />} label="History" active={isActive('/history')} />
                    <MobileNavLink to="/analytics" onClick={toggleMenu} icon={<FaChartLine />} label="Analytics" active={isActive('/analytics')} />

                    {!isProUser && (
                        <MobileNavLink to="/upgrade" onClick={toggleMenu} icon={<FaCrown className="text-amber-400" />} label="Upgrade to Pro" active={isActive('/upgrade')} />
                    )}

                    <MobileNavLink to="/settings" onClick={toggleMenu} icon={<FaCog />} label="Settings" active={isActive('/settings')} />

                    {/* <button 
                        onClick={() => { logout(); toggleMenu(); }}
                        className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 mt-2"
                    >
                        <FaSignOutAlt />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Terminate Session</span>
                    </button> */}

                    <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link</span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${isProUser ? 'text-amber-400 border-amber-500/20' : 'text-slate-400 border-white/5'
                            }`}>
                            {isProUser ? 'Pro Access' : 'Basic Tier'}
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, active, label, icon }) => (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${active ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        {icon}
        {label}
    </Link>
);

const MobileNavLink = ({ to, label, icon, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${active
                ? 'bg-purple-600/20 border-purple-500/30 text-white'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
            }`}
    >
        <span className={active ? 'text-purple-400' : ''}>{icon}</span>
        <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
    </Link>
);

export default Navbar;