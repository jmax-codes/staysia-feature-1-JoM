/**
 * Room Validation Schemas
 * 
 * Yup schemas for room endpoints.
 */

import * as yup from 'yup';

/**
 * Create room schema
 */
export const createRoomSchema = yup.object({
  propertyId: yup.number().integer().positive().required(),
  name: yup.string().required().min(1).max(100).trim(),
  type: yup.string().required().max(50).trim(),
  pricePerNight: yup.number().integer().positive().required(),
  maxGuests: yup.number().integer().positive().required(),
  beds: yup.array().of(yup.object()).optional(),
  size: yup.number().integer().positive().optional(),
  amenities: yup.array().of(yup.string()).optional(),
  available: yup.boolean().default(true),
  roomNumber: yup.number().integer().positive().optional(),
  inRoomAmenities: yup.array().of(yup.string()).optional(),
  bathroomFacilities: yup.array().of(yup.string()).optional(),
  additionalFeatures: yup.array().of(yup.string()).optional(),
  technologyComfort: yup.array().of(yup.string()).optional(),
  extraServices: yup.array().of(yup.string()).optional(),
  hasLock: yup.boolean().optional()
});

/**
 * Update room schema
 */
export const updateRoomSchema = createRoomSchema.partial().shape({
  id: yup.number().integer().positive().required()
});

/**
 * List rooms query schema
 */
export const listRoomsQuerySchema = yup.object({
  propertyId: yup.number().integer().positive().optional(),
  limit: yup.number().integer().positive().max(100).default(50),
  offset: yup.number().integer().min(0).default(0)
});
