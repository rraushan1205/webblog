import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {authorId, title, content } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
        }
        const newPost = {
            title,
            content,
            author: {
                connect: { id: authorId } 
            }
        };
        await prisma.post.create({
            data: newPost
        });
        return NextResponse.json({ message: 'Post created successfully.', post: newPost }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
    }
}