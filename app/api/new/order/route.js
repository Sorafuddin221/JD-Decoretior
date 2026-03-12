import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Order from '@/models/orderModel';
import Product from '@/models/productModel';
import PaymentSettings from '@/models/paymentSettingsModel';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError'; // Correct import

import { getAvailableStock } from '@/utils/availability';

export const POST = handleAsyncError(async (request) => {
    await db(); // Connect to DB

    const authResult = await verifyUserAuth(request);
    if (!authResult.isAuthenticated) {
        return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
    }
    const user = authResult.user;

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        startDate,
        endDate,
        totalDays,
        securityDepositTotal,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = await request.json(); // Use request.json()

    // 1. Check availability for each item in the date range
    for (const item of orderItems) {
        const available = await getAvailableStock(item.product, startDate, endDate);
        if (available < item.quantity) {
            return NextResponse.json({ 
                message: `Sorry, only ${available} units of '${item.name}' are available for the selected dates.` 
            }, { status: 400 });
        }
    }

    const order = await Order.create({
        shippingInfo: {
            ...shippingInfo,
            thana: shippingInfo.thana
        },
        orderItems,
        paymentInfo: {
            id: paymentInfo.id,
            status: paymentInfo.status || (paymentInfo.method === 'cod' ? 'Processing' : 'Pending Verification'),
            method: paymentInfo.method || 'cod',
            bkashNumber: paymentInfo.bkashNumber,
            trxID: paymentInfo.trxID,
            paidAmount: Number(paymentInfo.paidAmount) || 0
        },
        startDate,
        endDate,
        totalDays: totalDays || 1,
        securityDepositTotal: securityDepositTotal || 0,
        itemPrice: itemPrice || 0,
        taxPrice: taxPrice || 0,
        shippingPrice: shippingPrice || 0,
        totalPrice: totalPrice || 0,
        paidAt: paymentInfo.method === 'bkash' ? Date.now() : undefined,
        user: user._id,
    });

    // We no longer decrease product.stock permanently.
    // Stock availability is now calculated on-the-fly based on date range.

    return NextResponse.json({
        success: true,
        order: JSON.parse(JSON.stringify(order)),
    }, { status: 201 });
});