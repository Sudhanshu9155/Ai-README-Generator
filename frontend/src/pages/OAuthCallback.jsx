import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (token) {
                localStorage.setItem('token', token);
                await checkAuth();
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate, checkAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Authenticating...
                </h2>
                <p className="text-gray-600 mt-2">Please wait while we verify your credentials.</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
