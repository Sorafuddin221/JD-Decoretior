import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/userModels';

export const verifyUserAuth = async (req) => {
    try {
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return {
                isAuthenticated: false,
                error: new Error('Please sign in to access this protected resource.'),
                statusCode: 401
            };
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decodedData.id).select('+password');

        if (!user) {
            return {
                isAuthenticated: false,
                error: new Error('User account not found. Please try signing in again.'),
                statusCode: 404
            };
        }
        return {
            isAuthenticated: true,
            user: user, // Return the Mongoose document directly
            error: null,
            statusCode: 200
        };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                isAuthenticated: false,
                error: new Error('Your session has expired. Please sign in again to continue.'),
                statusCode: 401
            };
        }
        if (error.name === 'JsonWebTokenError') {
            return {
                isAuthenticated: false,
                error: new Error('Authentication error. Please sign in again.'),
                statusCode: 401
            };
        }
        return {
            isAuthenticated: false,
            error: error,
            statusCode: 500
        };
    }
};

export const roleBasedAccess = (roles) => (req, user) => {
    if (!roles.includes(user.role)) {
        return {
            hasAccess: false,
            error: new Error(`Role: ${user.role} is not allowed to access this resource.`),
            statusCode: 403
        };
    }
    return {
        hasAccess: true,
        error: null,
        statusCode: 200
    };
};
