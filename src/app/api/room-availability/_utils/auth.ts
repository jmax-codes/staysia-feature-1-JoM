/**
 * Authentication Utilities for Room Availability API
 * 
 * Shared authentication and authorization functions for room availability endpoints.
 * 
 * @module api/room-availability/utils/auth
 */

import { NextRequest } from 'next/server';
import { db } from '@/db';

/**
 * Authentication result with user and host data
 */
interface AuthResult {
  user: any;
  host: any;
}

/**
 * Error result for failed authentication
 */
interface AuthError {
  error: string;
  status: number;
}

/**
 * Authenticates request and verifies user is a tenant
 * 
 * Validates bearer token, checks session expiration, and verifies tenant role.
 * 
 * @param request - Next.js request object
 * @returns Auth result with user/host or error object
 */
export async function authenticateAndVerifyTenant(
  request: NextRequest
): Promise<AuthResult | AuthError> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization token', status: 401 };
  }

  const token = authHeader.substring(7);

  try {
    const sessionRecord = await db.session.findUnique({
      where: { token }
    });

    if (!sessionRecord) {
      return { error: 'Invalid session token', status: 401 };
    }

    if (new Date(sessionRecord.expiresAt) < new Date()) {
      return { error: 'Session expired', status: 401 };
    }

    const userRecord = await db.user.findUnique({
      where: { id: sessionRecord.userId }
    });

    if (!userRecord) {
      return { error: 'User not found', status: 401 };
    }

    if (userRecord.role !== 'tenant') {
      return { error: 'Access denied. Tenant role required', status: 403 };
    }

    const hostRecord = await db.host.findFirst({
      where: { userId: userRecord.id }
    });

    if (!hostRecord) {
      return { error: 'Host profile not found', status: 403 };
    }

    return { user: userRecord, host: hostRecord };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

/**
 * Verifies that the authenticated user owns the room
 * 
 * @param roomId - Room ID to verify
 * @param hostId - Host ID from authenticated session
 * @returns Room object or error object
 */
export async function verifyRoomOwnership(
  roomId: number,
  hostId: number
): Promise<{ room: any } | AuthError> {
  const room = await db.room.findFirst({
    where: { id: roomId },
    include: { property: true }
  });

  if (!room) {
    return { error: 'Room not found', status: 404 };
  }

  if (room.property.hostId !== hostId) {
    return { error: 'Access denied. You do not own this room', status: 403 };
  }

  return { room };
}
