import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                        <span className="block">AI-Powered</span>
                        <span className="block text-indigo-600">README Generator</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                        Create professional README files for your GitHub projects in seconds.
                        Powered by AI to generate comprehensive documentation automatically.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-indigo-600 text-3xl mb-4">🤖</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                AI-Powered
                            </h3>
                            <p className="text-gray-600">
                                Generate comprehensive READMEs using advanced AI technology
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-indigo-600 text-3xl mb-4">⚡</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Lightning Fast
                            </h3>
                            <p className="text-gray-600">
                                Create professional documentation in seconds, not hours
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-indigo-600 text-3xl mb-4">🔗</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                GitHub Integration
                            </h3>
                            <p className="text-gray-600">
                                Connect your GitHub account and analyze repositories automatically
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
