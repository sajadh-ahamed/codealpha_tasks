import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import Layout from './components/common/Layout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Feed from './features/feed/Feed'
import Profile from './features/profile/Profile'
import Notifications from './features/notifications/Notifications'
import Messenger from './features/chat/Messenger'
import Explore from './features/search/Explore'
import { Loader } from 'lucide-react'
import useThemeStore from './store/useThemeStore'

function App() {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Loader className="animate-spin text-primary-500 w-12 h-12" />
            </div>
        );
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Protected Feature Routes */}
                <Route path="/" element={<Feed />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/search" element={<Explore />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/messages" element={<Messenger />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
        </Routes>
    )
}

export default App
