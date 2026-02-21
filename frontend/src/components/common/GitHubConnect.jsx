
import { useAuth } from '../../context/AuthContext';
import { FaGithub, FaCheckCircle, FaExchangeAlt } from 'react-icons/fa';

const GitHubConnect = () => {
    const { user } = useAuth();
    const isConnected = !!user?.githubUsername;

    const handleConnect = () => {
        // Redirect to backend auth route
        // Use environment variable or default to localhost:5000
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.location.href = `${apiUrl}/auth/github`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaGithub className="text-2xl" />
                GitHub Integration
            </h3>

            <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Status</span>
                {isConnected ? (
                    <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                        <FaCheckCircle className="mr-1.5" />
                        Connected
                    </span>
                ) : (
                    <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        Not Connected
                    </span>
                )}
            </div>

            {isConnected ? (
                <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Connected as:</p>
                    <p className="font-medium text-gray-900">@{user.githubUsername}</p>
                </div>
            ) : (
                <p className="text-sm text-gray-500 mb-6">
                    Connect your GitHub account to directly import repositories and automatically generate READMEs.
                </p>
            )}

            <button
                onClick={handleConnect}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors ${isConnected
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-[#24292F] text-white hover:bg-[#24292F]/90'
                    }`}
            >
                {isConnected ? (
                    <>
                        <FaExchangeAlt />
                        Reconnect / Switch
                    </>
                ) : (
                    <>
                        <FaGithub />
                        Connect GitHub
                    </>
                )}
            </button>
        </div>
    );
};

export default GitHubConnect;
