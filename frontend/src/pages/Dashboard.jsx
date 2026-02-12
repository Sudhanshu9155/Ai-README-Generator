import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name}!
                </h1>
                <p className="mt-2 text-gray-600">
                    Manage your README projects and create new ones
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    to="/create"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-indigo-500"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-4">➕</div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Create New README
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Generate a new README for your project
                        </p>
                    </div>
                </Link>

                <Link
                    to="/history"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            View History
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            See all your generated READMEs
                        </p>
                    </div>
                </Link>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-center">
                        <div className="text-4xl mb-4">⚙️</div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Settings
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage your account settings
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Stats
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <div className="text-3xl font-bold text-indigo-600">0</div>
                        <div className="text-sm text-gray-600 mt-1">Total READMEs</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">0</div>
                        <div className="text-sm text-gray-600 mt-1">This Month</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">0</div>
                        <div className="text-sm text-gray-600 mt-1">Repositories</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
