import { NextResponse } from 'next/server';

export async function POST() {
    // Clear the authentication token or session
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('authToken', '', { httpOnly: true, maxAge: 0 });

    return response;
}