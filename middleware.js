import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify from jose

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the current path is an admin path
  const isAdminPath = pathname.startsWith('/admin/');

  // If it's not an admin path, let the request proceed
  if (!isAdminPath) {
    return NextResponse.next();
  }

  // Get the token from the cookie
  const token = request.cookies.get('token')?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Optional: redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Get the secret key, ensure it's a Uint8Array for jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'fallback-secret-key');
    
    // Verify the token using jose
    const { payload } = await jwtVerify(token, secret);

    // Check if the decoded token has a role and if it's 'admin'
    if (payload.role === 'admin') {
      return NextResponse.next(); // Allow admin to proceed
    } else {
      // If not admin, redirect to access denied
      const accessDeniedUrl = new URL('/access-denied', request.url);
      return NextResponse.redirect(accessDeniedUrl);
    }
  } catch (error) {
    console.error('JWT verification failed with jose:', error);
    // If token is invalid or expired, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Config specifies which paths the middleware should run on
export const config = {
  matcher: ['/admin/:path*'], // Apply to all admin paths only
};
