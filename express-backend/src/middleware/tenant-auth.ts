/**
 * Tenant Authentication Middleware
 * 
 * Validates tenant role and attaches host data to request.
 */

import { Request, Response, NextFunction } from 'express';
import { db } from '../db';

/**
 * Authenticate tenant user
 * 
 * Requires authentication and tenant role.
 * Attaches host profile to request.
 */
export async function authenticateTenant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // User must already be authenticated
  if (!req.user) {
    res.status(401).json({ 
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    });
    return;
  }

  // Verify tenant role
  if (req.user.role !== 'tenant') {
    res.status(403).json({ 
      error: 'Access denied. Tenant role required',
      code: 'FORBIDDEN'
    });
    return;
  }

  try {
    // Get host profile
    const hostData = await db.host.findFirst({
      where: { userId: req.user.id }
    });

    if (!hostData) {
      res.status(404).json({ 
        error: 'Host profile not found',
        code: 'HOST_NOT_FOUND'
      });
      return;
    }

    // Attach to request
    (req as any).host = hostData;
    
    next();
  } catch (error) {
    console.error('Tenant authentication error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
}
