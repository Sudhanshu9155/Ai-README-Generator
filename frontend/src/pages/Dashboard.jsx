import { useState, useEffect } from 'react';
import { getUserReadmes, deleteReadme } from '../api/entityApi';
import { getDashboardStats } from '../api/analyticsApi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaGithub, FaHistory, FaTrash, FaEdit } from 'react-icons/fa';
import Loader from '../components/common/Loader';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalReadmes: 0, totalLines: 0, recentActivity: [] });
    const [readmes, setReadmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, readmesData] = await Promise.all([
                    getDashboardStats(),
                    getUserReadmes()
                ]);
                setStats(statsData);
                setReadmes(readmesData);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this README?')) {
            try {
                await deleteReadme(id);
                setReadmes(readmes.filter(r => r._id !== id));
                // Update stats locally or refetch
                setStats(prev => ({ ...prev, totalReadmes: prev.totalReadmes - 1 }));
            } catch (err) {
                console.error("Failed to delete readme", err);
                alert("Failed to delete README");
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage your README projects and create new ones
                    </p>
                </div>
                <Link
                    to="/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <FaPlus className="mr-2" /> Create New
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                <FaHistory className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total READMEs
                                    </dt>
                                    <dd className="text-3xl font-semibold text-gray-900">
                                        {stats.totalReadmes}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <span className="text-white font-bold text-xl">lines</span>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Lines Generated
                                    </dt>
                                    <dd className="text-3xl font-semibold text-gray-900">
                                        {stats.totalLines}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-gray-800 rounded-md p-3">
                                <FaGithub className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        GitHub Status
                                    </dt>
                                    <dd className="text-lg font-semibold text-gray-900">
                                        {user?.githubId ? 'Connected' : 'Not Connected'}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent READMEs */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your READMEs</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {readmes.length === 0 ? (
                        <li className="px-6 py-4 text-center text-gray-500">
                            No READMEs found. Create your first one!
                        </li>
                    ) : (
                        readmes.map((readme) => (
                            <li key={readme._id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="text-sm font-medium text-indigo-600 truncate mr-4">
                                            {readme.title}
                                        </div>
                                        <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {readme.isPublic ? 'Public' : 'Private'}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-500">
                                            {new Date(readme.createdAt).toLocaleDateString()}
                                        </div>
                                        <Link
                                            to={`/edit/${readme._id}`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(readme._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
