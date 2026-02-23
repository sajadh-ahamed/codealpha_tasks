import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Mail, Lock, Loader } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, isLoggingIn } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-3xl glass relative overflow-hidden"
            >
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-primary-500/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mx-auto mb-4">
                        <img src="/logo.png" alt="NextGen logo" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400">Log in to continue to NextGen Social.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    {error && (
                        <div className="p-3 bg-red-100/50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 transform transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoggingIn ? <Loader className="animate-spin w-5 h-5" /> : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Don't have an account? <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign up</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
