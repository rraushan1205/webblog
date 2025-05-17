import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'; // Changed to NextRequest
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import logger from '@/utils/logger';

const prisma = new PrismaClient();
const JWT_SECRET = '$ecret&key'; 

function getClientIP(req: NextRequest): string {
	const forwarded = req.headers.get('x-forwarded-for');
	return forwarded?.split(',')[0].trim() || 'IP Not Found';
}

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIP(request);
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            logger.error('Email and password are required', { email, ip, timestamp: new Date() });
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const getuser = await prisma.user.findUnique({
            where: { email },
        });

        if (!getuser) {
            logger.error('User not found', { email, ip, timestamp: new Date() });
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, getuser.password);

        if (!isPasswordValid) {
            logger.error('Invalid credentials', { email, ip, timestamp: new Date() });
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ id: getuser.id, email: getuser.email }, JWT_SECRET, { expiresIn: '1h' });

        const cookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 3600,
        });

        const response = NextResponse.json({ message: 'Login successful', getuser }, { status: 200 });
        response.headers.set('Set-Cookie', cookie);

        logger.info('User logged in successfully', {
            id: getuser.id,
            email: getuser.email,
            ip,
            timestamp: new Date()
        });

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Error during login', { error: errorMessage, timestamp: new Date() });
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
