import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRobot, FaBolt, FaGithub, FaChartBar, FaRocket, FaShieldAlt, FaArrowDown } from 'react-icons/fa';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-purple-500/30 overflow-x-hidden font-sans">
            {/* Background Stars - Global */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="stars-small opacity-20"></div>
                <div className="stars-medium opacity-30 animate-pulse"></div>
                <div className="stars-large opacity-40 animate-pulse"></div>
            </div>

            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4 md:px-6">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>
                
                <div className="relative max-w-7xl mx-auto text-center z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        <span className="text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase text-purple-400">Next Gen Documentation</span>
                    </div>

                    {/* Main Title: Restored Hover/Gradient Logic */}
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.1] px-2">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                            Automate Your 
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                            GitHub Presence
                        </span>
                    </h1>

                    <p className="mt-4 md:mt-6 max-w-xl mx-auto text-sm md:text-lg text-slate-400 font-medium leading-relaxed px-4">
                        The ultimate AI-powered workspace for developers. Synthesize professional 
                        README files and analyze repositories in milliseconds.
                    </p>

                    {/* CTA Buttons: Restored Desktop Hover Effects */}
                    <div className="mt-10 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-6 sm:px-0">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] md:hover:bg-indigo-500 md:hover:shadow-indigo-500/60 transition-all text-center active:scale-95">
                                Enter Workspace
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="group relative w-full sm:w-auto px-10 py-4 bg-purple-600 rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] md:hover:bg-purple-500 transition-all text-center active:scale-95 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full md:group-hover:translate-x-full transition-transform duration-700"></div>
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white md:hover:bg-white/10 transition-all text-center active:scale-95">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 animate-bounce text-slate-600">
                    <FaArrowDown />
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-4">Core Engine</h2>
                    <h3 className="text-3xl md:text-6xl font-black text-white tracking-tight">Built for modern devs</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <FeatureCard icon={<FaRobot />} title="Neural Synthesis" desc="AI models that interpret code logic to write contextual documentation." color="text-purple-400" />
                    <FeatureCard icon={<FaBolt />} title="Instant Velocity" desc="Generate documentation in seconds. Forget hours of manual markdown editing." color="text-yellow-400" />
                    <FeatureCard icon={<FaGithub />} title="Seamless Sync" desc="Direct integration with GitHub API for real-time analysis." color="text-blue-400" />
                    <FeatureCard icon={<FaChartBar />} title="Project Analytics" desc="Visualize your documentation growth and generation history." color="text-emerald-400" />
                    <FeatureCard icon={<FaShieldAlt />} title="Enterprise Ready" desc="Compliant markdown generation following industry standards." color="text-red-400" />
                    <FeatureCard icon={<FaRocket />} title="Future Proof" desc="Scale your project visibility with SEO-friendly READMEs." color="text-indigo-400" />
                </div>
            </div>

            {/* Restored CTA Banner with Hover Glow */}
            {!isAuthenticated && (
                <div className="max-w-7xl mx-auto px-4 md:px-8 mb-20 md:mb-32">
                    <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 p-10 md:p-20 text-center group">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 tracking-tight">Ready to begin?</h2>
                            <Link to="/register" className="inline-block px-10 md:px-12 py-4 bg-white text-indigo-950 font-black rounded-xl md:rounded-2xl md:hover:bg-indigo-50 md:hover:scale-105 transition-all">
                                Initialize Now
                            </Link>
                        </div>
                        {/* Interactive Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-500/10 blur-[100px] pointer-events-none md:group-hover:bg-purple-500/20 transition-colors duration-500"></div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="border-t border-white/5 py-10 md:py-12 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="text-lg md:text-xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-tighter mb-4">
                        AI-README GENERATOR
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">© 2026 class project.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color }) => (
    /* Feature Card: Restored Desktop Hover Scale and Border Lighting */
    <div className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 md:hover:border-purple-500/50 md:hover:bg-purple-500/5 md:hover:-translate-y-2 transition-all duration-300">
        <div className={`text-2xl md:text-3xl mb-4 md:mb-6 transition-transform md:group-hover:scale-110 duration-300 ${color}`}>
            {icon}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 tracking-tight transition-colors md:group-hover:text-purple-400">{title}</h3>
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{desc}</p>
    </div>
);

export default Home;