/**
 * Validation Utilities for Properties API
 * 
 * Validates property creation data.
 * 
 * @module api/properties/utils/validation
 */

/**
 * Validate property creation data
 * 
 * Checks required fields and data types for new properties.
 * 
 * @param body - Request body with property data
 * @returns Validation error or null if valid
 */
export function validatePropertyData(body: any) {
  // Validate name
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    return {
      error: { error: 'Name is required and must be a non-empty string', code: 'INVALID_NAME' },
      status: 400
    };
  }

  // Validate city
  if (!body.city || typeof body.city !== 'string' || body.city.trim() === '') {
    return {
      error: { error: 'City is required and must be a non-empty string', code: 'INVALID_CITY' },
      status: 400
    };
  }

  // Validate area
  if (!body.area || typeof body.area !== 'string' || body.area.trim() === '') {
    return {
      error: { error: 'Area is required and must be a non-empty string', code: 'INVALID_AREA' },
      status: 400
    };
  }

  // Validate type
  if (!body.type || typeof body.type !== 'string' || body.type.trim() === '') {
    return {
      error: { error: 'Type is required and must be a non-empty string', code: 'INVALID_TYPE' },
      status: 400
    };
  }

  // Validate imageUrl
  if (!body.imageUrl || typeof body.imageUrl !== 'string' || body.imageUrl.trim() === '') {
    return {
      error: { error: 'Image URL is required and must be a non-empty string', code: 'INVALID_IMAGE_URL' },
      status: 400
    };
  }

  // Validate price
  if (body.price === undefined || body.price === null) {
    return {
      error: { error: 'Price is required', code: 'MISSING_PRICE' },
      status: 400
    };
  }

  const priceNum = parseInt(body.price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return {
      error: { error: 'Price must be a positive integer', code: 'INVALID_PRICE' },
      status: 400
    };
  }

  // Validate rating
  if (body.rating === undefined || body.rating === null) {
    return {
      error: { error: 'Rating is required', code: 'MISSING_RATING' },
      status: 400
    };
  }

  const ratingNum = parseFloat(body.rating);
  if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
    return {
      error: { error: 'Rating must be a number between 0 and 5', code: 'INVALID_RATING' },
      status: 400
    };
  }

  // Validate nights (optional)
  if (body.nights !== undefined && body.nights !== null) {
    const nightsNum = parseInt(body.nights);
    if (isNaN(nightsNum) || nightsNum <= 0) {
      return {
        error: { error: 'Nights must be a positive integer', code: 'INVALID_NIGHTS' },
        status: 400
      };
    }
  }

  return null;
}
