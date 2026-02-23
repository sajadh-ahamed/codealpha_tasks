import React, { useState } from 'react';
import usePostStore from '../../store/usePostStore';
import useAuthStore from '../../store/useAuthStore';
import { Image, Video, Smile, MapPin, Loader } from 'lucide-react';

const PostComposer = () => {
    const [text, setText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const { createPost } = usePostStore();
    const { authUser } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsPosting(true);
        try {
            await createPost({ text });
            setText('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 transition-colors duration-300">
            <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-purple-500 shrink-0 rounded-full flex justify-center items-center text-white font-bold text-lg cursor-pointer">
                    {authUser?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="w-full">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="w-full bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-none focus:ring-0 resize-none overflow-hidden outline-none text-lg mt-2 mb-2"
                            placeholder="What's happening?"
                            rows={3}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-primary-500">
                                <button type="button" className="p-2 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <Image size={20} />
                                </button>
                                <button type="button" className="p-2 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <Video size={20} />
                                </button>
                                <button type="button" className="p-2 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-full transition-colors hidden sm:block">
                                    <Smile size={20} />
                                </button>
                                <button type="button" className="p-2 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-full transition-colors hidden sm:block">
                                    <MapPin size={20} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={isPosting || !text.trim()}
                                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-1.5 px-5 rounded-full disabled:opacity-50 transition-colors flex items-center gap-2 shadow-md shadow-primary-500/20"
                            >
                                {isPosting ? <Loader className="animate-spin" size={18} /> : 'Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostComposer;
