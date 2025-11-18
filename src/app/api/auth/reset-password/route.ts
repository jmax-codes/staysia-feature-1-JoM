import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validate request body
    if (!token || typeof token !== 'string' || token.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Token is required',
          code: 'MISSING_TOKEN' 
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { 
          error: 'Password is required',
          code: 'MISSING_PASSWORD' 
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { 
          error: 'Password must be at least 8 characters',
          code: 'PASSWORD_TOO_SHORT' 
        },
        { status: 400 }
      );
    }

    // Query verification table for valid token
    const currentTimestamp = new Date();
    const verificationRecord = await db.verification.findFirst({
      where: {
        value: token,
        identifier: { startsWith: 'password-reset:' },
        expiresAt: { gt: currentTimestamp }
      }
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN' 
        },
        { status: 400 }
      );
    }

    // Extract email from identifier (format: "password-reset:{email}")
    const email = verificationRecord.identifier.replace('password-reset:', '');

    // Query user table to get user by email
    const foundUser = await db.user.findUnique({
      where: { email }
    });

    if (!foundUser) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Hash new password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Query account table to find credential account for this user
    const account = await db.account.findFirst({
      where: {
        userId: foundUser.id,
        providerId: 'credential'
      }
    });

    const now = new Date();

    if (account) {
      // Update existing account
      await db.account.update({
        where: { id: account.id },
        data: {
          password: hashedPassword,
          updatedAt: now
        }
      });
    } else {
      // Create new account record
      const accountId = crypto.randomBytes(16).toString('hex');
      await db.account.create({
        data: {
          id: accountId,
          accountId: foundUser.id,
          providerId: 'credential',
          userId: foundUser.id,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now
        }
      });
    }

    // Delete used reset token from verification table (single use)
    await db.verification.delete({
      where: { id: verificationRecord.id }
    });

    // Delete all active sessions for this user (force re-login with new password)
    await db.session.deleteMany({
      where: { userId: foundUser.id }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password reset successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}