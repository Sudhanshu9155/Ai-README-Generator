import { useParams } from 'react-router-dom';

const EditReadme = () => {
    const { id } = useParams();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit README</h1>
                <p className="mt-2 text-gray-600">
                    Editing README ID: {id}
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">✏️</div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Edit README
                    </h2>
                    <p className="text-gray-600">
                        This feature is coming soon!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EditReadme;
