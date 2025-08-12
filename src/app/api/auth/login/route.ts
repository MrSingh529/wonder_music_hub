
import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeAdminApp } from '@/lib/firebase/server';

export async function POST(request: NextRequest) {
    try {
        const adminApp = initializeAdminApp();
        if (!adminApp) {
          return NextResponse.json({ error: "Firebase Admin SDK not configured." }, { status: 500 });
        }
        
        const { idToken } = await request.json();
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });
        
        const response = NextResponse.json({ status: 'success' });
        response.cookies.set('__session', sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: expiresIn,
            path: '/',
        });
        return response;

    } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
        return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
}
