/**
 * Properties Routes
 * 
 * Defines routes for property operations.
 */

import { Router } from 'express';
import { authenticateUser, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as propertiesController from '../controllers/properties.controller';
import * as propertyValidator from '../validators/property.validator';

const router = Router();

// List properties (public, with optional auth)
router.get(
  '/',
  optionalAuth,
  validate({ query: propertyValidator.listPropertiesQuerySchema }),
  propertiesController.listProperties
);

// Get single property
router.get('/:id', propertiesController.getProperty);

// Create property (requires auth)
router.post(
  '/',
  authenticateUser,
  validate({ body: propertyValidator.createPropertySchema }),
  propertiesController.createProperty
);

// Update property (requires auth)
router.put(
  '/:id',
  authenticateUser,
  validate({ body: propertyValidator.updatePropertySchema }),
  propertiesController.updateProperty
);

// Delete property (requires auth)
router.delete('/:id', authenticateUser, propertiesController.deleteProperty);

// Get favorites (requires auth)
router.get('/favorites', authenticateUser, propertiesController.getFavorites);

// Toggle favorite (requires auth)
router.post('/favorite', authenticateUser, propertiesController.toggleFavorite);

// Pricing calculation
router.get(
  '/:id/pricing-calculation',
  validate({ query: propertyValidator.pricingCalculationQuerySchema }),
  propertiesController.calculatePricing
);

export default router;
