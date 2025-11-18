import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    // Extract bearer token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: 'Bearer token is required',
          code: 'MISSING_TOKEN'
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return NextResponse.json(
        { 
          error: 'Invalid token format',
          code: 'INVALID_TOKEN'
        },
        { status: 401 }
      );
    }

    // Query session table to validate token
    const userSession = await db.session.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }
      }
    });

    if (!userSession) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired session',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    // Query user table by userId from session
    const userData = await db.user.findUnique({
      where: { id: userSession.userId }
    });

    if (!userData) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Return user status information
    return NextResponse.json(
      {
        userId: userData.id,
        email: userData.email,
        emailVerified: userData.emailVerified,
        role: userData.role,
        name: userData.name,
        createdAt: userData.createdAt
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}