/**
 * Rooms Routes
 * 
 * Defines routes for room operations.
 */

import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { authenticateTenant } from '../middleware/tenant-auth';
import { validate } from '../middleware/validate';
import * as roomsController from '../controllers/rooms.controller';
import * as roomValidator from '../validators/room.validator';

const router = Router();

// List rooms
router.get(
  '/',
  validate({ query: roomValidator.listRoomsQuerySchema }),
  roomsController.listRooms
);

// Get single room
router.get('/:id', roomsController.getRoom);

// Create room (requires tenant auth)
router.post(
  '/',
  authenticateUser,
  authenticateTenant,
  validate({ body: roomValidator.createRoomSchema }),
  roomsController.createRoom
);

// Update room (requires tenant auth)
router.put(
  '/:id',
  authenticateUser,
  authenticateTenant,
  validate({ body: roomValidator.updateRoomSchema }),
  roomsController.updateRoom
);

// Delete room (requires tenant auth)
router.delete('/:id', authenticateUser, authenticateTenant, roomsController.deleteRoom);

// Room pricing calculation
router.get('/:id/pricing-calculation', roomsController.calculateRoomPricing);

export default router;
