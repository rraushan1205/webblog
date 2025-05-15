import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Adjust the import path based on your project structure
const prisma = new PrismaClient();
export async function GET() {
    try {
        // Fetch the count of users and posts from the database
        const userCount = await prisma.user.count();
        const postCount = await prisma.post.count();

        // Return the counts as a JSON response
        return NextResponse.json({
            userCount,
            postCount,
        });
    } catch (error) {
        console.error('Error fetching counts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch counts' },
            { status: 500 }
        );
    }
}