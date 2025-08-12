
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('__session')?.value || '';

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const url = request.nextUrl.clone()
    url.pathname = '/api/auth/session';

    // Call the internal API to validate the session
    const response = await fetch(url, {
      headers: {
        'Cookie': `__session=${sessionCookie}`
      }
    });

    // If the session is not valid, redirect to login
    if (response.status !== 200) {
        const loginUrl = new URL('/login', request.url);
        const data = await response.json().catch(() => ({ error: 'Authentication error' }));
        loginUrl.searchParams.set('error', data.error || 'unauthorized');
        return NextResponse.redirect(loginUrl);
    }
    
    // Session is valid, continue
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
