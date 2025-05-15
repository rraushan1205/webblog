import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

interface EditPostRequest {
    id: string;
    title?: string;
    content?: string;
}

export async function PUT(req: Request) {
    try {
        const body: EditPostRequest = await req.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        // Simulate fetching the post from a database
        const post = await getPostById(body.id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Update the post fields if provided
        if (body.title) post.title = body.title;
        if (body.content) post.content = body.content;

        // Simulate saving the updated post to the database
        const updatedPost = await savePost(post);

        return NextResponse.json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// Mock database functions
async function getPostById(id: string) {
    
    const posts = await prisma.post.findUnique({
        where: {
            id: id,
        },
    });
    if (!posts) {
        return null;
    }
    return posts;
}

async function savePost(post: any) {
    const updatedPost = await prisma.post.update({
        where: {
            id: post.id,
        },
        data: {
            title: post.title,
            content: post.content,
        },
    });
    return updatedPost;
}