import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
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
import DashboardLayout from './layouts/DashboardLayout';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/oauth-callback" element={<OAuthCallback />} />
                        <Route path="/auth/github/callback" element={<GitHubCallback />} />

                        {/* Protected Dashboard Routes */}
                        <Route element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/create" element={<CreateReadme />} />
                            <Route path="/analytics" element={
                                <>
                                    <AnalyticsChart series="projects" title="Projects Created (last 7 days)" type="bar" />
                                    <div className="h-6" />
                                    <AnalyticsChart series="lines" title="Lines Created (last 7 days)" type="line" />
                                </>
                            } />
                            <Route path="/upgrade" element={<Upgrade />} />
                            <Route path="/edit/:id" element={<EditReadme />} />
                            <Route path="/history" element={<History />} />
                        </Route>

                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;