import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient()
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
    
        const getuser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!getuser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Perform authentication logic (e.g., check credentials in the database)

        const isPasswordValid = await bcrypt.compare(password, getuser.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Return success response (e.g., token or user data)
        const data = { message: 'Login successful', token: 'example-token', getuser };
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}