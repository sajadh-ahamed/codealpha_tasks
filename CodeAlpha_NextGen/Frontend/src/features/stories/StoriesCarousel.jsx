import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const mockStories = [
    { id: 1, user: { username: "alex_design", profilePic: "https://i.pravatar.cc/150?u=1" }, image: "https://images.unsplash.com/photo-1541364983171-a8ba01e9d7ce?w=500&h=800&fit=crop" },
    { id: 2, user: { username: "sarah_codes", profilePic: "https://i.pravatar.cc/150?u=2" }, image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=500&h=800&fit=crop" },
    { id: 3, user: { username: "miketech", profilePic: "https://i.pravatar.cc/150?u=3" }, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=800&fit=crop" },
    { id: 4, user: { username: "travel_jane", profilePic: "https://i.pravatar.cc/150?u=4" }, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&h=800&fit=crop" },
];

const StoriesCarousel = () => {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 hide-scrollbar snap-x">
            {/* Create Story Card */}
            <div className="relative shrink-0 w-24 h-40 sm:w-28 sm:h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden snap-start group shadow-sm transition-transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

                {/* Simulated authenticated user camera preview or generic background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-400 to-purple-500 opacity-60"></div>

                <div className="absolute bottom-3 left-0 right-0 z-20 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center border-2 border-white dark:border-gray-900 mb-1 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/50">
                        <Plus size={18} />
                    </div>
                    <span className="text-white text-xs font-semibold drop-shadow-md">Create Story</span>
                </div>
            </div>

            {/* Existing Stories */}
            {mockStories.map((story) => (
                <div key={story.id} className="relative shrink-0 w-24 h-40 sm:w-28 sm:h-48 rounded-2xl cursor-pointer overflow-hidden snap-start group shadow-sm transition-transform hover:scale-105 ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 mx-0.5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10"></div>

                    <img src={story.image} alt="Story" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />

                    <div className="absolute top-2 left-2 z-20">
                        <img src={story.user.profilePic} alt="User" className="w-8 h-8 rounded-full border-2 border-primary-500 shadow-sm" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 z-20">
                        <span className="text-white text-xs font-medium truncate block drop-shadow-md">{story.user.username}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StoriesCarousel;
