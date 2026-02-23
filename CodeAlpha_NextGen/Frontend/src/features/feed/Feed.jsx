import React, { useEffect } from 'react';
import usePostStore from '../../store/usePostStore';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { Loader } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const Feed = () => {
    const { posts, isLoading, getFeedPosts } = usePostStore();

    useEffect(() => {
        getFeedPosts();
    }, [getFeedPosts]);

    return (
        <div className="w-full max-w-2xl mx-auto pb-20">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 px-1">Home</h1>

            <PostComposer />

            {isLoading && posts.length === 0 ? (
                <div className="flex justify-center my-10">
                    <Loader className="animate-spin text-primary-500 w-8 h-8" />
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </AnimatePresence>

                    {!isLoading && posts.length === 0 && (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <p className="text-lg font-medium">No posts yet.</p>
                            <p className="text-sm">Be the first to say something!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Feed;
