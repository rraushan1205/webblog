import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );}
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    
        return NextResponse.json({ message: 'User created successfully', user}, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error},
            { status: 500 }
        );
    }
}