/**
 * Review Validation Schemas
 * 
 * Yup schemas for review endpoints.
 */

import * as yup from 'yup';

/**
 * Create review schema
 */
export const createReviewSchema = yup.object({
  propertyId: yup.number().integer().positive().required(),
  userId: yup.string().optional(),
  userName: yup.string().required().min(1).max(100).trim(),
  userAvatar: yup.string().url().nullable().optional(),
  rating: yup.number().required().min(0).max(5),
  comment: yup.string().required().min(10).max(1000).trim(),
  cleanliness: yup.number().min(0).max(5).optional(),
  accuracy: yup.number().min(0).max(5).optional(),
  communication: yup.number().min(0).max(5).optional(),
  location: yup.number().min(0).max(5).optional(),
  value: yup.number().min(0).max(5).optional()
});

/**
 * List reviews query schema
 */
export const listReviewsQuerySchema = yup.object({
  id: yup.number().integer().positive().optional(),
  propertyId: yup.number().integer().positive().optional(),
  userId: yup.string().optional(),
  limit: yup.number().integer().positive().max(100).default(50),
  offset: yup.number().integer().min(0).default(0)
});
