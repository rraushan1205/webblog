import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'asc' },
            select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                name: true,
                },
            },
            },
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}