import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Chat from '@/models/chatModel';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError';

export const PUT = handleAsyncError(async (request, { params }) => {
    await db();
    const { userId } = await params;
    
    const authResult = await verifyUserAuth(request);
    if (!authResult.isAuthenticated) {
        return NextResponse.json({ message: "Login first" }, { status: 401 });
    }

    const adminId = authResult.user._id;

    // Mark messages from the user to the admin as read
    await Chat.updateMany(
        { sender: userId, receiver: adminId, isRead: false },
        { $set: { isRead: true } }
    );

    return NextResponse.json({
        success: true,
        message: "Messages marked as read"
    });
});
