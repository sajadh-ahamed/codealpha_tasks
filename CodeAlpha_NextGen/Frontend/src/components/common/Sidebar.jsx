import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Bell, MessageCircle, User, LogOut, Search, Compass, Sun, Moon } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';

const Sidebar = () => {
    const { authUser, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    const navItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Search', icon: Search, path: '/search' },
        { name: 'Explore', icon: Compass, path: '/explore' },
        { name: 'Messages', icon: MessageCircle, path: '/messages' },
        { name: 'Notifications', icon: Bell, path: '/notifications' },
        { name: 'Profile', icon: User, path: `/profile/${authUser?.username}` },
    ];

    return (
        <div className="h-full py-8 px-6 flex flex-col justify-between">
            <div>
                <Link to="/" className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary-500/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <img src="/logo.png" alt="NextGen logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                        NextGen
                    </span>
                </Link>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-primary-50 dark:hover:bg-gray-800 transition-all group font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                <span className="text-lg hidden xl:block md:block">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button
                    onClick={logout}
                    className="flex text-red-500 items-center justify-center gap-2 w-full py-3 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
