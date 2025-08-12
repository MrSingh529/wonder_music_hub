
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('__session', '', {
        expires: new Date(0),
        path: '/',
    });
    return response;
}
