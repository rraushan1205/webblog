import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Delete all posts by the user first
        await prisma.post.deleteMany({
            where: { authorId: id }
        });

        // Then delete the user
        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
