import Message from '../models/Message.js';
import User from '../models/User.js';

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: userToChatId },
                { sender: userToChatId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            { sender: userToChatId, receiver: senderId, read: false },
            { read: true }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, media } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text?.trim() && !media) {
            return res.status(400).json({ error: "Message must contain text or media" });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text: text?.trim(),
            media
        });

        await newMessage.save();

        const io = req.app.get('io');
        if (io) {
            io.to(receiverId.toString()).emit('newMessage', newMessage);
            io.to(senderId.toString()).emit('newMessage', newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const userIdString = userId.toString();

        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ createdAt: -1 });

        const conversationMap = new Map();

        messages.forEach((msg) => {
            const sender = msg.sender.toString();
            const receiver = msg.receiver.toString();
            const otherUserId = sender === userIdString ? receiver : sender;

            if (!conversationMap.has(otherUserId)) {
                conversationMap.set(otherUserId, {
                    latestMessage: msg,
                    unreadCount: 0
                });
            }

            if (receiver === userIdString && sender === otherUserId && !msg.read) {
                const convo = conversationMap.get(otherUserId);
                convo.unreadCount += 1;
            }
        });

        const userIds = Array.from(conversationMap.keys());

        const users = await User.find({ _id: { $in: userIds } }).select('username profilePic');

        const conversations = users.map((user) => {
            const convoData = conversationMap.get(user._id.toString());
            return {
                user,
                latestMessage: convoData?.latestMessage || null,
                unreadCount: convoData?.unreadCount || 0
            };
        }).sort((a, b) => {
            if (!a.latestMessage && !b.latestMessage) return 0;
            if (!a.latestMessage) return 1;
            if (!b.latestMessage) return -1;
            return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.log("Error in getConversations controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
