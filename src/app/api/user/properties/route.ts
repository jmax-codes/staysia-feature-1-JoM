import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    // Extract bearer token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'MISSING_TOKEN'
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Validate session token
    const userSession = await db.session.findUnique({
      where: { token }
    });

    if (!userSession) {
      return NextResponse.json(
        { 
          error: 'Invalid session token',
          code: 'INVALID_TOKEN'
        },
        { status: 401 }
      );
    }

    // Check session expiration
    const now = new Date();
    if (userSession.expiresAt < now) {
      return NextResponse.json(
        { 
          error: 'Session expired',
          code: 'SESSION_EXPIRED'
        },
        { status: 401 }
      );
    }

    // Get userId from valid session
    const userId = userSession.userId;

    // Query user table to get current user data
    const currentUser = await db.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Check if user role is "tenant"
    if (currentUser.role !== 'tenant') {
      return NextResponse.json([], { status: 200 });
    }

    // Query hosts table to find host record by userId
    const host = await db.host.findFirst({
      where: { userId }
    });

    // If no host record found, return empty array
    if (!host) {
      return NextResponse.json([], { status: 200 });
    }

    // Query properties table filtering by hostId
    const userProperties = await db.property.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(userProperties, { status: 200 });

  } catch (error) {
    console.error('GET /api/user/properties error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}