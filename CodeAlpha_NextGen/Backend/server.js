import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

// Connect Database
connectDB();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
}));

// Setup Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

const connectedUsers = new Map();
const getOnlineUserIds = () => Array.from(connectedUsers.keys());

app.set('io', io);

// Socket.io connection logic
io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;

    if (userId) {
        const userIdString = userId.toString();
        if (!connectedUsers.has(userIdString)) {
            connectedUsers.set(userIdString, new Set());
        }

        connectedUsers.get(userIdString).add(socket.id);
        socket.join(userIdString);
        io.emit('onlineUsers', getOnlineUserIds());
    }

    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        if (userId) {
            const userIdString = userId.toString();
            const sockets = connectedUsers.get(userIdString);

            if (sockets) {
                sockets.delete(socket.id);
                if (sockets.size === 0) {
                    connectedUsers.delete(userIdString);
                }
            }

            io.emit('onlineUsers', getOnlineUserIds());
        }

        console.log(`User disconnected: ${socket.id}`);
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running...' });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
