import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import crypto from 'crypto';
import HandleError from '@/utils/handleError';

export async function POST(req, { params }) {
    await connectMongoDatabase();
    const resolvedParams = await Promise.resolve(params); // Ensure params is resolved
    const { token } = resolvedParams;

    try {
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: "The password reset token is invalid or has expired. Please request a new one." }, { status: 400 });
        }

        const { password, confirmPassword } = await req.json();

        if (password !== confirmPassword) {
            return NextResponse.json({ message: "The password and confirmation password do not match. Please ensure they are identical." }, { status: 400 });
        }

        user.password = password; // Mongoose pre-save hook will hash it
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Your password has been successfully updated.",
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `An unexpected error occurred while resetting your password: ${error.message}. Please try again.` }, { status: 500 });
    }
}
