const History = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">README History</h1>
                <p className="mt-2 text-gray-600">
                    View all your generated READMEs
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        No READMEs Yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Start creating your first README!
                    </p>
                    <a
                        href="/create"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Create README
                    </a>
                </div>
            </div>
        </div>
    );
};

export default History;
