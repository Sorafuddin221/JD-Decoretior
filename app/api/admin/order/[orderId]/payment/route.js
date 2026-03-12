import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Order from '@/models/orderModel';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';

export async function PUT(req, { params }) {
    await connectMongoDatabase();
    const { orderId } = await params;

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error?.message || "Auth failed" }, { status: 401 });
        }
        
        const user = authResult.user;
        const roleAccessResult = roleBasedAccess(['admin'])(req, user);
        if (!roleAccessResult.hasAccess) {
            return NextResponse.json({ message: "Admin access required" }, { status: 403 });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        const { status, paidAmount } = await req.json();
        
        if (!order.paymentInfo) {
            order.paymentInfo = {};
        }

        order.paymentInfo.status = status;
        if (paidAmount !== undefined) {
            order.paymentInfo.paidAmount = Number(paidAmount);
        }

        if (status === 'Paid') {
            order.paidAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });

        return NextResponse.json({
            success: true,
            order: JSON.parse(JSON.stringify(order)),
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating payment status:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
