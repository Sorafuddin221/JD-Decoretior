'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, sendMessage, receiveMessage, markMessagesAsRead } from '@/features/chat/chatSlice';
import Pusher from 'pusher-js';
import { Send, Person, ChatBubble } from '@mui/icons-material';
import Loader from '@/components/Loader';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import '@/AdminStyles/ChatPanel.css';
import '@/AdminStyles/Dashboard.css';

const AdminChatPage = () => {
    const router = useRouter();
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [fetchingUsers, setFetchingUsers] = useState(true);
    
    const { user: adminUser, loading: userLoading } = useSelector((state) => state.user);
    const { messages, loading: chatLoading } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const chatEndRef = useRef(null);

    // Protection: If not admin, redirect
    useEffect(() => {
        if (!userLoading && (!adminUser || adminUser.role !== 'admin')) {
            router.push('/login?redirect=/admin/messages');
        }
    }, [adminUser, userLoading, router]);

    const handleUserSelect = (u) => {
        setSelectedUser(u);
        // Clear unread status in the user list locally
        setChatUsers(prevUsers => 
            prevUsers.map(user => 
                user._id === u._id ? { ...user, unreadCount: 0 } : user
            )
        );
        // Mark messages as read in DB
        dispatch(markMessagesAsRead(u._id));
    };

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
                if (!data.message.isAdmin) {
                    const senderId = data.message.sender;
                    
                    // Play notification sound
                    const audio = new Audio('/images/notification.mp3');
                    audio.play().catch(e => console.log("Audio play blocked by browser"));

                    if (selectedUser && senderId === selectedUser._id) {
                        dispatch(receiveMessage(data.message));
                        // If chat is open, mark the new message as read in DB
                        dispatch(markMessagesAsRead(senderId));
                    }
                    
                    // Update user list: Move sender to top, update last message and unread count
                    setChatUsers(prevUsers => {
                        const existingUserIndex = prevUsers.findIndex(u => u._id === senderId);
                        let updatedUsers = [...prevUsers];

                        if (existingUserIndex !== -1) {
                            // User exists
                            const existingUser = updatedUsers[existingUserIndex];
                            const isCurrentlySelected = selectedUser && senderId === selectedUser._id;
                            
                            const user = { 
                                ...existingUser, 
                                lastMessage: data.message.message,
                                unreadCount: isCurrentlySelected ? 0 : (existingUser.unreadCount || 0) + 1
                            };
                            
                            updatedUsers.splice(existingUserIndex, 1);
                            updatedUsers.unshift(user);
                        } else {
                            // New user refresh
                            fetch('/api/admin/chat/users')
                                .then(res => res.json())
                                .then(data => { if(data.success) setChatUsers(data.users) });
                        }
                        return updatedUsers;
                    });
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
        <div className="dashboard-container">
            <AdminSidebar />
            <div className="main-content">
                <div className="admin-chat-container">
                    <div className="users-list-panel">
                        <h2>Recent Chats</h2>
                        {fetchingUsers ? <Loader /> : (
                            <div className="users-scroll">
                                {chatUsers.map((u) => (
                                    <div 
                                        key={u._id} 
                                        className={`user-item ${selectedUser?._id === u._id ? 'active' : ''} ${u.unreadCount > 0 ? 'unread' : ''}`}
                                        onClick={() => handleUserSelect(u)}
                                    >
                                        <div className="user-avatar">
                                            <Person />
                                            {u.unreadCount > 0 && <span className="unread-dot"></span>}
                                        </div>
                                        <div className="user-info">
                                            <div className="user-name">
                                                {u.name}
                                                {u.unreadCount > 0 && <span className="new-badge">NEW</span>}
                                            </div>
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
                                        <div key={index} className={`admin-msg ${msg.isAdmin ? 'sent' : 'received'} ${!msg.isAdmin && !msg.isRead ? 'new-unread' : ''}`}>
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
            </div>
        </div>
    );
};

export default AdminChatPage;
