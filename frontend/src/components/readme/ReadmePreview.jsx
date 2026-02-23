import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { pushReadme } from '../../api/githubApi';
import { FaGithub, FaCopy, FaEdit, FaSave, FaCrown, FaTerminal, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ReadmePreview = ({ content, onEdit, onSave, entity }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const isProUser = user?.isPro === true;

    const [copied, setCopied] = useState(false);
    const [pushing, setPushing] = useState(false);
    const [message, setMessage] = useState(null); 
    const [messageType, setMessageType] = useState(null); 

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 4000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePush = async () => {
        if (!isProUser) {
            navigate('/upgrade');
            return;
        }
        if (!entity?._id) {
            showMessage('Please save the project before pushing.', 'error');
            return;
        }
        try {
            setPushing(true);
            await pushReadme(entity._id);
            showMessage('README successfully pushed to GitHub!', 'success');
        } catch (err) {
            showMessage(err.response?.data?.message || 'Failed to push README', 'error');
        } finally {
            setPushing(false);
        }
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl relative transition-all duration-500">
            
            {/* --- HEADER --- */}
            <div className="bg-white/5 px-4 md:px-6 py-4 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex gap-1.5 mr-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <FaTerminal className="text-purple-400 text-xs" />
                    <h3 className="text-slate-300 font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Preview</h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 bg-white/5 text-slate-300 border border-white/10 hover:bg-purple-500 hover:text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 md:px-4 py-2 rounded-xl transition-all"
                    >
                        <FaEdit /> <span className="hidden xs:inline">Edit</span>
                    </button>

                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 md:px-4 py-2 rounded-xl transition-all ${
                            copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-300 border border-white/10'
                        }`}
                    >
                        <FaCopy /> {copied ? 'Copied!' : 'Copy'}
                    </button>

                    {/* DESKTOP BUTTONS: Visible in Header */}
                    <div className="hidden md:flex items-center gap-2">
                        {onSave && (
                            <button
                                onClick={onSave}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <FaSave /> Save
                            </button>
                        )}

                        {isProUser ? (
                            <button
                                onClick={handlePush}
                                disabled={pushing}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-xl transition-all shadow-lg shadow-purple-500/20"
                            >
                                <FaGithub /> {pushing ? 'Deploying...' : 'Deploy'}
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/upgrade')}
                                className="flex items-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-xl transition-all"
                            >
                                <FaCrown /> Upgrade to Push
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="relative group">
                <textarea
                    readOnly
                    value={content}
                    className="w-full h-[55vh] md:h-[60vh] p-6 md:p-8 font-mono text-xs md:text-sm bg-[#030712]/80 text-indigo-100/90 resize-none focus:outline-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    spellCheck="false"
                />
            </div>

            {/* --- FOOTER --- */}
            <div className="p-4 md:px-6 md:py-4 border-t border-white/10 bg-white/5">
                <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
                    
                    {/* MOBILE ACTION AREA: Save removed, only Push/Upgrade remains */}
                    <div className="w-full md:hidden">
                        {isProUser ? (
                            <button
                                onClick={handlePush}
                                disabled={pushing}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                            >
                                <FaGithub size={14} /> {pushing ? 'Deploying...' : 'Deploy to GitHub'}
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/upgrade')}
                                className="w-full flex items-center justify-center gap-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all"
                            >
                                <FaCrown className="animate-pulse" /> Upgrade to Push
                            </button>
                        )}
                    </div>

                    {/* System Stats */}
                    <div className="flex items-center justify-center md:justify-start gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest w-full md:w-auto">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            {content.length} Chars
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            Neural Synced
                        </span>
                    </div>

                    <div className="hidden md:block text-[9px] font-black text-slate-600 uppercase tracking-widest">
                        Forge Engine v1.0
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            {message && (
                <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 animate-slideInDown
                    ${messageType === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                    {messageType === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{message}</span>
                </div>
            )}
        </div>
    );
};

export default ReadmePreview;