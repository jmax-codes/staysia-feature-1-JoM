import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function POST(request: NextRequest) {
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
      where: { id: userId }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user.role is already "tenant"
    if (currentUser.role === 'tenant') {
      // Query hosts table to get existing hostId
      const existingHost = await db.host.findFirst({
        where: { userId }
      });

      if (existingHost) {
        return NextResponse.json(
          {
            success: true,
            role: 'tenant',
            hostId: existingHost.id,
          },
          { status: 200 }
        );
      }

      // If role is tenant but no host record, create one
      const newHost = await db.host.create({
        data: {
          userId: currentUser.id,
          fullName: currentUser.name,
          profilePicture: currentUser.image,
          contactNumber: currentUser.phone,
          bio: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      });

      return NextResponse.json(
        {
          success: true,
          role: 'tenant',
          hostId: newHost.id,
        },
        { status: 200 }
      );
    }

    // If user.role is "user", upgrade to "tenant"
    if (currentUser.role === 'user') {
      // Update user.role to "tenant"
      await db.user.update({
        where: { id: userId },
        data: {
          role: 'tenant',
          updatedAt: new Date(),
        }
      });

      // Query hosts table to check if entry exists for this userId
      const existingHost = await db.host.findFirst({
        where: { userId }
      });

      if (!existingHost) {
        // Insert new record in hosts table
        const newHost = await db.host.create({
          data: {
            userId: currentUser.id,
            fullName: currentUser.name,
            profilePicture: currentUser.image,
            contactNumber: currentUser.phone,
            bio: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });

        return NextResponse.json(
          {
            success: true,
            role: 'tenant',
            hostId: newHost.id,
          },
          { status: 200 }
        );
      } else {
        // Return existing host record
        return NextResponse.json(
          {
            success: true,
            role: 'tenant',
            hostId: existingHost.id,
          },
          { status: 200 }
        );
      }
    }

    // If user role is neither "user" nor "tenant"
    return NextResponse.json(
      {
        error: 'Invalid user role for host upgrade',
        code: 'INVALID_ROLE',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('POST /api/user/become-host error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}