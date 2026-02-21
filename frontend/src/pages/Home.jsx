import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-indigo-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="h1 text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                            AI-Powered README Generator
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
                            Create professional README files for your GitHub projects in seconds.
                            Powered by advanced AI to generate comprehensive documentation automatically.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                            {isAuthenticated ? (
                                <Link
                                    to="/dashboard"
                                    className="btn-primary text-lg px-8 py-3 animate-slideInUp"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn-primary text-lg px-8 py-3 animate-slideInUp"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="btn-secondary text-lg px-8 py-3 animate-slideInUp"
                                        style={{ animationDelay: '100ms' }}
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <h2 className="h2 text-4xl font-bold mb-4 text-gray-900">Why Choose Our Generator?</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to create stunning project documentation
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="card-hover p-8 animate-slideInUp" style={{ animationDelay: '0ms' }}>
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="h4 text-gray-900 mb-2">AI-Powered</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Generate comprehensive READMEs using advanced AI technology that understands your project
                        </p>
                    </div>

                    <div className="card-hover p-8 animate-slideInUp" style={{ animationDelay: '100ms' }}>
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="h4 text-gray-900 mb-2">Lightning Fast</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Create professional documentation in seconds, not hours. Save time and focus on coding
                        </p>
                    </div>

                    <div className="card-hover p-8 animate-slideInUp" style={{ animationDelay: '200ms' }}>
                        <div className="text-4xl mb-4">🔗</div>
                        <h3 className="h4 text-gray-900 mb-2">GitHub Integration</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Connect your GitHub account and analyze repositories automatically for tech stack detection
                        </p>
                    </div>

                    <div className="card-hover p-8 animate-slideInUp" style={{ animationDelay: '300ms' }}>
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="h4 text-gray-900 mb-2">Analytics Dashboard</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Track your README generation history and see detailed analytics about your projects
                        </p>
                    </div>

                    <div className="card-hover p-8 animate-slideInUp" style={{ animationDelay: '400ms' }}>
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="h4 text-gray-900 mb-2">Professional Quality</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Generate documentation that meets industry standards and best practices
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-4xl font-bold mb-4">Ready to Supercharge Your Documentation?</h2>
                        <p className="text-lg text-indigo-100 mb-8">
                            Join thousands of developers creating beautiful READMEs with AI
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Start Free Today
                        </Link>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-lg font-semibold text-white mb-4 sm:mb-0">
                            AI README Generator
                        </div>
                        <p className="text-sm">
                            © 2024 All rights reserved. Crafted with ❤️
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
