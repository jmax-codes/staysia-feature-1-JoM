/**
 * Profile Page Validation Schemas
 * 
 * Yup validation schemas for profile, email, and password forms.
 * Ensures data integrity and provides user-friendly error messages.
 * 
 * @module ProfileValidationSchemas
 */

import * as yup from "yup";

/**
 * Profile information validation schema
 * - Name: Required, min 2 characters
 * - Phone: Optional
 * - Image: Optional, must be valid URL if provided
 */
export const profileSchema = yup.object({
  name: yup.string().required("Full name is required").min(2, "Name must be at least 2 characters"),
  phone: yup.string().optional(),
  image: yup.string().url("Must be a valid URL").optional().nullable(),
});

/**
 * Email change validation schema
 * - Email: Required, must be valid email format
 * - Password: Required for security verification
 */
export const emailSchema = yup.object({
  email: yup.string().email("Please enter a valid email address").required("Email is required"),
  password: yup.string().required("Password is required for email change"),
});

/**
 * Password change validation schema
 * - Current password: Required for verification
 * - New password: Required, min 8 characters
 * - Confirm password: Must match new password
 */
export const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("newPassword")], "Passwords must match").required("Please confirm your password"),
});

export type ProfileFormData = yup.InferType<typeof profileSchema>;
export type EmailFormData = yup.InferType<typeof emailSchema>;
export type PasswordFormData = yup.InferType<typeof passwordSchema>;
