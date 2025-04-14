import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secret = '$ecret&key';
const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User creation failed' },
                { status: 500 }
            );
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id}, secret, { expiresIn: '1h' });

        // Set token as a cookie
        const response = NextResponse.json(
            { message: 'User created successfully', user },
            { status: 201 }
        );
        response.headers.set(
            'Set-Cookie',
            `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
        );

        return response;
    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 }
        );
    }
}