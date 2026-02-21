import { useEffect } from "react";

const GitHubCallback = () => {

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
            // Send code to backend
            window.location.href =
                `${import.meta.env.VITE_API_URL}/auth/github/callback?code=${code}`;
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold">
                    Connecting to GitHub...
                </h2>
                <p>Please wait...</p>
            </div>
        </div>
    );
};

export default GitHubCallback;
