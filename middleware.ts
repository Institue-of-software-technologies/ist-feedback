// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(function middleware(req) {
    const token = req.nextauth.token;

    // If there is no session or token, redirect to the login page
    if (!token) {
        return NextResponse.redirect(new URL('/(auth)/login', req.url));  // Correct path for the login page under the (auth) layout
    }

    return NextResponse.next();
}, {
    pages: {
        signIn: '/(auth)/login', // Ensure this matches the path to your login page
    },
});

export const config = {
    matcher: ['/dashboard/:path*', '/api/protected/:path*'], // Protect specific routes or APIs
};
