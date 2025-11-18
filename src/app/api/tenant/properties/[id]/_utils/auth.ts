/**
 * Authentication Utilities for Tenant Properties
 * 
 * Handles tenant authentication and property ownership verification.
 * 
 * @module api/tenant/properties/[id]/utils/auth
 */

import { NextRequest } from 'next/server';
import { db } from '@/db';

interface AuthError {
  error: string;
  status: number;
}

interface AuthSuccess {
  user: any;
  host: any;
}

/**
 * Authenticate tenant from request
 * 
 * Validates bearer token, checks session validity, and verifies tenant role.
 * 
 * @param request - Next.js request with authorization header
 * @returns Authentication result or error
 */
export async function authenticateTenant(
  request: NextRequest
): Promise<AuthSuccess | AuthError> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header', status: 401 };
    }

    const token = authHeader.substring(7);
    
    // Validate session
    const sessionData = await db.session.findUnique({
      where: { token }
    });

    if (!sessionData) {
      return { error: 'Invalid session token', status: 401 };
    }

    if (new Date(sessionData.expiresAt) <= new Date()) {
      return { error: 'Session expired', status: 401 };
    }

    // Get user and verify role
    const userData = await db.user.findUnique({
      where: { id: sessionData.userId }
    });

    if (!userData) {
      return { error: 'User not found', status: 401 };
    }

    if (userData.role !== 'tenant') {
      return { error: 'Access denied. Tenant role required', status: 401 };
    }

    // Get host profile
    const hostData = await db.host.findFirst({
      where: { userId: userData.id }
    });

    if (!hostData) {
      return { error: 'Host profile not found', status: 401 };
    }

    return { user: userData, host: hostData };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 401 };
  }
}

/**
 * Verify property ownership
 * 
 * Checks if the host owns the specified property.
 * 
 * @param propertyId - Property ID to verify
 * @param hostId - Host ID to check ownership
 * @returns Property if owned, null otherwise
 */
export async function verifyPropertyOwnership(propertyId: number, hostId: number) {
  return db.property.findFirst({
    where: {
      id: propertyId,
      hostId
    }
  });
}
