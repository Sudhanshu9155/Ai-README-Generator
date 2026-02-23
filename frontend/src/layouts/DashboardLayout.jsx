import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const DashboardLayout = () => {
    const [title, setTitle] = useState("Dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen pt-16 bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main
                className={`
                    flex-1 p-6 transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'ml-64' : 'ml-20'}
                `}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;