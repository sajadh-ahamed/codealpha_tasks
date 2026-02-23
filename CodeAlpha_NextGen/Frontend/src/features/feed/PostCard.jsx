import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Trash } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';
import { formatTimeAgo } from '../../utils/formatDate';

const PostCard = ({ post }) => {
    const { authUser } = useAuthStore();
    const { likeUnlikePost, deletePost } = usePostStore();

    const isLikedInitial = post.likes.includes(authUser?._id);
    const [isLiked, setIsLiked] = useState(isLikedInitial);
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [showOptions, setShowOptions] = useState(false);

    const isMyPost = authUser?._id === post.user._id;

    const handleLike = async () => {
        const prevIsLiked = isLiked;
        const prevLikesCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        try {
            await likeUnlikePost(post._id);
        } catch (error) {
            // Revert on error
            setIsLiked(prevIsLiked);
            setLikesCount(prevLikesCount);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            await deletePost(post._id);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4 transition-colors duration-300 relative group"
        >
            <div className="flex gap-3">
                <div className="w-12 h-12 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full flex justify-center items-center text-white font-bold cursor-pointer shrink-0">
                    {post.user.profilePic ? (
                        <img src={post.user.profilePic} className="w-full h-full rounded-full object-cover" alt="Profile" />
                    ) : (
                        post.user.username[0].toUpperCase()
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="font-bold text-gray-900 dark:text-gray-100 mr-2 hover:underline cursor-pointer truncate">
                                {post.user.username}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                · {formatTimeAgo(post.createdAt)}
                            </span>
                        </div>

                        {isMyPost && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full transition-colors"
                                >
                                    <MoreHorizontal size={20} />
                                </button>
                                <AnimatePresence>
                                    {showOptions && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10"
                                        >
                                            <button
                                                onClick={handleDelete}
                                                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 rounded-xl transition-colors text-sm"
                                            >
                                                <Trash size={16} /> Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-800 dark:text-gray-200 mt-2 whitespace-pre-wrap text-base">
                        {post.text}
                    </p>

                    {post.media && post.media.length > 0 && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            {post.media[0].type === 'image' ? (
                                <img src={post.media[0].url} alt="Post content" className="w-full h-auto object-cover max-h-96" />
                            ) : (
                                <video src={post.media[0].url} controls className="w-full h-auto max-h-96" />
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4 text-gray-500 dark:text-gray-400 max-w-md">
                        <button className="flex items-center gap-1.5 hover:text-primary-500 group transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                                <MessageCircle size={18} />
                            </div>
                            <span className="text-sm">{post.comments.length || ''}</span>
                        </button>

                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 group transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                        >
                            <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-50 dark:bg-red-900/20' : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/20'}`}>
                                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                            </div>
                            <span className="text-sm">{likesCount || ''}</span>
                        </button>

                        <button className="flex items-center gap-1.5 hover:text-green-500 group transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                                <Share size={18} />
                            </div>
                        </button>

                        <button className="flex items-center gap-1.5 hover:text-blue-500 group transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                <Bookmark size={18} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;
