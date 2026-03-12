import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import { getAvailableStock } from '@/utils/availability';
import handleAsyncError from '@/middleware/handleAsyncError';

export const GET = handleAsyncError(async (req, { params }) => {
    await connectMongoDatabase();
    
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
        return NextResponse.json({ message: "Start and End dates are required" }, { status: 400 });
    }

    const available = await getAvailableStock(id, startDate, endDate);

    return NextResponse.json({
        success: true,
        availableStock: available
    }, { status: 200 });
});
