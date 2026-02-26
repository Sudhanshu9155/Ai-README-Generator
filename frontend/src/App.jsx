import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateReadme from './pages/CreateReadme';
import EditReadme from './pages/EditReadme';
import History from './pages/History';
import Upgrade from './pages/Upgrade';
import AnalyticsChart from './components/charts/AnalyticsChart';
import OAuthCallback from './pages/OAuthCallback';
import GitHubCallback from "./pages/GitHubCallback";
import Settings from './pages/Setting';
import Admin from './pages/Admin';

// --- 3D BACKGROUND COMPONENT ---
// This stays fixed in the background of the entire app
const Background3D = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <iframe
                src='https://my.spline.design/helix-995b2149e661075775368a51357564d6/'
                frameBorder='0'
                width='100%'
                height='100%'
                className="scale-150 opacity-30" // Lower opacity so it doesn't distract in Dashboard
            ></iframe>
            {/* Radial gradient to blend the 3D edges into your #030712 background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#030712_90%)]"></div>
        </div>
    );
};

// This layout wrapper ensures Navbar AND Sidebar only appear together in protected areas
const DashboardLayout = ({ isSidebarOpen, toggleSidebar }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-200 relative">
            {/* Navbar only renders here for authenticated users */}
            <Navbar />

            <div className="flex flex-1 relative pt-20">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <main
                    className={`flex-1 w-full transition-all duration-300 ease-in-out relative z-10 
                        /* MOBILE FIX: No margin by default, margins only on desktop (md) */
                        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0`}
                >
                    {/* ProtectedRoute returns an <Outlet /> to show sub-pages */}
                    <ProtectedRoute />
                </main>
            </div>
        </div>
    );
};

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <Router>
            <AuthProvider>
                {/* Global Wrapper for base styles - added 'relative' and 'z-10' logic */}
                <div className="min-h-screen bg-[#030712] selection:bg-purple-500/30 overflow-x-hidden relative">

                    {/* 1. Global 3D Background */}
                    <Background3D />

                    {/* 2. Route Content - relative z-10 ensures UI stays ABOVE the 3D scene */}
                    <div className="relative z-10">
                        <Routes>
                            {/* --- PUBLIC ROUTES --- */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/oauth-callback" element={<OAuthCallback />} />
                            <Route path="/auth/github/callback" element={<GitHubCallback />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/admin/login" element={<Admin />} />

                            {/* --- PROTECTED ROUTES --- */}
                            <Route element={
                                <DashboardLayout
                                    isSidebarOpen={isSidebarOpen}
                                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                                />
                            }>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/create" element={<CreateReadme />} />
                                <Route path="/analytics" element={
                                    <div className="max-w-[1400px] mx-auto px-6 py-10">
                                        <AnalyticsChart series="projects" title="Projects Created" type="bar" />
                                        <div className="h-10" />
                                        <AnalyticsChart series="lines" title="Lines Created" type="line" />
                                    </div>
                                } />
                                <Route path="/upgrade" element={<Upgrade />} />
                                <Route path="/edit/:id" element={<EditReadme />} />
                                <Route path="/history" element={<History />} />
                                <Route path="/settings" element={<Settings />} />
                            </Route>

                            {/* Fallback to Home */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;