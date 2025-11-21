/**
 * Ownership Verification Utilities
 * 
 * Functions to verify property and room ownership by hosts.
 */

import { db } from '../db';

/**
 * Verify property ownership by host
 */
export async function verifyPropertyOwnership(
  hostId: number,
  propertyId: number
): Promise<{ valid: boolean; error?: string }> {
  const property = await db.property.findUnique({
    where: { id: propertyId }
  });

  if (!property) {
    return { valid: false, error: 'Property not found' };
  }

  if (property.hostId !== hostId) {
    return { 
      valid: false, 
      error: 'You do not have permission to modify this property' 
    };
  }

  return { valid: true };
}

/**
 * Verify room ownership by host
 */
export async function verifyRoomOwnership(
  hostId: number,
  roomId: number
): Promise<{ valid: boolean; error?: string; propertyId?: number }> {
  const room = await db.room.findUnique({
    where: { id: roomId },
    include: { property: true }
  });

  if (!room) {
    return { valid: false, error: 'Room not found' };
  }

  if (room.property.hostId !== hostId) {
    return { 
      valid: false, 
      error: 'You do not own this property' 
    };
  }

  return { valid: true, propertyId: room.propertyId };
}
