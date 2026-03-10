import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Chat from '@/models/chatModel';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError';

export const GET = handleAsyncError(async (request) => {
    await db();
    const authResult = await verifyUserAuth(request);
    
    if (!authResult.isAuthenticated || authResult.user.role !== 'admin') {
        return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    // Find unique users who have messaged or received messages
    const users = await Chat.aggregate([
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$isAdmin", false] },
                        "$sender",
                        "$receiver"
                    ]
                },
                lastMessage: { $last: "$message" },
                lastTimestamp: { $last: "$createdAt" }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        { $unwind: '$userDetails' },
        {
            $project: {
                _id: 1,
                lastMessage: 1,
                lastTimestamp: 1,
                name: '$userDetails.name',
                email: '$userDetails.email'
            }
        },
        { $sort: { lastTimestamp: -1 } }
    ]);

    return NextResponse.json({
        success: true,
        users
    });
});
