import { io } from 'socket.io-client';

const URL = import.meta.env.PROD ? window.location.origin : 'http://localhost:5000';

export const socket = io(URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'],
});

export const connectSocket = (userId) => {
    if (!userId) return;

    const userIdString = userId.toString();
    const isSameUserConnection = socket.connected && socket.auth?.userId === userIdString;

    if (isSameUserConnection) return;

    socket.auth = { userId: userIdString };

    if (socket.connected) {
        socket.disconnect();
    }

    socket.connect();
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
