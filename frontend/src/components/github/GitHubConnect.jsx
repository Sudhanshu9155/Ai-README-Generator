import { FaGithub } from 'react-icons/fa';

const GitHubConnect = () => {
    const handleConnect = () => {
        // Redirect to backend GitHub auth route
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.location.href = `${API_URL}/auth/github`;
    };

    return (
        <button
            onClick={handleConnect}
            className="flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full"
        >
            <FaGithub className="mr-2 h-5 w-5" />
            Connect GitHub
        </button>
    );
};

export default GitHubConnect;
