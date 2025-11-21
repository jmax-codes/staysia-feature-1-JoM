/**
 * Pricing Routes
 * 
 * Defines routes for pricing-related operations.
 */

import { Router } from 'express';
import { validate } from '../middleware/validate';
import * as pricingController from '../controllers/pricing.controller';
import * as pricingValidator from '../validators/pricing.validator';

const router = Router();

// Property pricing
router.get('/property-pricing', pricingController.getPropertyPricing);
router.post(
  '/property-pricing',
  validate({ body: pricingValidator.createPropertyPricingSchema }),
  pricingController.createPropertyPricing
);

// Room availability
router.get('/room-availability', pricingController.getRoomAvailability);
router.post(
  '/room-availability',
  validate({ body: pricingValidator.createRoomAvailabilitySchema }),
  pricingController.createRoomAvailability
);
router.put(
  '/room-availability/:id',
  validate({ body: pricingValidator.createRoomAvailabilitySchema }),
  pricingController.updateRoomAvailability
);
router.delete('/room-availability/:id', pricingController.deleteRoomAvailability);

// Peak season rates
router.get('/peak-season-rates', pricingController.getPeakSeasonRates);
router.post(
  '/peak-season-rates',
  validate({ body: pricingValidator.createPeakSeasonRateSchema }),
  pricingController.createPeakSeasonRate
);
router.put(
  '/peak-season-rates/:id',
  validate({ body: pricingValidator.updatePeakSeasonRateSchema }),
  pricingController.updatePeakSeasonRate
);
router.delete('/peak-season-rates/:id', pricingController.deletePeakSeasonRate);

export default router;
