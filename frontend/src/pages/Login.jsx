import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, error } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email';
        return '';
    };

    // Password validation function
    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Real-time validation
        if (name === 'email') {
            setErrors({ ...errors, email: validateEmail(value) });
        } else if (name === 'password') {
            setErrors({ ...errors, password: validatePassword(value) });
        }
    };

    const validateForm = () => {
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        
        const newErrors = {
            email: emailError,
            password: passwordError,
        };
        
        setErrors(newErrors);
        return !emailError && !passwordError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const result = await login(formData);

        if (result.success) {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-md w-full space-y-8 relative z-10 animate-slideInUp">
                <div className="card p-8 space-y-6">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white text-2xl shadow-lg">
                            📝
                        </div>
                        <div>
                            <h2 className="h2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600 text-sm mt-2">
                                Sign in to access your README projects
                            </p>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-slideInDown">
                                <div className="flex items-start gap-3">
                                    <span className="text-red-600 text-lg">⚠</span>
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`input-field pl-11 focus:ring-indigo-500 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                                    <span>✕</span> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`input-field pl-11 focus:ring-indigo-500 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                                    <span>✕</span> {errors.password}
                                </p>
                            )}
                        </div>
                        

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-gray-600 font-medium">Remember me</span>
                            </label>
                            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn-primary py-3 font-semibold shadow-lg hover:shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-gray-600 font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <a
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 font-medium text-sm text-gray-700"
                        >
                            <FcGoogle class="h-5 w-5" />
                            <span className="hidden sm:inline">Google</span>
                        </a>
                        <a
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:border-gray-800 hover:bg-gray-100 transition-all duration-300 font-medium text-sm text-gray-700"
                        >
                            <FaGithub className="h-5 w-5" />
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <p className="text-xs text-center text-gray-500">
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-indigo-600 hover:underline">
                        Terms of Service
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
