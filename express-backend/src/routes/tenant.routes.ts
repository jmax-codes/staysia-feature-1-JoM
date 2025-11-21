/**
 * Tenant Routes
 * 
 * Defines routes for tenant-specific property operations.
 */

import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { authenticateTenant } from '../middleware/tenant-auth';
import { validate } from '../middleware/validate';
import * as tenantController from '../controllers/tenant-properties.controller';
import * as propertyValidator from '../validators/property.validator';

const router = Router();

// All tenant routes require authentication
router.use(authenticateUser);
router.use(authenticateTenant);

// List tenant properties
router.get('/properties', tenantController.listTenantProperties);

// Create tenant property
router.post(
  '/properties',
  validate({ body: propertyValidator.createPropertySchema }),
  tenantController.createTenantProperty
);

// Get tenant property
router.get('/properties/:id', tenantController.getTenantProperty);

// Update tenant property
router.put(
  '/properties/:id',
  validate({ body: propertyValidator.updatePropertySchema }),
  tenantController.updateTenantProperty
);

// Delete tenant property
router.delete('/properties/:id', tenantController.deleteTenantProperty);

export default router;
