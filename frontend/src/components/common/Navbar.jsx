import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isProUser = user?.isPro === true;

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 group"
                        >
                            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">
                                📝
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                                AI README
                            </span>
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex space-x-1">
                            <Link
                                to="/dashboard"
                                className="px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/create"
                                className="px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-sm font-medium"
                            >
                                Create
                            </Link>
                            <Link
                                to="/history"
                                className="px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-sm font-medium"
                            >
                                History
                            </Link>
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                {/* User Name */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden lg:block">

                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                            {user?.name}

                                            <span
                                                className={`text-[10px] font-semibold px-2 py-[2px] rounded-md uppercase tracking-wide
    ${isProUser
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                                                    }`}
                                            >
                                                {isProUser ? 'Pro' : 'Free'}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="hidden md:inline-flex btn-primary btn-sm"
                                >
                                    Logout
                                </button>

                                {/* Mobile Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="md:hidden px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="hidden sm:inline px-4 py-2 text-gray-600 font-medium text-sm hover:text-indigo-600 transition-colors duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary btn-sm"
                                >
                                    <span className="hidden sm:inline">Sign up</span>
                                    <span className="sm:hidden">Sign up</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
