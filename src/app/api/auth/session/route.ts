
import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeAdminApp } from '@/lib/firebase/server';

const ADMIN_UIDS = (process.env.NEXT_PUBLIC_ADMIN_UIDS || '').split(',');

export async function GET(request: NextRequest) {
  try {
    const adminApp = initializeAdminApp();
    if (!adminApp) {
      console.error('Firebase Admin SDK not configured.');
      return NextResponse.json({ error: 'Firebase Admin SDK not configured. Please check server logs.' }, { status: 500 });
    }
    
    const sessionCookie = request.cookies.get('__session')?.value || '';

    if (!sessionCookie) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true);
    
    if (!ADMIN_UIDS.includes(decodedClaims.uid)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('Session validation error:', error);
    const message = error instanceof Error ? error.message : 'Authentication error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
