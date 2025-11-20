import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    // Extract bearer token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'MISSING_TOKEN' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Validate session token against session table
    const userSession = await db.session.findUnique({
      where: { token }
    });

    if (!userSession) {
      return NextResponse.json(
        { error: 'Invalid session token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Check session expiration
    const now = new Date();
    if (userSession.expiresAt < now) {
      return NextResponse.json(
        { error: 'Session expired', code: 'SESSION_EXPIRED' },
        { status: 401 }
      );
    }

    const userId = userSession.userId;

    // Query user table to get current user data
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        role: currentUser.role,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('GET /api/user/status error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}