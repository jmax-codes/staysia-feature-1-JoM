/**
 * Property Validation Schemas
 * 
 * Yup schemas for property endpoints.
 */

import * as yup from 'yup';

/**
 * List properties query schema
 */
export const listPropertiesQuerySchema = yup.object({
  location: yup.string().max(100).optional(),
  category: yup.string().max(50).optional(),
  city: yup.string().max(100).optional(),
  type: yup.string().max(50).optional(),
  minPrice: yup.number().integer().positive().optional(),
  maxPrice: yup.number().integer().positive().optional(),
  guests: yup.number().integer().positive().optional(),
  adults: yup.number().integer().min(0).optional(),
  children: yup.number().integer().min(0).optional(),
  pets: yup.number().integer().min(0).optional(),
  checkIn: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  checkOut: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  search: yup.string().max(200).optional(),
  limit: yup.number().integer().positive().max(100).default(50),
  offset: yup.number().integer().min(0).default(0),
  sortBy: yup.string().oneOf(['name', 'price', 'rating']).default('name'),
  order: yup.string().oneOf(['asc', 'desc']).default('asc')
});

/**
 * Create property schema
 */
export const createPropertySchema = yup.object({
  name: yup.string().required().min(3).max(200).trim(),
  city: yup.string().required().max(100).trim(),
  area: yup.string().required().max(100).trim(),
  type: yup.string().required().max(50).trim(),
  price: yup.number().integer().positive().required(),
  bestDealPrice: yup.number().integer().positive().optional()
    .test('less-than-base', 'Best deal price must be less than base price', function(value) {
      if (!value) return true;
      return value < this.parent.price;
    }),
  peakSeasonPrice: yup.number().integer().positive().optional()
    .test('greater-than-base', 'Peak season price must be greater than base price', function(value) {
      if (!value) return true;
      return value > this.parent.price;
    }),
  nights: yup.number().integer().positive().default(2),
  rating: yup.number().min(0).max(5).default(0),
  imageUrl: yup.string().url().required(),
  isGuestFavorite: yup.boolean().default(false),
  description: yup.string().max(2000).optional(),
  address: yup.string().max(500).optional(),
  country: yup.string().max(100).optional(),
  latitude: yup.number().min(-90).max(90).optional(),
  longitude: yup.number().min(-180).max(180).optional(),
  bedrooms: yup.number().integer().min(0).optional(),
  bathrooms: yup.number().integer().min(0).optional(),
  maxGuests: yup.number().integer().positive().optional(),
  petsAllowed: yup.boolean().default(false),
  checkInTime: yup.string().max(20).optional(),
  checkOutTime: yup.string().max(20).optional(),
  images: yup.array().of(yup.string().url()).optional(),
  amenities: yup.array().of(yup.string()).optional()
});

/**
 * Update property schema
 */
export const updatePropertySchema = createPropertySchema.partial();

/**
 * Pricing calculation query schema
 */
export const pricingCalculationQuerySchema = yup.object({
  startDate: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .test('after-start', 'End date must be after start date', function(value) {
      if (!value || !this.parent.startDate) return true;
      return new Date(value) >= new Date(this.parent.startDate);
    })
});
