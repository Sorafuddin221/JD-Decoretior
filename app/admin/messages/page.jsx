'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, sendMessage, receiveMessage } from '@/features/chat/chatSlice';
import Pusher from 'pusher-js';
import { Send, Person } from '@mui/icons-material';
import Loader from '@/components/Loader';
import '@/AdminStyles/ChatPanel.css';

const AdminChatPage = () => {
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [fetchingUsers, setFetchingUsers] = useState(true);
    
    const { user: adminUser } = useSelector((state) => state.user);
    const { messages, loading: chatLoading } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const chatEndRef = useRef(null);

    // Fetch list of users who have chatted
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/chat/users');
                const data = await res.json();
                if (data.success) {
                    setChatUsers(data.users);
                }
            } catch (error) {
                console.error("Error fetching chat users:", error);
            } finally {
                setFetchingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    // Fetch history when a user is selected
    useEffect(() => {
        if (selectedUser) {
            dispatch(fetchChatHistory(selectedUser._id));
        }
    }, [dispatch, selectedUser]);

    // Real-time listener for Admin
    useEffect(() => {
        if (adminUser) {
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
            });

            const channel = pusher.subscribe(`chat-${adminUser._id}`);
            channel.bind('new-message', (data) => {
                // If it's a message from a user (not admin), add it
                if (!data.message.isAdmin) {
                    // If the message is from the currently selected user, update chat
                    if (selectedUser && data.message.sender === selectedUser._id) {
                        dispatch(receiveMessage(data.message));
                    }
                    // Refresh user list to show last message
                    // (Omitted for brevity, but ideally you'd update chatUsers state)
                }
            });

            return () => {
                pusher.unsubscribe(`chat-${adminUser._id}`);
            };
        }
    }, [dispatch, adminUser, selectedUser]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (messageInput.trim() && selectedUser) {
            dispatch(sendMessage({
                receiverId: selectedUser._id,
                message: messageInput,
                isAdmin: true
            }));
            setMessageInput('');
        }
    };

    return (
        <div className="admin-chat-container">
            <div className="users-list-panel">
                <h2>Recent Chats</h2>
                {fetchingUsers ? <Loader /> : (
                    <div className="users-scroll">
                        {chatUsers.map((u) => (
                            <div 
                                key={u._id} 
                                className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                <div className="user-avatar"><Person /></div>
                                <div className="user-info">
                                    <div className="user-name">{u.name}</div>
                                    <div className="last-msg">{u.lastMessage}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="chat-main-panel">
                {selectedUser ? (
                    <>
                        <div className="chat-main-header">
                            <h3>Chatting with {selectedUser.name}</h3>
                        </div>
                        <div className="chat-main-messages">
                            {chatLoading ? <Loader /> : messages.map((msg, index) => (
                                <div key={index} className={`admin-msg ${msg.isAdmin ? 'sent' : 'received'}`}>
                                    <div className="admin-msg-bubble">{msg.message}</div>
                                    <span className="admin-msg-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="chat-main-input">
                            <input
                                type="text"
                                placeholder="Type your reply..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend}><Send /></button>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <ChatBubble style={{ fontSize: 60, color: '#ccc' }} />
                        <p>Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatPage;
