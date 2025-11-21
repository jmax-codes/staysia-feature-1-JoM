/**
 * Reviews Routes
 * 
 * Defines routes for review operations.
 */

import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as reviewsController from '../controllers/reviews.controller';
import * as reviewValidator from '../validators/review.validator';

const router = Router();

// List reviews (public, but can be authenticated)
router.get(
  '/',
  optionalAuth,
  validate({ query: reviewValidator.listReviewsQuerySchema }),
  reviewsController.listReviews
);

// Create review (public for now, could require auth)
router.post(
  '/',
  validate({ body: reviewValidator.createReviewSchema }),
  reviewsController.createReview
);

export default router;
