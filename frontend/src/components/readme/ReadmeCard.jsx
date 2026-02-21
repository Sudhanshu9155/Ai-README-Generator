import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaClock, FaEye, FaGithub } from 'react-icons/fa';
import { formatDate, truncateText } from '../../utils/formatters';

const ReadmeCard = ({ readme, onDelete, onEdit }) => {
    const navigate = useNavigate();
    return (
        <div className="card-hover group h-full flex flex-col transition-all duration-300 hover:-translate-y-1">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <Link
                            to={`/edit/${readme._id}`}
                            className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 block group-hover:text-indigo-600"
                        >
                            {readme.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                            <FaClock size={12} />
                            {formatDate(readme.createdAt)}
                        </p>
                    </div>
                    {/* Status Badge */}
                    <span className={`badge-${readme.isPublic ? 'success' : 'gray'} whitespace-nowrap`}>
                        {readme.isPublic ? '🌐 Public' : '🔒 Private'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {truncateText(readme.description || 'No description provided', 100)}
                </p>

                {/* Tech Stack Tags */}
                {readme.techStack && readme.techStack.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {readme.techStack.slice(0, 3).map((tech, idx) => (
                            <span
                                key={idx}
                                className="badge-primary text-xs font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                        {readme.techStack.length > 3 && (
                            <span className="badge-gray text-xs font-medium">
                                +{readme.techStack.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center text-xs text-gray-500 mb-4 gap-3">
                    <div className="flex items-center gap-1">
                        <FaEye size={14} />
                        <span>{readme.content?.length || 0} chars</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1">
                        <FaGithub size={14} />
                        <span>{readme.visibility || 'Standard'}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                    <Link
                        to={`/edit/${readme._id}`}
                        className="flex-1 btn-primary btn-sm flex items-center justify-center gap-2"
                    >
                        <FaEdit size={14} />
                        <span>Edit</span>
                    </Link>
                    {/* Push functionality removed from frontend per user request */}
                    <button
                        onClick={() => onDelete(readme._id)}
                        className="btn-danger btn-sm flex items-center justify-center gap-2"
                    >
                        <FaTrash size={14} />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReadmeCard;
