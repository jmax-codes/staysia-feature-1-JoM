/**
 * Authentication Utilities for Single Room API
 * 
 * Provides authentication and ownership verification for room operations.
 * 
 * @module api/rooms/[id]/utils/auth
 */

import { NextRequest } from 'next/server';
import { db } from '@/db';

/**
 * Authentication result with tenant info
 */
export interface AuthResult {
  host: {
    id: number;
    userId: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Error result structure
 */
export interface ErrorResult {
  error: string;
  code: string;
  status: number;
}

/**
 * Authenticates tenant from bearer token
 * 
 * Validates session token, checks expiration, and verifies tenant role.
 * Returns host profile for authorized tenants.
 * 
 * @param request - Next.js request object with Authorization header
 * @returns Authentication result or error
 */
export async function authenticateTenant(
  request: NextRequest
): Promise<AuthResult | ErrorResult> {
  // Extract token
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: 'Authentication required',
      code: 'MISSING_TOKEN',
      status: 401
    };
  }

  const token = authHeader.substring(7);

  // Validate session
  const userSession = await db.session.findUnique({
    where: { token }
  });

  if (!userSession) {
    return {
      error: 'Invalid session token',
      code: 'INVALID_TOKEN',
      status: 401
    };
  }

  // Check expiration
  if (new Date(userSession.expiresAt) < new Date()) {
    return {
      error: 'Session expired',
      code: 'SESSION_EXPIRED',
      status: 401
    };
  }

  // Get user
  const currentUser = await db.user.findUnique({
    where: { id: userSession.userId }
  });

  if (!currentUser) {
    return {
      error: 'User not found',
      code: 'USER_NOT_FOUND',
      status: 401
    };
  }

  // Verify tenant role
  if (currentUser.role !== 'tenant') {
    return {
      error: 'Tenant role required',
      code: 'INSUFFICIENT_PERMISSIONS',
      status: 401
    };
  }

  // Get host profile
  const host = await db.host.findFirst({
    where: { userId: currentUser.id }
  });

  if (!host) {
    return {
      error: 'Host profile not found',
      code: 'HOST_NOT_FOUND',
      status: 403
    };
  }

  return {
    host: {
      id: host.id,
      userId: host.userId,
      name: host.name
    },
    user: {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role
    }
  };
}

/**
 * Verifies room ownership by host
 * 
 * Checks if the room exists and belongs to a property owned by the host.
 * 
 * @param roomId - Room ID to verify
 * @param hostId - Host ID to check ownership
 * @returns Success result or error
 */
export async function verifyRoomOwnership(
  roomId: number,
  hostId: number
): Promise<{ success: true } | ErrorResult> {
  // Verify room exists
  const room = await db.room.findUnique({
    where: { id: roomId }
  });

  if (!room) {
    return {
      error: 'Room not found',
      code: 'ROOM_NOT_FOUND',
      status: 404
    };
  }

  // Verify property ownership
  const property = await db.property.findUnique({
    where: { id: room.propertyId }
  });

  if (!property) {
    return {
      error: 'Property not found',
      code: 'PROPERTY_NOT_FOUND',
      status: 404
    };
  }

  if (property.hostId !== hostId) {
    return {
      error: 'You do not have permission to access this room',
      code: 'FORBIDDEN',
      status: 403
    };
  }

  return { success: true };
}
