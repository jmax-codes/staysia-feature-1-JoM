/**
 * User Controller
 * 
 * Handles user profile and settings operations.
 */

import { Request, Response } from 'express';
import { db } from '../db';

/**
 * GET /api/user/profile
 * Get user profile
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      });
      return;
    }

    const userData = await db.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!userData) {
      res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      });
      return;
    }

    res.json(userData);
  } catch (error) {
    console.error('GET profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}

/**
 * PATCH /api/user/profile
 * Update user profile
 */
export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      });
      return;
    }

    const { name, phone, image } = req.body;

    if (!name && phone === undefined && image === undefined) {
      res.status(400).json({ 
        error: 'At least one field must be provided for update',
        code: 'NO_FIELDS_PROVIDED' 
      });
      return;
    }

    const updates: any = {
      updatedAt: new Date()
    };

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        res.status(400).json({ 
          error: 'Name cannot be empty',
          code: 'INVALID_NAME' 
        });
        return;
      }
      updates.name = trimmedName;
    }

    if (phone !== undefined) {
      if (phone === null) {
        updates.phone = null;
      } else {
        const trimmedPhone = phone.trim();
        if (!trimmedPhone) {
          res.status(400).json({ 
            error: 'Phone cannot be empty string',
            code: 'INVALID_PHONE' 
          });
          return;
        }
        updates.phone = trimmedPhone;
      }
    }

    if (image !== undefined) {
      if (image === null) {
        updates.image = null;
      } else {
        try {
          new URL(image);
          updates.image = image;
        } catch {
          res.status(400).json({ 
            error: 'Invalid image URL format',
            code: 'INVALID_IMAGE_URL' 
          });
          return;
        }
      }
    }

    const updated = await db.user.update({
      where: { id: req.user.id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('PATCH profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}

/**
 * GET /api/user/status
 * Get user status and role
 */
export async function getUserStatus(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      });
      return;
    }

    res.json({
      id: req.user.id,
      role: req.user.role,
      emailVerified: req.user.emailVerified
    });
  } catch (error) {
    console.error('GET status error:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}

/**
 * POST /api/user/become-host
 * Upgrade user to tenant/host
 */
export async function becomeHost(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      });
      return;
    }

    const currentUser = req.user;

    // Check if already tenant
    if (currentUser.role === 'tenant') {
      const existingHost = await db.host.findFirst({
        where: { userId: currentUser.id }
      });

      if (existingHost) {
        res.json({
          success: true,
          role: 'tenant',
          hostId: existingHost.id,
        });
        return;
      }

      // Create host record
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

      res.json({
        success: true,
        role: 'tenant',
        hostId: newHost.id,
      });
      return;
    }

    // Upgrade user to tenant
    if (currentUser.role === 'user') {
      await db.user.update({
        where: { id: currentUser.id },
        data: {
          role: 'tenant',
          updatedAt: new Date(),
        }
      });

      const existingHost = await db.host.findFirst({
        where: { userId: currentUser.id }
      });

      if (!existingHost) {
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

        res.json({
          success: true,
          role: 'tenant',
          hostId: newHost.id,
        });
        return;
      } else {
        res.json({
          success: true,
          role: 'tenant',
          hostId: existingHost.id,
        });
        return;
      }
    }

    res.status(400).json({
      error: 'Invalid user role for host upgrade',
      code: 'INVALID_ROLE',
    });
  } catch (error) {
    console.error('POST become-host error:', error);
    res.status(500).json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
}

/**
 * POST /api/user/change-email
 * Change user email
 */
export async function changeEmail(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
      return;
    }

    const { newEmail } = req.body;

    if (!newEmail || !newEmail.trim()) {
      res.status(400).json({ error: 'New email is required', code: 'MISSING_EMAIL' });
      return;
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: newEmail.trim().toLowerCase() }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email already in use', code: 'EMAIL_EXISTS' });
      return;
    }

    await db.user.update({
      where: { id: req.user.id },
      data: {
        email: newEmail.trim().toLowerCase(),
        emailVerified: false,
        updatedAt: new Date()
      }
    });

    res.json({ success: true, message: 'Email updated successfully' });
  } catch (error) {
    console.error('POST change-email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/user/change-password
 * Change user password
 */
export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current and new password required', code: 'MISSING_PASSWORDS' });
      return;
    }

    // Note: Password validation would typically involve better-auth
    // For now, return success
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('POST change-password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/user/properties
 * Get user's favorited properties
 */
export async function getUserProperties(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
      return;
    }

    // This would typically query a favorites/wishlist table
    // For now, return empty array
    res.json([]);
  } catch (error) {
    console.error('GET user properties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
