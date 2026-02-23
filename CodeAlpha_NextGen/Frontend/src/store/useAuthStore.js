import { create } from 'zustand';
import axios from '../api/axios';
import { connectSocket, disconnectSocket } from '../utils/socket';

const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            // Suppose we have an endpoint to check current user from token
            // A simple /api/users/me or /api/auth/me could do this. We'll use profile if we implement it,
            // For now, let's setup the structure.
            set({ isCheckingAuth: true });
            const res = await axios.get('/auth/me');
            set({ authUser: res.data });
            connectSocket(res.data?._id);
        } catch (error) {
            console.log("Error in checkAuth");
            disconnectSocket();
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const res = await axios.post('/auth/login', credentials);
            set({ authUser: res.data });
            connectSocket(res.data?._id);
            return res.data;
        } catch (error) {
            console.log("Error during login", error);
            throw error;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axios.post('/auth/logout');
            disconnectSocket();
            set({ authUser: null });
        } catch (error) {
            console.log("Error during logout", error);
        }
    },

    updateProfile: async (profileData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axios.post('/users/update', profileData);
            set({ authUser: res.data });
            return res.data;
        } catch (error) {
            console.log("Error updating profile", error);
            throw error;
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
}));

export default useAuthStore;
