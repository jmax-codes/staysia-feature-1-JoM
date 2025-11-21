/**
 * Config Routes
 * 
 * Defines routes for configuration data.
 */

import { Router } from 'express';
import * as configController from '../controllers/config.controller';
import * as contactController from '../controllers/contact.controller';

const router = Router();

// Configuration endpoints
router.get('/hosts', configController.listHosts);
router.get('/languages', configController.listLanguages);
router.get('/currencies', configController.listCurrencies);
router.get('/exchange-rates', configController.getExchangeRates);

// Contact form
router.post('/contact', contactController.submitContactForm);

export default router;
