/**
 * File Upload Validation Schema
 * 
 * Yup validation for file upload metadata.
 */

import * as yup from 'yup';

/**
 * Image upload metadata schema
 */
export const imageUploadSchema = yup.object({
  title: yup.string().max(200).optional(),
  description: yup.string().max(500).optional(),
  propertyId: yup.number().integer().positive().optional(),
  roomId: yup.number().integer().positive().optional()
});
