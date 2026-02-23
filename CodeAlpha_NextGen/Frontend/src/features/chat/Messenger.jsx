import React, { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import { Send, Image as ImageIcon, Search } from 'lucide-react';
import { socket } from '../../utils/socket';

const Messenger = () => {
    const { authUser } = useAuthStore();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);
    const selectedUserRef = useRef(selectedUser);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get('/messages/conversations');
            setConversations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/messages/${selectedUser._id}`);
                setMessages(res.data);
                fetchConversations();
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {
        const handleOnlineUsers = (userIds) => {
            setOnlineUserIds(userIds || []);
        };

        const handleNewMessage = (message) => {
            const senderId = typeof message.sender === 'object' ? message.sender?._id : message.sender;
            const receiverId = typeof message.receiver === 'object' ? message.receiver?._id : message.receiver;

            const activeUserId = selectedUserRef.current?._id?.toString();
            const myId = authUser?._id?.toString();

            const isMessageForOpenChat =
                activeUserId &&
                ((senderId?.toString() === activeUserId && receiverId?.toString() === myId) ||
                    (senderId?.toString() === myId && receiverId?.toString() === activeUserId));

            if (isMessageForOpenChat) {
                setMessages((prev) => [...prev, message]);
            }

            fetchConversations();
        };

        socket.on('onlineUsers', handleOnlineUsers);
        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('onlineUsers', handleOnlineUsers);
            socket.off('newMessage', handleNewMessage);
        };
    }, [authUser?._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() || !selectedUser || isSending) return;

        try {
            setIsSending(true);
            const payload = text.trim();
            const res = await axios.post(`/messages/send/${selectedUser._id}`, { text: payload });
            setMessages((prev) => [...prev, res.data]);
            setText('');
            fetchConversations();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const filteredConversations = conversations.filter((conv) =>
        conv.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isSelectedUserOnline = onlineUserIds.includes(selectedUser?._id);

    return (
        <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Conversations Sidebar */}
            <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-900 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.user._id}
                            onClick={() => setSelectedUser(conv.user)}
                            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedUser?._id === conv.user._id ? 'bg-primary-50 dark:bg-gray-700' : ''}`}
                        >
                            <div className="relative w-12 h-12 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full shrink-0 flex items-center justify-center text-white font-bold">
                                {conv.user.profilePic ? (
                                    <img src={conv.user.profilePic} className="w-full h-full rounded-full object-cover" alt="Pic" />
                                ) : conv.user.username[0].toUpperCase()}

                                {onlineUserIds.includes(conv.user._id) && (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{conv.user.username}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {conv.latestMessage?.text || 'Start a conversation'}
                                </p>
                            </div>

                            {conv.unreadCount > 0 && (
                                <span className="min-w-6 h-6 px-2 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </div>
                    ))}

                    {!filteredConversations.length && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 p-4">No conversations found.</p>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-800 z-10">
                        <button className="md:hidden text-primary-500 font-medium" onClick={() => setSelectedUser(null)}>
                            Back
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {selectedUser.username[0].toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{selectedUser.username}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{isSelectedUserOnline ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        {messages.map(msg => {
                            const senderId = typeof msg.sender === 'object' ? msg.sender?._id : msg.sender;
                            const isMe = senderId?.toString() === authUser?._id?.toString();
                            return (
                                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-200 dark:border-gray-700 shadow-sm'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <button type="button" className="text-gray-400 hover:text-primary-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ImageIcon size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder="Message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-full py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!text.trim() || isSending}
                            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 text-white p-2.5 rounded-full transition-colors shadow-md shadow-primary-500/30"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-8">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-500 mb-6 border-4 border-white dark:border-gray-800 shadow-xl">
                        <Send size={32} />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white mb-2">Your Messages</h2>
                    <p className="text-gray-500 dark:text-gray-400">Send private messages to a friend or group.</p>
                </div>
            )}
        </div>
    );
};

export default Messenger;
