import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaUser, FaEnvelope, FaLock, FaRocket, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, error } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validateName = (name) => {
        if (!name) return 'Name is required';
        if (name.trim().length < 2) return 'At least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(name)) return 'Letters and spaces only';
        return '';
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Invalid email';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Min 6 characters';
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Please confirm';
        if (confirmPassword !== password) return 'No match';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        let errorMsg = '';
        if (name === 'name') errorMsg = validateName(value);
        else if (name === 'email') errorMsg = validateEmail(value);
        else if (name === 'password') {
            errorMsg = validatePassword(value);
            if (formData.confirmPassword) {
                const confirmError = validateConfirmPassword(formData.confirmPassword, value);
                setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
            }
        } else if (name === 'confirmPassword') errorMsg = validateConfirmPassword(value, formData.password);
        
        setErrors({ ...errors, [name]: errorMsg });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password);
        
        if (nameError || emailError || passwordError || confirmError) {
            setErrors({ name: nameError, email: emailError, password: passwordError, confirmPassword: confirmError });
            return;
        }

        setLoading(true);
        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);
        if (result.success) navigate('/dashboard');
        setLoading(false);
    };

    const inputClasses = (errorField) => `w-full bg-white/5 border ${errorField ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500/50 rounded-xl py-3 md:py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 transition-all outline-none text-sm`;
    const labelClasses = "text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] relative overflow-x-hidden py-12 px-4">
            
            {/* Back Button: Mobile Optimized */}
            <div className="absolute top-6 left-4 md:top-8 md:left-8 z-20">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden xs:inline">Return to Home</span>
                    <span className="xs:hidden">Back</span>
                </button>
            </div>

            {/* Background stars and glows */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="stars-small opacity-40"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Registration Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

                    <div className="text-center space-y-3 mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-2xl text-xl shadow-inner">
                            <span>✨</span>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                                Create Account
                            </h2>
                            <p className="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                                Initialize Your Profile
                            </p>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 animate-shake">
                                <p className="text-[10px] text-red-400 font-bold flex items-center gap-2 uppercase tracking-wider">
                                    <span>⚠️</span> {error}
                                </p>
                            </div>
                        )}

                        {/* Name Field */}
                        <div className="space-y-1">
                            <label className={labelClasses}>Full Name</label>
                            <div className="relative group">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClasses(errors.name)}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-[9px] text-red-400 font-bold ml-1">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className={labelClasses}>Mail</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputClasses(errors.email)}
                                    placeholder="john.doe@domain"
                                />
                            </div>
                            {errors.email && <p className="text-[9px] text-red-400 font-bold ml-1">{errors.email}</p>}
                        </div>

                        {/* Password Grid: Forced Stack on Mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className={labelClasses}>Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={inputClasses(errors.password)}
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>Verify</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={inputClasses(errors.confirmPassword)}
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>
                        </div>
                        {(errors.password || errors.confirmPassword) && (
                            <p className="text-[9px] text-red-400 font-bold ml-1">{errors.password || errors.confirmPassword}</p>
                        )}

                        {/* Terms Checkbox */}
                        <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors mt-2">
                            <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-white/20 bg-transparent text-indigo-600 focus:ring-indigo-500" required />
                            <span className="text-[12px] md:text-[14px] text-slate-500 leading-tight">
                                I accept the <span className="text-indigo-400">Neural Protocol</span>
                            </span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden py-4 rounded-xl font-black text-[10px] md:text-xs tracking-[0.2em] text-white transition-all active:scale-95 disabled:opacity-50 mt-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all"></div>
                            <span className="relative flex items-center justify-center gap-2 uppercase">
                                {loading ? 'UPLOADING...' : 'INITIALIZE PROFILE'} <FaRocket className="text-[10px]" />
                            </span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                            <span className="px-4 bg-[#070b14]">External Uplink</span>
                        </div>
                    </div>

                    {/* OAuth Row: Responsive Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                        <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`} className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all font-bold text-[11px] text-slate-300">
                            <FcGoogle size={16} /> GOOGLE
                        </a>
                        <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`} className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all font-bold text-[11px] text-slate-300">
                            <FaGithub size={16} /> GITHUB
                        </a>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-xs text-slate-500">
                        Profile already exists?{' '}
                        <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4">
                            Authenticate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;