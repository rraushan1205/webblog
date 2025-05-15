import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import logger from '@/utils/logger';

const prisma = new PrismaClient();
const JWT_SECRET = '$ecret&key'; // this secret key is mock key, it would be changed in production
// In production, use a more secure key and store it in an environment variable

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            logger.error('Email and password are required', { email, timestamp: new Date() });
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const getuser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!getuser) {
            logger.error('User not found', { email, timestamp: new Date() });
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, getuser.password);

        if (!isPasswordValid) {
            logger.error('Invalid credentials', { email, timestamp: new Date() });
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT
        // it will expire in 1 hour after login
        // this token will be used to authenticate the user in the next requests
        // it will be stored in the cookie
        // the cookie will be sent to the client
        // the client will send the cookie in the next requests
        // the server will verify the token and authenticate the user
        const token = jwt.sign({ id: getuser.id, email: getuser.email }, JWT_SECRET, { expiresIn: '1h' });

        // Set cookie
        const cookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 3600, // 1 hour
        });

        const response = NextResponse.json({ message: 'Login successful', getuser }, { status: 200 });
        response.headers.set('Set-Cookie', cookie);
        logger.info('User logged in successfully', { email: getuser.email, timestamp: new Date() });
        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Error during login', { error: errorMessage, timestamp: new Date() });
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}