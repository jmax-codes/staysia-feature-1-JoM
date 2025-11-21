/**
 * Auth Routes
 * 
 * Authentication-related endpoints including email checking and password reset.
 */

import { Router } from 'express';
import { db } from '../db';

const router = Router();

/**
 * Check if email is available for registration
 * GET /api/auth/check-email?email=user@example.com
 */
router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ 
        available: false, 
        error: 'Email parameter is required' 
      });
    }

    // Check if user exists with this email
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true }
    });

    return res.json({ 
      available: !existingUser,
      email 
    });
  } catch (error) {
    console.error('Error checking email availability:', error);
    return res.status(500).json({ 
      available: false, 
      error: 'Failed to check email availability' 
    });
  }
});

// TODO: Integrate better-auth handlers
// This will require adapting better-auth for Express
// For now, create placeholder routes

router.post('/request-reset', (req, res) => {
  res.json({ message: 'Password reset requested' });
});

router.post('/reset-password', (req, res) => {
  res.json({ message: 'Password reset successful' });
});

router.post('/send-verification', (req, res) => {
  res.json({ message: 'Verification email sent' });
});

router.post('/verify-email', (req, res) => {
  res.json({ message: 'Email verified' });
});

export default router;
