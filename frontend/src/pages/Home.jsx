import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRobot, FaBolt, FaGithub, FaChartBar, FaRocket, FaShieldAlt, FaArrowDown, FaCheckCircle } from 'react-icons/fa';

// ──────────────────────────────────────────────────────────
// SEO-optimised Home Page
// - Correct h1 → h2 → h3 hierarchy
// - Semantic <main>, <section>, <article>, <footer>
// - FAQ section matching JSON-LD FAQPage schema
// - Rich keyword-targeted copy
// ──────────────────────────────────────────────────────────
const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-purple-500/30 overflow-x-hidden font-sans">

            {/* Background Stars */}
            <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
                <div className="stars-small opacity-20" />
                <div className="stars-medium opacity-30 animate-pulse" />
                <div className="stars-large opacity-40 animate-pulse" />
            </div>

            <main>
                {/* ── HERO SECTION ────────────────────────────────── */}
                <section
                    id="hero"
                    aria-label="Hero — AI README Generator"
                    className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4 md:px-6"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-purple-600/10 blur-[120px] rounded-full" aria-hidden="true" />

                    <div className="relative max-w-7xl mx-auto text-center z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8">
                            <span className="relative flex h-2 w-2" aria-hidden="true">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                            </span>
                            <span className="text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase text-purple-400">
                                AI-Powered Documentation Tool
                            </span>
                        </div>

                        {/* H1 — Primary keyword target */}
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.1] px-2">
                            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                                AI README Generator
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                                for GitHub Projects
                            </span>
                        </h1>

                        {/* Meta description mirrors the page description tag */}
                        <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-sm md:text-lg text-slate-400 font-medium leading-relaxed px-4">
                            Generate stunning, professional <strong className="text-slate-300">README.md files</strong> for your
                            GitHub repositories in seconds using AI. Free tool for developers — supports
                            React, Node.js, Python, Go, and all major tech stacks.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-6 sm:px-0">
                            {isAuthenticated ? (
                                <Link
                                    to="/dashboard"
                                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] md:hover:bg-indigo-500 md:hover:shadow-indigo-500/60 transition-all text-center active:scale-95"
                                    aria-label="Enter your README generation workspace"
                                >
                                    Enter Workspace
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="group relative w-full sm:w-auto px-10 py-4 bg-purple-600 rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] md:hover:bg-purple-500 transition-all text-center active:scale-95 overflow-hidden"
                                        aria-label="Get started free — create your first AI README"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full md:group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />
                                        Get Started Free
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white md:hover:bg-white/10 transition-all text-center active:scale-95"
                                        aria-label="Sign in to your account"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Social proof */}
                        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
                            {['No credit card required', 'Free forever plan', 'GitHub OAuth login'].map(item => (
                                <span key={item} className="flex items-center gap-1.5">
                                    <FaCheckCircle className="text-emerald-500" aria-hidden="true" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-10 animate-bounce text-slate-600" aria-hidden="true">
                        <FaArrowDown />
                    </div>
                </section>

                {/* ── FEATURES SECTION ────────────────────────────── */}
                <section
                    id="features"
                    aria-label="Features"
                    className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32"
                >
                    <div className="text-center mb-16 md:mb-20">
                        <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-4">
                            Why developers choose us
                        </p>
                        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight">
                            Everything you need to document your project
                        </h2>
                        <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm md:text-base">
                            Stop spending hours writing documentation. Our AI generates beautiful,
                            complete README files that improve your project's GitHub visibility.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        <FeatureCard
                            icon={<FaRobot aria-hidden="true" />}
                            title="AI-Powered Generation"
                            desc="Advanced AI models interpret your project's tech stack and code logic to write contextual, accurate documentation automatically."
                            color="text-purple-400"
                        />
                        <FeatureCard
                            icon={<FaBolt aria-hidden="true" />}
                            title="Generate in Seconds"
                            desc="Create a full README in under 5 seconds. No more hours of manual markdown editing — just describe your project and let AI do the rest."
                            color="text-yellow-400"
                        />
                        <FeatureCard
                            icon={<FaGithub aria-hidden="true" />}
                            title="Direct GitHub Push"
                            desc="OAuth GitHub integration lets you push your generated README directly to any repository with a single click."
                            color="text-blue-400"
                        />
                        <FeatureCard
                            icon={<FaChartBar aria-hidden="true" />}
                            title="Project Analytics"
                            desc="Track your documentation history, generation trends, and tech stack usage with beautiful built-in analytics."
                            color="text-emerald-400"
                        />
                        <FeatureCard
                            icon={<FaShieldAlt aria-hidden="true" />}
                            title="Industry Standard Output"
                            desc="Generates compliant, well-structured markdown following GitHub's best practices and open-source standards."
                            color="text-red-400"
                        />
                        <FeatureCard
                            icon={<FaRocket aria-hidden="true" />}
                            title="All Tech Stacks Supported"
                            desc="Supports React, Next.js, Node.js, Python, Django, Vue, Angular, Go, Rust, and dozens more frameworks and languages."
                            color="text-indigo-400"
                        />
                    </div>
                </section>

                {/* ── HOW IT WORKS ────────────────────────────────── */}
                <section
                    id="how-it-works"
                    aria-label="How it works"
                    className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-24"
                >
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-4">
                            Simple 3-step process
                        </p>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            How to generate your README
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Describe Your Project', desc: 'Enter your project name, tech stack, and a brief description. Our AI understands all popular frameworks.' },
                            { step: '02', title: 'AI Generates README', desc: 'In seconds, our AI creates a complete README with installation, usage, features, and contributing sections.' },
                            { step: '03', title: 'Push to GitHub', desc: 'Copy the markdown or push directly to your GitHub repository with one click via OAuth integration.' },
                        ].map(({ step, title, desc }) => (
                            <article key={step} className="relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all">
                                <span className="text-6xl font-black text-purple-500/20 absolute top-4 right-6 select-none" aria-hidden="true">{step}</span>
                                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── FAQ SECTION (matches JSON-LD FAQPage schema) ── */}
                <section
                    id="faq"
                    aria-label="Frequently Asked Questions"
                    className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-24"
                >
                    <div className="text-center mb-12">
                        <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-4">FAQ</p>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Frequently asked questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'What is AI README Generator?',
                                a: 'AI README Generator is a free AI-powered tool that automatically creates professional, beautiful README.md files for your GitHub projects in seconds. Simply describe your project and the AI handles the rest.'
                            },
                            {
                                q: 'Is AI README Generator free?',
                                a: 'Yes! AI README Generator is completely free for basic usage. You can generate professional README files without any cost, no credit card required.'
                            },
                            {
                                q: 'Which programming languages does it support?',
                                a: 'AI README Generator supports all major programming languages and tech stacks including JavaScript, TypeScript, Python, React, Next.js, Node.js, Django, Vue, Angular, Go, Rust, Java, and many more.'
                            },
                            {
                                q: 'Can I push the README directly to GitHub?',
                                a: 'Yes! With GitHub OAuth integration, you can push your generated README directly to any of your GitHub repositories with a single click.'
                            },
                            {
                                q: 'How does the AI generate READMEs?',
                                a: 'Our AI analyzes your project name, tech stack, and description to generate contextual, accurate documentation. It follows GitHub best practices and open-source standards to create a complete README with installation, usage, and contributing sections.'
                            }
                        ].map(({ q, a }) => (
                            <article key={q} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all">
                                <h3 className="font-bold text-white mb-2 flex items-start gap-3">
                                    <span className="text-purple-400 mt-0.5" aria-hidden="true">Q.</span>
                                    {q}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed pl-6">{a}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── CTA BANNER ──────────────────────────────────── */}
                {!isAuthenticated && (
                    <section
                        id="cta"
                        aria-label="Get started call to action"
                        className="max-w-7xl mx-auto px-4 md:px-8 mb-20 md:mb-32"
                    >
                        <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 p-10 md:p-20 text-center group">
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                                    Start generating professional READMEs today
                                </h2>
                                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                                    Join developers who save hours of documentation time every week.
                                    Free, instant, and beautiful.
                                </p>
                                <Link
                                    to="/register"
                                    className="inline-block px-10 md:px-12 py-4 bg-white text-indigo-950 font-black rounded-xl md:rounded-2xl md:hover:bg-indigo-50 md:hover:scale-105 transition-all"
                                    aria-label="Create a free account and start generating READMEs"
                                >
                                    Create Free Account
                                </Link>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-500/10 blur-[100px] pointer-events-none md:group-hover:bg-purple-500/20 transition-colors duration-500" aria-hidden="true" />
                        </div>
                    </section>
                )}
            </main>

            {/* ── FOOTER ──────────────────────────────────────── */}
            <footer className="border-t border-white/5 py-10 md:py-12 bg-black/20 backdrop-blur-sm" role="contentinfo">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <div className="text-lg md:text-xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-tighter mb-1">
                                AI README Generator
                            </div>
                            <p className="text-xs text-slate-600">Free AI-powered README generator for GitHub projects</p>
                        </div>
                        <nav aria-label="Footer navigation" className="flex gap-6 text-sm text-slate-500">
                            <Link to="/register" className="hover:text-white transition-colors">Get Started</Link>
                            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                        </nav>
                        <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">© 2026 AI README Generator</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color }) => (
    <article className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 md:hover:border-purple-500/50 md:hover:bg-purple-500/5 md:hover:-translate-y-2 transition-all duration-300">
        <div className={`text-2xl md:text-3xl mb-4 md:mb-6 transition-transform md:group-hover:scale-110 duration-300 ${color}`}>
            {icon}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 tracking-tight transition-colors md:group-hover:text-purple-400">
            {title}
        </h3>
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{desc}</p>
    </article>
);

export default Home;