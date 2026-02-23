import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaShieldAlt, FaSignOutAlt, FaCrown, FaTrashAlt, FaCheck } from 'react-icons/fa';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        setIsSaving(true);
        setTimeout(async () => {
            await logout();
            navigate('/register');
        }, 1500);
    };

    return (
        /* Reduced px for mobile */
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
            {/* Header: Centered on mobile */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">System Settings</h1>
                <p className="text-slate-500 text-[10px] md:text-sm mt-1 uppercase tracking-widest font-bold">Manage your neural identity</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Information Card */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
                        <FaUser size={120} />
                    </div>
                    
                    <h3 className="text-base md:text-lg font-bold text-white mb-8 flex items-center justify-center md:justify-start gap-2">
                        <FaShieldAlt className="text-purple-500" /> Account Identity
                    </h3>

                    <div className="space-y-6 relative z-10">
                        {/* STACK ON MOBILE: flex-col */}
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-[35px] bg-gradient-to-br from-purple-600 to-indigo-600 p-[2px] shadow-2xl">
                                <div className="w-full h-full bg-[#030712] rounded-[35px] flex items-center justify-center overflow-hidden">
                                    {user?.avatar || user?.photo ? (
                                        <img src={user.avatar || user.photo} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-black text-3xl">{user?.name?.charAt(0)}</span>
                                    )}
                                </div>
                            </div>

                            {/* Inputs: 1 col on mobile */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue={user?.name} 
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Mail</label>
                                    <div className="px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-slate-500 font-medium truncate">
                                        {user?.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full md:w-auto px-6 py-2.5 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                            Save Profile Changes
                        </button>
                    </div>
                </div>

                {/* Membership Status */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl">
                    <h3 className="text-lg font-bold text-white mb-6 text-center md:text-left">Subscription Status</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-white/5 rounded-2xl">
                        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${user?.isPro ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700/20 text-slate-500'}`}>
                                <FaCrown size={24} />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase text-sm tracking-tight">
                                    {user?.isPro ? 'Pro Access Enabled' : 'Basic Tier'}
                                </p>
                                <p className="text-xs text-slate-500 font-medium">
                                    {user?.isPro ? 'Unlimited neural generations' : 'Limited to 2 generations'}
                                </p>
                            </div>
                        </div>
                        {!user?.isPro && (
                            <button onClick={() => navigate('/upgrade')} className="w-full sm:w-auto px-6 py-2 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-lg">
                                Upgrade
                            </button>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-6 mb-10">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-red-400 mb-1">Danger Zone</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-60">High-Risk Operations</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                        <button 
                            onClick={handleLogout}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;