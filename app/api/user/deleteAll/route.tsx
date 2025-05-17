import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE() {
    try {
        const result = await prisma.user.deleteMany();

        if (result.count === 0) {
            return NextResponse.json({ message: 'No users found to delete.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Users deleted successfully', deletedCount: result.count });
    } catch (error) {
        console.error('Error deleting users:', error);
        return NextResponse.json({ error: 'Failed to delete users' }, { status: 500 });
    }
}
