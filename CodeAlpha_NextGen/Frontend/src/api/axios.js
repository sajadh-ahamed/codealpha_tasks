import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global error responses, e.g trigger a toast notification layout
        console.error("API error", error.response?.data?.error || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
