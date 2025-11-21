/**
 * User Validation Schemas
 * 
 * Yup schemas for user-related endpoints.
 */

import * as yup from 'yup';

/**
 * Update profile schema
 */
export const updateProfileSchema = yup.object({
  name: yup.string().min(1).max(100).trim(),
  phone: yup.string().nullable().max(20).trim(),
  image: yup.string().url().nullable()
});

/**
 * Change email schema
 */
export const changeEmailSchema = yup.object({
  newEmail: yup.string().email().required().trim().lowercase()
});

/**
 * Change password schema
 */
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required().min(8),
  newPassword: yup.string().required().min(8).max(100)
});

/**
 * Become host schema
 */
export const becomeHostSchema = yup.object({
  // No body required, but can add optional fields
});
