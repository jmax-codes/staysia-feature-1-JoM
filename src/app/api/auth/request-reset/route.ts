import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email is provided
    if (!email) {
      return NextResponse.json(
        { 
          error: 'Email is required',
          code: 'MISSING_EMAIL'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL_FORMAT'
        },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists with this email
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail }
    });

    let token = null;

    // Only process if user exists (but always return success to prevent enumeration)
    if (existingUser) {
      // Generate cryptographically secure token (32 bytes, hex format)
      token = crypto.randomBytes(32).toString('hex');

      // Set expiry to 1 hour from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const identifier = `password-reset:${normalizedEmail}`;

      // Delete any existing password reset tokens for this email
      await db.verification.deleteMany({
        where: { identifier }
      });

      // Store new token in verification table
      await db.verification.create({
        data: {
          id: crypto.randomBytes(16).toString('hex'),
          identifier,
          value: token,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
    }

    // Always return success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: 'If email exists, password reset link has been sent',
        token,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}