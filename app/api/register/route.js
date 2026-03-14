import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import { sendToken } from '@/utils/jwtToken';
import cloudinary from '@/lib/cloudinary';
import HandleError from '@/utils/handleError';

export async function POST(req) {
    await connectMongoDatabase();

    try {
        const formData = await req.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const avatarFile = formData.get('avatar');

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Please fill in all the required fields." }, { status: 400 });
        }

        let avatar = {
            public_id: "default_avatar",
            url: "https://res.cloudinary.com/demo/image/upload/d_avatar.png/avatar.png" // Placeholder or leave empty if your frontend handles it
        };

        // Upload avatar to Cloudinary if provided
        if (avatarFile && avatarFile.size > 0) {
            const arrayBuffer = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload the buffer to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    folder: 'avatars',
                    crop: 'scale'
                }, (error, uploadResult) => {
                    if (error) {
                        return reject(new HandleError("Cloudinary upload failed", 500));
                    }
                    resolve(uploadResult);
                }).end(buffer);
            });

            avatar = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }
        
        const user = await User.create({
            name,
            email,
            password,
            avatar,
        });

        const { token, cookieOptions } = sendToken(user, 201);

        const response = NextResponse.json({
            success: true,
            user: JSON.parse(JSON.stringify(user)),
            token,
        }, { status: 201 });

        response.cookies.set('token', token, cookieOptions);

        return response;

    } catch (error) {
        // Handle specific Mongoose errors, e.g., duplicate email
        if (error.code === 11000) {
            return NextResponse.json({ message: "An account with this email address already exists. Please try logging in instead." }, { status: 400 });
        }
        return NextResponse.json({ message: `An unexpected error occurred during registration: ${error.message}. Please try again.` }, { status: 500 });
    }
}
