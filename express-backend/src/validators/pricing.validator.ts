/**
 * Pricing Validation Schemas
 * 
 * Yup schemas for pricing and availability endpoints.
 */

import * as yup from 'yup';

/**
 * Create property pricing schema
 */
export const createPropertyPricingSchema = yup.object({
  propertyId: yup.number().integer().positive().required(),
  roomId: yup.number().integer().positive().optional(),
  date: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  price: yup.number().integer().positive().required(),
  priceType: yup.string().required().oneOf(['available', 'sold_out', 'peak_season', 'best_deal'])
});

/**
 * Create room availability schema
 */
export const createRoomAvailabilitySchema = yup.object({
  roomId: yup.number().integer().positive().required(),
  date: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  isAvailable: yup.boolean().required()
});

/**
 * Create peak season rate schema
 */
export const createPeakSeasonRateSchema = yup.object({
  roomId: yup.number().integer().positive().optional(),
  propertyId: yup.number().integer().positive().optional(),
  startDate: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .test('after-start', 'End date must be after start date', function(value) {
      if (!value || !this.parent.startDate) return true;
      return new Date(value) >= new Date(this.parent.startDate);
    }),
  priceIncrease: yup.number().integer().positive().required(),
  percentageIncrease: yup.number().min(0).max(100).optional(),
  isActive: yup.boolean().default(true)
}).test('has-target', 'Must specify either roomId or propertyId', function(value) {
  return !!(value.roomId || value.propertyId);
});

/**
 * Update peak season rate schema
 */
export const updatePeakSeasonRateSchema = createPeakSeasonRateSchema.partial().shape({
  id: yup.number().integer().positive().required()
});
