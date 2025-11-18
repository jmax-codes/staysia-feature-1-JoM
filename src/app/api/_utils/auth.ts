/**
 * API Authentication Utilities
 * 
 * Shared authentication helpers for API routes.
 * Validates bearer tokens and verifies user roles.
 * 
 * @module APIAuthUtils
 */

import { NextRequest } from 'next/server';
import { db } from '@/db';

/**
 * Authentication result with user and host data
 */
export interface AuthResult {
  user: {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
  };
  host: {
    id: number;
    userId: string;
    [key: string]: any;
  };
}

/**
 * Authentication error result
 */
export interface AuthError {
  error: string;
  status: number;
}

/**
 * Authenticate tenant user from request
 * 
 * Validates bearer token, checks session expiration,
 * and verifies tenant role.
 * 
 * @param request - Next.js request object
 * @returns Authentication result or error
 * 
 * @sideEffects Queries database for session, user, and host
 * 
 * @example
 * ```typescript
 * const auth = await authenticateTenant(request);
 * if ('error' in auth) {
 *   return NextResponse.json({ error: auth.error }, { status: auth.status });
 * }
 * const { user, host } = auth;
 * ```
 */
export async function authenticateTenant(
  request: NextRequest
): Promise<AuthResult | AuthError> {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
        error: 'Missing or invalid authorization header', 
        status: 401 
      };
    }

    const token = authHeader.substring(7);
    
    // Validate session
    const sessionData = await db.session.findUnique({
      where: { token }
    });

    if (!sessionData) {
      return { error: 'Invalid session token', status: 401 };
    }

    // Check expiration
    if (new Date(sessionData.expiresAt) <= new Date()) {
      return { error: 'Session expired', status: 401 };
    }

    // Get user
    const userData = await db.user.findUnique({
      where: { id: sessionData.userId }
    });

    if (!userData) {
      return { error: 'User not found', status: 401 };
    }

    // Verify tenant role
    if (userData.role !== 'tenant') {
      return { 
        error: 'Access denied. Tenant role required', 
        status: 403 
      };
    }

    // Get host profile
    const hostData = await db.host.findFirst({
      where: { userId: userData.id }
    });

    if (!hostData) {
      return { 
        error: 'Host profile not found', 
        status: 404 
      };
    }

    return { 
      user: userData as any, 
      host: hostData as any 
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 401 };
  }
}

/**
 * Verify property ownership by host
 * 
 * Checks if the authenticated host owns the specified property.
 * 
 * @param hostId - Host ID to verify
 * @param propertyId - Property ID to check
 * @returns Ownership verification result
 * 
 * @sideEffects Queries database for property
 */
export async function verifyPropertyOwnership(
  hostId: number,
  propertyId: number
): Promise<{ valid: boolean; error?: string }> {
  const property = await db.property.findUnique({
    where: { id: propertyId }
  });

  if (!property) {
    return { valid: false, error: 'Property not found' };
  }

  if (property.hostId !== hostId) {
    return { 
      valid: false, 
      error: 'You do not have permission to modify this property' 
    };
  }

  return { valid: true };
}

/**
 * Verify room ownership by host
 * 
 * Checks if the authenticated host owns the property
 * that contains the specified room.
 * 
 * @param hostId - Host ID to verify
 * @param roomId - Room ID to check
 * @returns Ownership verification result
 * 
 * @sideEffects Queries database for room and property
 */
export async function verifyRoomOwnership(
  hostId: number,
  roomId: number
): Promise<{ valid: boolean; error?: string; propertyId?: number }> {
  const room = await db.room.findUnique({
    where: { id: roomId },
    include: { property: true }
  });

  if (!room) {
    return { valid: false, error: 'Room not found' };
  }

  if (room.property.hostId !== hostId) {
    return { 
      valid: false, 
      error: 'You do not own this property' 
    };
  }

  return { valid: true, propertyId: room.propertyId };
}
