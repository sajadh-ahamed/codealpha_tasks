import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import { Loader, Home, Compass, MessageCircle, Bell, User, Sun, Moon } from 'lucide-react';

const Layout = () => {
    const { authUser, isCheckingAuth } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const location = useLocation();

    const mobileNavItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Explore', icon: Compass, path: '/explore' },
        { name: 'Messages', icon: MessageCircle, path: '/messages' },
        { name: 'Alerts', icon: Bell, path: '/notifications' },
        { name: 'Profile', icon: User, path: `/profile/${authUser?.username}` }
    ];

    if (isCheckingAuth) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Loader className="animate-spin text-primary-500 w-12 h-12" />
            </div>
        );
    }

    if (!authUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar for Desktop navigation */}
            <div className="hidden md:flex flex-col w-64 fixed h-full border-r border-gray-200 dark:border-gray-800 glass z-50">
                <Sidebar />
            </div>

            <button
                onClick={toggleTheme}
                className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 flex items-center justify-center"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex-1 flex flex-col md:ml-64 w-full">
                {/* Main Content Area */}
                <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
                    <Outlet />
                </main>

                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-1 z-50">
                    <div className="grid grid-cols-5 gap-1">
                        {mobileNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    <Icon size={18} />
                                    <span className="text-[11px] mt-0.5">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Layout;
