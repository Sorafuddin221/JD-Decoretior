import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Chat from '@/models/chatModel';
import Pusher from 'pusher';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError';

// Initialize Pusher (Credentials will be in .env)
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

export const POST = handleAsyncError(async (request) => {
    await db();
    const authResult = await verifyUserAuth(request);
    if (!authResult.isAuthenticated) {
        return NextResponse.json({ message: "Login first to chat" }, { status: 401 });
    }

    const { receiverId, message, isAdmin } = await request.json();
    const senderId = authResult.user._id;

    // Save message to MongoDB
    const newMessage = await Chat.create({
        sender: senderId,
        receiver: receiverId,
        message,
        isAdmin: isAdmin || false,
    });

    // Trigger Pusher for real-time update
    // Channel name is the receiver's ID so they only get their own messages
    await pusher.trigger(`chat-${receiverId}`, 'new-message', {
        message: newMessage,
    });

    return NextResponse.json({
        success: true,
        message: newMessage
    }, { status: 201 });
});
