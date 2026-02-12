import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GitHubCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            if (code) {
                console.log('GitHub OAuth code:', code);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                navigate('/dashboard');
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Connecting to GitHub...
                </h2>
                <p className="text-gray-600 mt-2">Please wait</p>
            </div>
        </div>
    );
};

export default GitHubCallback;
