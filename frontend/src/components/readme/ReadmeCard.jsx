import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaClock, FaEye, FaGithub, FaGlobe, FaLock, FaCloudUploadAlt } from 'react-icons/fa';
import { formatDate, truncateText } from '../../utils/formatters';

const ReadmeCard = ({ readme, onDelete, onPush }) => {
    return (
        <div className="group relative h-full flex flex-col bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] md:hover:-translate-y-2">
            
            {/* Top Glow Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Header Area - Status icons removed */}
            <div className="px-5 md:px-6 py-4 md:py-5 border-b border-white/5 bg-white/5">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <Link
                            to={`/edit/${readme._id}`}
                            className="text-base md:text-lg font-black text-white hover:text-purple-400 transition-colors line-clamp-1 tracking-tight"
                        >
                            {readme.title}
                        </Link>
                        <div className="text-[9px] md:text-[10px] font-bold text-slate-500 mt-1.5 md:mt-2 flex items-center gap-1.5 uppercase tracking-widest">
                            <FaClock className="text-purple-500/70" size={10} />
                            {formatDate(readme.createdAt)}
                        </div>
                    </div>
                    
                    {/* Minimalist Status Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-tighter border shrink-0 ${
                        readme.isPublic 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-slate-800 text-slate-400 border-white/5'
                    }`}>
                        {readme.isPublic ? <FaGlobe size={9}/> : <FaLock size={9}/>}
                        <span>{readme.isPublic ? 'Public' : 'Private'}</span>
                    </div>
                </div>
            </div>

            {/* Body Content */}
            <div className="p-5 md:p-6 flex-1 flex flex-col">
                <p className="text-xs md:text-sm text-slate-400 mb-4 md:mb-6 leading-relaxed font-medium line-clamp-2">
                    {truncateText(readme.description || 'No description provided for this neural sequence.', 80)}
                </p>

                {/* Tech Stack Tags */}
                {readme.techStack && readme.techStack.length > 0 && (
                    <div className="mb-4 md:mb-6 flex flex-wrap gap-1.5 md:gap-2">
                        {readme.techStack.slice(0, 2).map((tech, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 md:py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] md:text-[10px] font-bold uppercase tracking-tighter rounded-md md:rounded-lg"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {/* Stats Row */}
                <div className="flex items-center text-[9px] md:text-[10px] font-black text-slate-500 mb-5 md:mb-6 gap-3 md:gap-4 uppercase tracking-[0.1em]">
                    <div className="flex items-center gap-1.5">
                        <FaEye className="text-indigo-400" size={11} />
                        <span>{readme.content?.length || 0} Chars</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FaGithub className="text-slate-300" size={11} />
                        <span className="truncate max-w-[80px] md:max-w-none">{readme.visibility || 'Standard'}</span>
                    </div>
                </div>

                {/* Footer Actions: Multi-row logic for Mobile */}
                <div className="flex flex-col gap-2 md:flex-row md:gap-3 mt-auto pt-4 md:pt-5 border-t border-white/5">
                    
                    {/* Edit and Delete Row */}
                    <div className="flex gap-2 w-full md:flex-[2]">
                        <Link
                            to={`/edit/${readme._id}`}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
                        >
                            <FaEdit size={11} />
                            Edit
                        </Link>
                        <button
                            onClick={() => onDelete(readme._id)}
                            className="px-4 py-3 bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 rounded-xl transition-all flex items-center justify-center"
                        >
                            <FaTrash size={11} />
                        </button>
                    </div>

                    {/* PUSH ACTION: Full width on mobile, side-by-side on desktop */}
                    <button
                        onClick={() => onPush && onPush(readme)}
                        className="w-full md:flex-1 py-3 bg-white/5 border border-white/10 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaCloudUploadAlt size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Push to GitHub</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReadmeCard;