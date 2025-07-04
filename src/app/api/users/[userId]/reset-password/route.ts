import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();

    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;
    const body = await request.json();
    const { password } = body;

    // Validate required fields
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: 'Password reset successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
