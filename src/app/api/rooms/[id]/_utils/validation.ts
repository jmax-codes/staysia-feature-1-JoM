/**
 * Validation Utilities for Single Room API
 * 
 * Provides validation functions for room update operations.
 * 
 * @module api/rooms/[id]/utils/validation
 */

/**
 * Validation error structure
 */
export interface ValidationError {
  error: string;
  code: string;
}

/**
 * Validated room update data
 */
export interface ValidatedRoomData {
  updatedAt: string;
  [key: string]: any;
}

/**
 * Validates room update data
 * 
 * Ensures all numeric fields are valid integers and within acceptable ranges.
 * Only includes allowed fields in the update object.
 * 
 * @param body - Request body with room update fields
 * @returns Validated data object or validation error
 */
export function validateRoomUpdate(body: any): ValidatedRoomData | ValidationError {
  // Validate price if provided
  if (body.pricePerNight !== undefined) {
    const price = parseInt(body.pricePerNight);
    if (isNaN(price) || price <= 0) {
      return {
        error: 'Price per night must be a positive integer',
        code: 'INVALID_PRICE'
      };
    }
    body.pricePerNight = price;
  }

  // Validate max guests if provided
  if (body.maxGuests !== undefined) {
    const guests = parseInt(body.maxGuests);
    if (isNaN(guests) || guests <= 0) {
      return {
        error: 'Max guests must be a positive integer',
        code: 'INVALID_MAX_GUESTS'
      };
    }
    body.maxGuests = guests;
  }

  // Validate size if provided
  if (body.size !== undefined && body.size !== null) {
    const size = parseInt(body.size);
    if (isNaN(size) || size <= 0) {
      return {
        error: 'Size must be a positive integer',
        code: 'INVALID_SIZE'
      };
    }
    body.size = size;
  }

  // Validate room number if provided
  if (body.roomNumber !== undefined && body.roomNumber !== null) {
    const roomNum = parseInt(body.roomNumber);
    if (isNaN(roomNum)) {
      return {
        error: 'Room number must be an integer',
        code: 'INVALID_ROOM_NUMBER'
      };
    }
    body.roomNumber = roomNum;
  }

  // Prepare update object with allowed fields only
  const updateData: ValidatedRoomData = {
    updatedAt: new Date().toISOString()
  };

  const allowedFields = [
    'name', 'type', 'pricePerNight', 'maxGuests', 'beds', 'size',
    'amenities', 'available', 'roomNumber', 'inRoomAmenities',
    'bathroomFacilities', 'additionalFeatures', 'technologyComfort',
    'extraServices', 'hasLock'
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  return updateData;
}

/**
 * Validates room ID parameter
 * 
 * Ensures the ID is a valid positive integer.
 * 
 * @param id - Room ID string from URL params
 * @returns Parsed room ID or validation error
 */
export function validateRoomId(id: string): number | ValidationError {
  if (!id || isNaN(parseInt(id))) {
    return {
      error: 'Valid room ID is required',
      code: 'INVALID_ID'
    };
  }

  const roomId = parseInt(id);
  if (roomId <= 0) {
    return {
      error: 'Room ID must be a positive integer',
      code: 'INVALID_ID'
    };
  }

  return roomId;
}
