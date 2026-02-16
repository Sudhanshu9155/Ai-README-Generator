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
import OAuthCallback from './pages/OAuthCallback';
import ChatReadme from './pages/ChatReadme';

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

                        {/* Protected Dashboard Routes */}
                        <Route
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/create" element={<CreateReadme />} />
                            <Route path="/edit/:id" element={<EditReadme />} />
                            <Route path="/chat" element={<ChatReadme />} />
                            <Route path="/history" element={<History />} />
                        </Route>

                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
