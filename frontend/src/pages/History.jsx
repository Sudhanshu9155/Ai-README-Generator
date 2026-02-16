import { useState, useEffect } from 'react';
import { getUserActivity } from '../api/analyticsApi';
import Loader from '../components/common/Loader';

const History = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getUserActivity();
                setActivities(data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Activity History</h1>

            <div className="flow-root bg-white shadow rounded-lg p-6">
                <ul className="-mb-8">
                    {activities.length === 0 ? (
                        <li className="pb-8">
                            <div className="relative flex space-x-3">
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <p className="text-sm text-gray-500">No activity recorded yet.</p>
                                </div>
                            </div>
                        </li>
                    ) : (
                        activities.map((activity, activityIdx) => (
                            <li key={activity._id}>
                                <div className="relative pb-8">
                                    {activityIdx !== activities.length - 1 ? (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.action === 'CREATED_README' ? 'bg-green-500' :
                                                activity.action === 'UPDATED_README' ? 'bg-blue-500' :
                                                    activity.action === 'DELETED_README' ? 'bg-red-500' :
                                                        'bg-gray-500'
                                                }`}>
                                                {/* Icon based on action */}
                                                <span className="text-white text-xs font-bold">
                                                    {activity.action[0]}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    {activity.details}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                <time dateTime={activity.createdAt}>
                                                    {new Date(activity.createdAt).toLocaleString()}
                                                </time>
                                            </div>
                                        </div>
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

export default History;
