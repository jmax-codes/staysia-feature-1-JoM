import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function PATCH(request: NextRequest) {
  try {
    // Extract and validate bearer token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'MISSING_TOKEN' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (!token) {
      return NextResponse.json({ 
        error: 'Invalid token format',
        code: 'INVALID_TOKEN' 
      }, { status: 401 });
    }

    // Validate session token
    const userSession = await db.session.findUnique({
      where: { token }
    });

    if (!userSession) {
      return NextResponse.json({ 
        error: 'Invalid session',
        code: 'INVALID_SESSION' 
      }, { status: 401 });
    }

    // Check session expiration
    if (userSession.expiresAt < new Date()) {
      return NextResponse.json({ 
        error: 'Session expired',
        code: 'SESSION_EXPIRED' 
      }, { status: 401 });
    }

    const userId = userSession.userId;

    // Parse and validate request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required',
        code: 'MISSING_EMAIL' 
      }, { status: 400 });
    }

    if (!password || password.trim() === '') {
      return NextResponse.json({ 
        error: 'Password is required',
        code: 'MISSING_PASSWORD' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format',
        code: 'INVALID_EMAIL_FORMAT' 
      }, { status: 400 });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Get current user
    const currentUser = await db.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Query account table for user's credential account
    const userAccount = await db.account.findFirst({
      where: {
        userId,
        providerId: 'credential'
      }
    });

    if (!userAccount || !userAccount.password) {
      return NextResponse.json({ 
        error: 'No password set for this account',
        code: 'NO_PASSWORD_SET' 
      }, { status: 400 });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(password, userAccount.password);
    if (!passwordMatch) {
      return NextResponse.json({ 
        error: 'Invalid password',
        code: 'INVALID_PASSWORD' 
      }, { status: 401 });
    }

    // Check if new email is already in use by another user
    const existingUser = await db.user.findFirst({
      where: {
        email: normalizedEmail,
        NOT: { id: userId }
      }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Email already in use',
        code: 'EMAIL_IN_USE' 
      }, { status: 400 });
    }

    // Update user record
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        email: normalizedEmail,
        emailVerified: false,
        updatedAt: new Date()
      }
    });

    // Delete any existing email verification tokens for this user
    await db.verification.deleteMany({
      where: { identifier: `email-verification:${userId}` }
    });

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Store verification token
    await db.verification.create({
      data: {
        id: crypto.randomBytes(16).toString('hex'),
        identifier: `email-verification:${userId}`,
        value: verificationToken,
        expiresAt: expiresAt,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Email changed successfully. Please verify your new email.',
      verificationToken: verificationToken
    }, { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}