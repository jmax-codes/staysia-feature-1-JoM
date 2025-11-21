/**
 * Authentication Middleware
 * 
 * Validates Supabase JWT tokens and session tokens, attaches user/session to request.
 */

import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { verifySupabaseToken } from '../lib/supabase';

/**
 * Authenticate user from Supabase JWT or session token
 * 
 * Validates JWT token from Supabase Auth and attaches user and session to request.
 * Falls back to session token validation for backward compatibility.
 */
export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization as string;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Missing or invalid authorization header',
        code: 'UNAUTHORIZED'
      });
      return;
    }

    const token = authHeader.substring(7);
    
    // Try Supabase JWT verification first
    const supabaseUser = await verifySupabaseToken(token);
    
    if (supabaseUser) {
      // Get user from database using Supabase user ID
      const userData = await db.user.findUnique({
        where: { id: supabaseUser.id }
      });

      if (!userData) {
        res.status(401).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      // Attach to request
      req.user = userData;
      next();
      return;
    }
    
    // Fallback to session token validation (for backward compatibility)
    const sessionData = await db.session.findUnique({
      where: { token }
    });

    if (!sessionData) {
      res.status(401).json({ 
        error: 'Invalid session token',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    // Check expiration
    if (new Date(sessionData.expiresAt) <= new Date()) {
      res.status(401).json({ 
        error: 'Session expired',
        code: 'SESSION_EXPIRED'
      });
      return;
    }

    // Get user
    const userData = await db.user.findUnique({
      where: { id: sessionData.userId }
    });

    if (!userData) {
      res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    // Attach to request
    req.user = userData;
    req.session = sessionData;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
}

/**
 * Optional authentication middleware
 * 
 * Attempts to authenticate but doesn't fail if no token provided.
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization || req.headers.Authorization as string;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  // Use the authenticateUser logic but don't fail
  try {
    const token = authHeader.substring(7);
    
    // Try Supabase JWT first
    const supabaseUser = await verifySupabaseToken(token);
    
    if (supabaseUser) {
      const userData = await db.user.findUnique({
        where: { id: supabaseUser.id }
      });

      if (userData) {
        req.user = userData;
      }
      next();
      return;
    }
    
    // Fallback to session token
    const sessionData = await db.session.findUnique({
      where: { token }
    });

    if (sessionData && new Date(sessionData.expiresAt) > new Date()) {
      const userData = await db.user.findUnique({
        where: { id: sessionData.userId }
      });

      if (userData) {
        req.user = userData;
        req.session = sessionData;
      }
    }
  } catch (error) {
    console.error('Optional auth error:', error);
  }

  next();
}
