import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import bcrypt from 'bcrypt';

export async function PATCH(request: NextRequest) {
  try {
    // Extract and validate bearer token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'MISSING_TOKEN' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Validate session and get user
    const userSession = await db.session.findUnique({
      where: { token }
    });

    if (!userSession) {
      return NextResponse.json(
        { error: 'Invalid session', code: 'INVALID_SESSION' },
        { status: 401 }
      );
    }

    // Check if session is expired
    if (new Date(userSession.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired', code: 'SESSION_EXPIRED' },
        { status: 401 }
      );
    }

    // Get user details
    const authenticatedUser = await db.user.findUnique({
      where: { id: userSession.userId }
    });

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate currentPassword
    if (!currentPassword || typeof currentPassword !== 'string' || currentPassword.trim() === '') {
      return NextResponse.json(
        { error: 'Current password is required', code: 'MISSING_CURRENT_PASSWORD' },
        { status: 400 }
      );
    }

    // Validate newPassword
    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: 'New password is required', code: 'MISSING_NEW_PASSWORD' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long', code: 'PASSWORD_TOO_SHORT' },
        { status: 400 }
      );
    }

    // Check if new password is different from current password
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password', code: 'PASSWORD_UNCHANGED' },
        { status: 400 }
      );
    }

    // Query account table for credential account
    const userAccount = await db.account.findFirst({
      where: {
        userId: authenticatedUser.id,
        providerId: 'credential'
      }
    });

    if (!userAccount || !userAccount.password) {
      return NextResponse.json(
        { 
          error: 'No password set for this account. Use email verification to set password.', 
          code: 'NO_PASSWORD_SET' 
        },
        { status: 400 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, userAccount.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect', code: 'INVALID_CURRENT_PASSWORD' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update account with new password
    await db.account.update({
      where: { id: userAccount.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    // Invalidate all other sessions for security
    await db.session.deleteMany({
      where: {
        userId: authenticatedUser.id,
        NOT: { token }
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password changed successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('PATCH /api/change-password error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}