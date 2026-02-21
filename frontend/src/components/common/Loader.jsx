const Loader = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col justify-center items-center h-full py-10 gap-4">
            {/* Main Spinner */}
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-spin opacity-20"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-transparent border-t-indigo-600 border-r-purple-600 rounded-full animate-spin"></div>
                </div>
            </div>
            
            {/* Loading Text */}
            <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">{message}</p>
                <div className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
