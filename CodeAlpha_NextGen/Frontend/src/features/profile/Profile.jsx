import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import PostCard from '../feed/PostCard';
import { MapPin, Link as LinkIcon, Calendar, Loader } from 'lucide-react';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState('');
    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
        bio: '',
        profilePic: '',
        coverPic: ''
    });

    const isMyProfile = authUser?.username === username;
    const isFollowing = profile?.followers?.some(id => id?.toString() === authUser?._id?.toString());

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`/users/profile/${username}`);
                setProfile(res.data);
                setEditForm({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    bio: res.data.bio || '',
                    profilePic: res.data.profilePic || '',
                    coverPic: res.data.coverPic || ''
                });

                // Fetch their posts
                const postsRes = await axios.get('/posts/all'); // Usually we'd create a specific user posts endpoint
                const filtered = postsRes.data.filter(p => p.user._id === res.data._id);
                setUserPosts(filtered);
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();
        setEditError('');

        try {
            const updatedUser = await updateProfile(editForm);
            setProfile(updatedUser);
            setIsEditing(false);
            if (updatedUser.username && updatedUser.username !== username) {
                navigate(`/profile/${updatedUser.username}`);
            }
        } catch (error) {
            setEditError(error.response?.data?.error || 'Failed to update profile');
        }
    };

    const handleFollowToggle = async () => {
        if (!profile || isMyProfile || isUpdatingFollow) return;

        setIsUpdatingFollow(true);
        const currentFollowers = profile.followers || [];
        const nextFollowers = isFollowing
            ? currentFollowers.filter(id => id?.toString() !== authUser._id?.toString())
            : [...currentFollowers, authUser._id];

        setProfile(prev => ({ ...prev, followers: nextFollowers }));

        try {
            await axios.post(`/users/follow/${profile._id}`);
        } catch (error) {
            setProfile(prev => ({ ...prev, followers: currentFollowers }));
            console.error("Error following user", error);
        } finally {
            setIsUpdatingFollow(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center my-20">
                <Loader className="animate-spin text-primary-500 w-10 h-10" />
            </div>
        );
    }

    if (!profile) return <div className="text-center my-20 text-xl font-bold dark:text-white">User not found</div>;

    return (
        <div className="max-w-3xl mx-auto w-full pb-20">
            {/* Cover Image */}
            <div className="w-full h-48 md:h-64 rounded-b-2xl md:rounded-2xl overflow-hidden relative bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-sm">
                {profile.coverPic && (
                    <img src={profile.coverPic} alt="Cover" className="w-full h-full object-cover" />
                )}
            </div>

            {/* Profile Info */}
            <div className="px-4 relative -mt-16 md:-mt-20">
                <div className="flex justify-between items-end mb-4">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center p-1.5 shadow-md relative z-10">
                        {profile.profilePic ? (
                            <img src={profile.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                                {profile.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>

                    {isMyProfile ? (
                        <button
                            onClick={() => {
                                setEditError('');
                                setIsEditing((prev) => !prev);
                            }}
                            className="px-5 py-2 md:py-2.5 rounded-full border border-gray-300 dark:border-gray-600 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900 dark:text-gray-100 shadow-sm mb-2"
                        >
                            {isEditing ? 'Cancel' : 'Edit profile'}
                        </button>
                    ) : (
                        <button
                            onClick={handleFollowToggle}
                            disabled={isUpdatingFollow}
                            className="px-6 py-2 md:py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold transition-colors shadow-md shadow-primary-500/20 mb-2"
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>

                {isMyProfile && isEditing && (
                    <form onSubmit={handleSaveProfile} className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3">
                        {editError && (
                            <p className="text-sm text-red-500">{editError}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                name="username"
                                value={editForm.username}
                                onChange={handleEditChange}
                                placeholder="Username"
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                            />
                            <input
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                                type="email"
                                placeholder="Email"
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                            />
                        </div>

                        <textarea
                            name="bio"
                            value={editForm.bio}
                            onChange={handleEditChange}
                            rows={3}
                            placeholder="Bio"
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                        />

                        <input
                            name="profilePic"
                            value={editForm.profilePic}
                            onChange={handleEditChange}
                            placeholder="Profile image URL"
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                        />
                        <input
                            name="coverPic"
                            value={editForm.coverPic}
                            onChange={handleEditChange}
                            placeholder="Cover image URL"
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                        />

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isUpdatingProfile}
                                className="px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold"
                            >
                                {isUpdatingProfile ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{profile.username}</h1>
                    <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>

                    <p className="mt-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{profile.bio || 'NextGen Social enthusiast.'}</p>

                    <div className="flex flex-wrap gap-4 mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                        <div className="flex items-center gap-1.5"><MapPin size={16} /> Global</div>
                        <div className="flex items-center gap-1.5"><LinkIcon size={16} /> nextgen.social</div>
                        <div className="flex items-center gap-1.5"><Calendar size={16} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="flex gap-6 mt-4">
                        <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                            <span className="font-bold text-gray-900 dark:text-white">{profile.following.length}</span> <span className="text-gray-500 dark:text-gray-400">Following</span>
                        </div>
                        <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                            <span className="font-bold text-gray-900 dark:text-white">{profile.followers.length}</span> <span className="text-gray-500 dark:text-gray-400">Followers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                <div className="flex-1 text-center py-4 font-bold text-gray-900 dark:text-white border-b-4 border-primary-500 cursor-pointer">
                    Posts
                </div>
                <div className="flex-1 text-center py-4 font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors">
                    Replies
                </div>
                <div className="flex-1 text-center py-4 font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors">
                    Media
                </div>
                <div className="flex-1 text-center py-4 font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors">
                    Likes
                </div>
            </div>

            {/* User's Posts */}
            <div className="space-y-4 px-2">
                {userPosts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Profile;
