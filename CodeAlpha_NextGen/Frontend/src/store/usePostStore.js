import { create } from 'zustand';
import axios from '../api/axios';

const usePostStore = create((set, get) => ({
    posts: [],
    isLoading: false,

    getFeedPosts: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get('/posts/all');
            set({ posts: res.data });
        } catch (error) {
            console.error("Error in getFeedPosts", error);
        } finally {
            set({ isLoading: false });
        }
    },

    createPost: async (postData) => {
        try {
            const res = await axios.post('/posts/create', postData);
            set({ posts: [res.data, ...get().posts] });
        } catch (error) {
            console.error("Error in createPost", error);
            throw error;
        }
    },

    likeUnlikePost: async (postId) => {
        try {
            await axios.post(`/posts/like/${postId}`);
            // Optimistic update should be handled in the component
        } catch (error) {
            console.error("Error in likeUnlikePost", error);
            throw error;
        }
    },

    deletePost: async (postId) => {
        try {
            await axios.delete(`/posts/${postId}`);
            set({ posts: get().posts.filter(p => p._id !== postId) });
        } catch (error) {
            console.error("Error in deletePost", error);
            throw error;
        }
    }
}));

export default usePostStore;
