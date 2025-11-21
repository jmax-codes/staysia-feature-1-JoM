/**
 * User Routes
 * 
 * Defines routes for user profile and settings operations.
 */

import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as userController from '../controllers/user.controller';
import * as userValidator from '../validators/user.validator';

const router = Router();

// All user routes require authentication
router.use(authenticateUser);

// Profile routes
router.get('/profile', userController.getProfile);
router.patch(
  '/profile',
  validate({ body: userValidator.updateProfileSchema }),
  userController.updateProfile
);

// Status route
router.get('/status', userController.getUserStatus);

// Host upgrade
router.post(
  '/become-host',
  validate({ body: userValidator.becomeHostSchema }),
  userController.becomeHost
);

// Settings routes
router.post(
  '/change-email',
  validate({ body: userValidator.changeEmailSchema }),
  userController.changeEmail
);
router.post(
  '/change-password',
  validate({ body: userValidator.changePasswordSchema }),
  userController.changePassword
);

// User properties (favorites)
router.get('/properties', userController.getUserProperties);

export default router;
