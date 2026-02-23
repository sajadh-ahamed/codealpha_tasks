import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, TrendingUp, Users } from 'lucide-react';
import axios from '../../api/axios';

const Explore = () => {
    const [query, setQuery] = useState('');
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            setIsLoadingUsers(true);
            try {
                const res = await axios.get('/users/suggested');
                setSuggestedUsers(res.data || []);
            } catch (error) {
                console.error('Error fetching suggested users', error);
            } finally {
                setIsLoadingUsers(false);
            }
        };

        fetchSuggestedUsers();
    }, []);

    const followUser = async (userId) => {
        try {
            await axios.post(`/users/follow/${userId}`);
            setSuggestedUsers(prev => prev.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error following user', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full pb-20">
            <div className="sticky top-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-lg pt-4 pb-4 z-10 px-2">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for users, hashtags, or posts..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-3.5 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all text-base font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-2">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">Trending Topics</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { tag: "javascript", posts: "24.5K" },
                            { tag: "webdev", posts: "18.2K" },
                            { tag: "reactjs", posts: "15.9K" },
                            { tag: "framer_motion", posts: "8.1K" },
                            { tag: "design_system", posts: "5.4K" }
                        ].map((trend, i) => (
                            <div key={i} className="flex justify-between items-center cursor-pointer group">
                                <span className="text-gray-900 dark:text-gray-100 font-semibold text-lg group-hover:text-primary-500 transition-colors">#{trend.tag}</span>
                                <span className="text-gray-400 text-sm">{trend.posts} posts</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-500">
                            <Users size={24} />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">Suggested Users</h2>
                    </div>

                    <div className="space-y-4 py-1">
                        {isLoadingUsers && (
                            <p className="text-gray-500 text-sm italic">Loading suggested users...</p>
                        )}

                        {!isLoadingUsers && suggestedUsers.length === 0 && (
                            <p className="text-gray-500 text-sm italic">No suggestions available right now.</p>
                        )}

                        {suggestedUsers.map((user) => (
                            <div key={user._id} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 text-white font-bold flex items-center justify-center shrink-0">
                                        {user.profilePic ? (
                                            <img src={user.profilePic} className="w-full h-full rounded-full object-cover" alt={user.username} />
                                        ) : (
                                            user.username?.[0]?.toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{user.username}</p>
                                </div>
                                <button
                                    onClick={() => followUser(user._id)}
                                    className="px-3 py-1.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold"
                                >
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 px-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary-500" /> Discover Posts
                </h3>
                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                    {/* Masonry gallery placeholder */}
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-48 w-full shadow-sm hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop" className="w-full h-full object-cover" alt="Discover" />
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-64 w-full shadow-sm hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=600&h=800&fit=crop" className="w-full h-full object-cover" alt="Discover" />
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-56 w-full shadow-sm hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=700&fit=crop" className="w-full h-full object-cover" alt="Discover" />
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-40 w-full shadow-sm hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=300&fit=crop" className="w-full h-full object-cover" alt="Discover" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
