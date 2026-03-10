import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Chat from '@/models/chatModel';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError';

export const GET = handleAsyncError(async (request, { params }) => {
    await db();
    const { userId } = await params;
    
    const authResult = await verifyUserAuth(request);
    if (!authResult.isAuthenticated) {
        return NextResponse.json({ message: "Login first" }, { status: 401 });
    }

    // Fetch messages where user is either sender or receiver
    // This assumes all chats are between User and Admin
    const messages = await Chat.find({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    }).sort({ createdAt: 1 });

    return NextResponse.json({
        success: true,
        messages
    });
});
