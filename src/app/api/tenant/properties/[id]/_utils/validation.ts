/**
 * Validation Utilities for Property Updates
 * 
 * Validates property data and prepares update payloads.
 * 
 * @module api/tenant/properties/[id]/utils/validation
 */

/**
 * Validate property data from request body
 * 
 * Checks data types and value ranges for property fields.
 * 
 * @param body - Request body with property data
 * @returns Validation error or null if valid
 */
export function validatePropertyData(body: any) {
  if (body.propertyCategory && typeof body.propertyCategory !== 'string') {
    return {
      error: { error: 'Invalid property category', code: 'INVALID_PROPERTY_CATEGORY' },
      status: 400
    };
  }

  if (body.placeType && !['entire', 'room'].includes(body.placeType)) {
    return {
      error: { error: 'Place type must be "entire" or "room"', code: 'INVALID_PLACE_TYPE' },
      status: 400
    };
  }

  if (body.parkingType && !['free', 'paid', ''].includes(body.parkingType)) {
    return {
      error: { error: 'Parking type must be "free", "paid", or empty', code: 'INVALID_PARKING_TYPE' },
      status: 400
    };
  }

  if (body.rating !== undefined && (body.rating < 0 || body.rating > 5)) {
    return {
      error: { error: 'Rating must be between 0 and 5', code: 'INVALID_RATING' },
      status: 400
    };
  }

  if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
    return {
      error: { error: 'Price must be a positive number', code: 'INVALID_PRICE' },
      status: 400
    };
  }

  return null;
}

/**
 * Prepare update data from request body
 * 
 * Filters and formats allowed fields for property update.
 * 
 * @param body - Request body with property data
 * @returns Formatted update data
 */
export function prepareUpdateData(body: any) {
  const updateData: any = {
    updatedAt: new Date().toISOString()
  };

  // Allowed fields for update
  const allowedFields = [
    'name', 'city', 'area', 'type', 'price', 'nights', 'rating', 'imageUrl',
    'isGuestFavorite', 'description', 'address', 'country', 'latitude', 'longitude',
    'bedrooms', 'bathrooms', 'maxGuests', 'petsAllowed', 'checkInTime', 'checkOutTime',
    'isPublished', 'propertyCategory', 'placeType', 'buildingName', 'unitFloor',
    'district', 'postalCode', 'beds', 'bedroomLocks', 'parkingType', 'bio',
    'phoneNumber', 'specialDescription', 'languageCode', 'currencyCode'
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  // Handle JSON fields
  if (body.images !== undefined) updateData.images = JSON.stringify(body.images);
  if (body.amenities !== undefined) updateData.amenities = JSON.stringify(body.amenities);
  if (body.whoElse !== undefined) updateData.whoElse = JSON.stringify(body.whoElse);
  if (body.propertyRules !== undefined) updateData.propertyRules = JSON.stringify(body.propertyRules);
  if (body.safetyItems !== undefined) updateData.safetyItems = JSON.stringify(body.safetyItems);

  return updateData;
}
