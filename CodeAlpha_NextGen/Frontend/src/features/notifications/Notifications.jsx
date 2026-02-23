import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { formatTimeAgo } from '../../utils/formatDate';
import { Heart, MessageCircle, UserPlus, Bell, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get('/notifications');
                setNotifications(res.data);
            } catch (error) {
                console.error("Error fetching notifications", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const deleteNotifications = async () => {
        if (window.confirm("Delete all notifications?")) {
            try {
                await axios.delete('/notifications');
                setNotifications([]);
            } catch (error) {
                console.error(error);
            }
        }
    }

    if (isLoading) return <div className="p-8 text-center"><Bell className="animate-bounce w-8 h-8 text-primary-500 mx-auto" /></div>;

    return (
        <div className="max-w-xl mx-auto w-full pb-20">
            <div className="flex justify-between items-center mb-6 px-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
                {notifications.length > 0 && (
                    <button onClick={deleteNotifications} className="text-sm text-red-500 hover:text-red-600 font-semibold">
                        Clear all
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm">You don't have any notifications right now.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => {
                        let Icon = Bell;
                        let iconColor = "text-gray-500 bg-gray-100 dark:bg-gray-800";
                        let actionText = "";

                        if (notif.type === 'like') { Icon = Heart; iconColor = "text-red-500 bg-red-50 dark:bg-red-900/20"; actionText = "liked your post"; }
                        if (notif.type === 'follow') { Icon = UserPlus; iconColor = "text-primary-500 bg-primary-50 dark:bg-primary-900/20"; actionText = "followed you"; }
                        if (notif.type === 'comment') { Icon = MessageCircle; iconColor = "text-blue-500 bg-blue-50 dark:bg-blue-900/20"; actionText = "commented on your post"; }
                        if (notif.type === 'mention') { Icon = AtSign; iconColor = "text-purple-500 bg-purple-50 dark:bg-purple-900/20"; actionText = "mentioned you"; }

                        return (
                            <Link
                                to={`/profile/${notif.triggeredBy.username}`}
                                key={notif._id}
                                className={`flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!notif.read ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700' : 'opacity-80'}`}
                            >
                                <div className={`p-3 rounded-full ${iconColor}`}>
                                    <Icon size={20} className={notif.type === 'like' ? 'fill-current' : ''} />
                                </div>
                                <div className="flex-1 mt-1">
                                    <p className="text-gray-900 dark:text-gray-100">
                                        <span className="font-bold hover:underline">{notif.triggeredBy.username}</span> {actionText}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Notifications;
