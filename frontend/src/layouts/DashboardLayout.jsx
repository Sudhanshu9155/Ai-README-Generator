import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
// Navbar is already in App.jsx but usually layout handles it.
// In App.jsx, Navbar is outside Routes. 
// If I use DashboardLayout only for dashboard routes, I might need to adjust App.jsx structure.
// Let's assume Navbar is global for now, but Sidebar is only for dashboard.
// The Navbar is fixed at top? App.jsx puts it at top flow.
// If Navbar is at top, Sidebar is below it?
// Sidebar css has `top-0 pt-16` (padding-top 4rem). This assumes Navbar is 4rem (h-16).
// So I need to ensure Navbar is h-16.

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
