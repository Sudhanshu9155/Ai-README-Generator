import { useEffect } from "react";
import Loader from "../components/common/Loader";
import { FaGithub } from "react-icons/fa";

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
        <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-hidden flex items-center justify-center font-sans">
            
            {/* Background Galaxy Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-900/20 blur-[120px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-md mx-auto px-4 text-center">
                {/* Visual Uplink Icon */}
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
                        <FaGithub className="text-5xl text-white animate-bounce" />
                    </div>
                </div>

                {/* Styled Loader */}
                <Loader message="Establishing Neural Uplink with GitHub..." />
                
                <p className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">
                    Synchronizing Repository Access
                </p>
            </div>
        </div>
    );
};

export default GitHubCallback;