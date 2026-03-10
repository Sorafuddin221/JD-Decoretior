'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, sendMessage, receiveMessage } from '@/features/chat/chatSlice';
import Pusher from 'pusher-js';
import { Send, ChatBubble, Close } from '@mui/icons-material';
import '@/componentStyles/ChatBox.css';

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { messages } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const chatEndRef = useRef(null);

    // Hardcoded Admin ID for demo - you should ideally fetch this or use a fixed one
    const ADMIN_ID = '67cc32644268e0d5a3746c18'; // Replace with a real admin ID from your DB

    useEffect(() => {
        if (isAuthenticated && user && isOpen) {
            dispatch(fetchChatHistory(user._id));
        }
    }, [dispatch, isAuthenticated, user, isOpen]);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Initialize Pusher Client
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
            });

            const channel = pusher.subscribe(`chat-${user._id}`);
            channel.bind('new-message', (data) => {
                // If the message is from Admin, add it to our state
                if (data.message.isAdmin) {
                    dispatch(receiveMessage(data.message));
                }
            });

            return () => {
                pusher.unsubscribe(`chat-${user._id}`);
            };
        }
    }, [dispatch, isAuthenticated, user]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (messageInput.trim()) {
            dispatch(sendMessage({
                receiverId: ADMIN_ID,
                message: messageInput,
                isAdmin: false
            }));
            setMessageInput('');
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className={`chat-box-container ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chat-bubble-btn" onClick={() => setIsOpen(true)}>
                    <ChatBubble />
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Chat with Admin</h3>
                        <button onClick={() => setIsOpen(false)}><Close /></button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.isAdmin ? 'admin' : 'user'}`}>
                                <div className="message-content">{msg.message}</div>
                                <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}><Send /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
