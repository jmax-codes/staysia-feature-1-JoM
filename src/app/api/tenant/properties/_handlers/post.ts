/**
 * Tenant Properties POST Handler
 * 
 * Handles POST requests for creating new properties.
 * Supports property creation with images, amenities, and rooms.
 * 
 * @module TenantPropertiesPOSTHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant } from '@/app/api/_utils/auth';

/**
 * Handle POST request for property creation
 * 
 * Creates a new property with optional related data:
 * - Property images
 * - Property amenities
 * - Rooms with details
 * 
 * @param request - Next.js request object
 * @returns JSON response with created property
 * 
 * @sideEffects Creates property, images, amenities, and rooms in database
 * 
 * @example
 * ```
 * POST /api/tenant/properties
 * Authorization: Bearer <token>
 * {
 *   "name": "Luxury Villa",
 *   "city": "Jakarta",
 *   "area": "South Jakarta",
 *   "type": "Villa",
 *   "price": 500000,
 *   "imageUrl": "https://...",
 *   "rooms": [...],
 *   "amenities": [...]
 * }
 * ```
 */
export async function handlePost(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await authenticateTenant(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { userId } = auth;

    // Get host profile
    const host = await db.host.findFirst({
      where: { userId }
    });

    if (!host) {
      return NextResponse.json({ 
        error: 'Host profile not found. Please create host profile first.',
        code: 'HOST_PROFILE_NOT_FOUND'
      }, { status: 404 });
    }

    const hostId = host.id;

    // Parse and validate request body
    const body = await request.json();
    const validation = validatePropertyData(body);
    
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.error,
        code: validation.code
      }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Create property
    const propertyData = buildPropertyData(body, hostId, timestamp);
    const newProperty = await db.property.create({
      data: propertyData
    });
      
    const propertyId = newProperty.id;

    // Insert related data
    const insertedImages = await insertPropertyImages(propertyId, body.images, timestamp);
    const insertedAmenities = await insertPropertyAmenities(propertyId, body.amenities, timestamp);
    const insertedRooms = await insertPropertyRooms(propertyId, body.rooms, timestamp);

    // Build complete response
    const completeProperty = buildCompleteResponse(
      newProperty,
      insertedImages,
      insertedAmenities,
      insertedRooms
    );

    return NextResponse.json(completeProperty, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

/**
 * Validate property creation data
 */
function validatePropertyData(body: any): { valid: boolean; error?: string; code?: string } {
  // Required fields
  if (!body.name || body.name.trim() === '') {
    return { valid: false, error: 'Property name is required', code: 'MISSING_NAME' };
  }

  if (!body.city || body.city.trim() === '') {
    return { valid: false, error: 'City is required', code: 'MISSING_CITY' };
  }

  if (!body.area || body.area.trim() === '') {
    return { valid: false, error: 'Area is required', code: 'MISSING_AREA' };
  }

  if (!body.type || body.type.trim() === '') {
    return { valid: false, error: 'Property type is required', code: 'MISSING_TYPE' };
  }

  if (!body.price || typeof body.price !== 'number' || body.price <= 0) {
    return { valid: false, error: 'Valid price (positive number) is required', code: 'INVALID_PRICE' };
  }

  if (!body.imageUrl || body.imageUrl.trim() === '') {
    return { valid: false, error: 'Image URL is required', code: 'MISSING_IMAGE_URL' };
  }

  // Optional field validation
  if (body.rating !== undefined && (body.rating < 0 || body.rating > 5)) {
    return { valid: false, error: 'Rating must be between 0 and 5', code: 'INVALID_RATING' };
  }

  if (body.maxGuests !== undefined && (typeof body.maxGuests !== 'number' || body.maxGuests <= 0)) {
    return { valid: false, error: 'Max guests must be a positive number', code: 'INVALID_MAX_GUESTS' };
  }

  // Validate rooms if provided
  if (body.rooms && Array.isArray(body.rooms)) {
    const roomValidation = validateRooms(body.rooms);
    if (!roomValidation.valid) {
      return roomValidation;
    }
  }

  return { valid: true };
}

/**
 * Validate rooms data
 */
function validateRooms(rooms: any[]): { valid: boolean; error?: string; code?: string } {
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    
    if (!room.name || room.name.trim() === '') {
      return { valid: false, error: `Room ${i + 1}: name is required`, code: 'ROOM_MISSING_NAME' };
    }
    
    if (!room.type || room.type.trim() === '') {
      return { valid: false, error: `Room ${i + 1}: type is required`, code: 'ROOM_MISSING_TYPE' };
    }
    
    if (!room.pricePerNight || typeof room.pricePerNight !== 'number' || room.pricePerNight <= 0) {
      return { valid: false, error: `Room ${i + 1}: valid pricePerNight (positive number) is required`, code: 'ROOM_INVALID_PRICE' };
    }
    
    if (!room.maxGuests || typeof room.maxGuests !== 'number' || room.maxGuests <= 0) {
      return { valid: false, error: `Room ${i + 1}: valid maxGuests (positive number) is required`, code: 'ROOM_INVALID_MAX_GUESTS' };
    }
  }
  
  return { valid: true };
}

/**
 * Build property data object for insertion
 */
function buildPropertyData(body: any, hostId: number, timestamp: string): any {
  return {
    name: body.name.trim(),
    city: body.city.trim(),
    area: body.area.trim(),
    type: body.type.trim(),
    price: body.price,
    nights: body.nights || 2,
    rating: body.rating || 0,
    imageUrl: body.imageUrl.trim(),
    isGuestFavorite: body.isGuestFavorite || false,
    description: body.description?.trim() || null,
    address: body.address?.trim() || null,
    country: body.country?.trim() || null,
    latitude: body.latitude || null,
    longitude: body.longitude || null,
    bedrooms: body.bedrooms || null,
    bathrooms: body.bathrooms || null,
    maxGuests: body.maxGuests || null,
    petsAllowed: body.petsAllowed || false,
    checkInTime: body.checkInTime?.trim() || null,
    checkOutTime: body.checkOutTime?.trim() || null,
    images: body.images ? JSON.stringify(body.images) : null,
    amenities: body.amenities ? JSON.stringify(body.amenities) : null,
    hostId,
    isPublished: body.isPublished !== undefined ? body.isPublished : true,
    propertyCategory: body.propertyCategory?.trim() || null,
    placeType: body.placeType?.trim() || null,
    buildingName: body.buildingName?.trim() || null,
    unitFloor: body.unitFloor?.trim() || null,
    district: body.district?.trim() || null,
    postalCode: body.postalCode?.trim() || null,
    beds: body.beds || null,
    bedroomLocks: body.bedroomLocks || null,
    whoElse: body.whoElse ? JSON.stringify(body.whoElse) : null,
    parkingType: body.parkingType?.trim() || null,
    propertyRules: body.propertyRules ? JSON.stringify(body.propertyRules) : null,
    safetyItems: body.safetyItems ? JSON.stringify(body.safetyItems) : null,
    bio: body.bio?.trim() || null,
    phoneNumber: body.phoneNumber?.trim() || null,
    specialDescription: body.specialDescription?.trim() || null,
    languageCode: body.languageCode?.trim() || null,
    currencyCode: body.currencyCode?.trim() || null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Insert property images
 */
async function insertPropertyImages(
  propertyId: number,
  images: any[] | undefined,
  timestamp: string
): Promise<any[]> {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [];
  }

  const imageValues = images.map((img: any) => ({
    propertyId,
    imageUrl: img.url,
    displayOrder: img.displayOrder || 0,
    isCover: img.isCover || false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  await db.propertyImage.createMany({
    data: imageValues
  });

  return await db.propertyImage.findMany({
    where: { propertyId }
  });
}

/**
 * Insert property amenities
 */
async function insertPropertyAmenities(
  propertyId: number,
  amenities: any[] | undefined,
  timestamp: string
): Promise<any[]> {
  if (!amenities || !Array.isArray(amenities) || amenities.length === 0) {
    return [];
  }

  const amenityValues = amenities.map((amenity: any) => ({
    propertyId,
    amenityName: amenity.name,
    amenityType: amenity.type || 'standard',
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  await db.propertyAmenity.createMany({
    data: amenityValues
  });

  return await db.propertyAmenity.findMany({
    where: { propertyId }
  });
}

/**
 * Insert property rooms
 */
async function insertPropertyRooms(
  propertyId: number,
  rooms: any[] | undefined,
  timestamp: string
): Promise<any[]> {
  if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    return [];
  }

  const roomValues = rooms.map((room: any) => ({
    propertyId,
    name: room.name,
    type: room.type,
    pricePerNight: room.pricePerNight,
    maxGuests: room.maxGuests,
    beds: room.beds ? JSON.stringify(room.beds) : null,
    size: room.size || null,
    amenities: room.amenities ? JSON.stringify(room.amenities) : null,
    available: room.available !== undefined ? room.available : true,
    roomNumber: room.roomNumber || null,
    inRoomAmenities: room.inRoomAmenities ? JSON.stringify(room.inRoomAmenities) : null,
    bathroomFacilities: room.bathroomFacilities ? JSON.stringify(room.bathroomFacilities) : null,
    additionalFeatures: room.additionalFeatures ? JSON.stringify(room.additionalFeatures) : null,
    technologyComfort: room.technologyComfort ? JSON.stringify(room.technologyComfort) : null,
    extraServices: room.extraServices ? JSON.stringify(room.extraServices) : null,
    hasLock: room.hasLock || null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  await db.room.createMany({
    data: roomValues
  });

  const insertedRooms = await db.room.findMany({
    where: { propertyId }
  });

  // Parse JSON fields
  return insertedRooms.map(room => ({
    ...room,
    beds: room.beds ? JSON.parse(room.beds as string) : null,
    amenities: room.amenities ? JSON.parse(room.amenities as string) : null,
    inRoomAmenities: room.inRoomAmenities ? JSON.parse(room.inRoomAmenities as string) : null,
    bathroomFacilities: room.bathroomFacilities ? JSON.parse(room.bathroomFacilities as string) : null,
    additionalFeatures: room.additionalFeatures ? JSON.parse(room.additionalFeatures as string) : null,
    technologyComfort: room.technologyComfort ? JSON.parse(room.technologyComfort as string) : null,
    extraServices: room.extraServices ? JSON.parse(room.extraServices as string) : null,
  }));
}

/**
 * Build complete property response with related data
 */
function buildCompleteResponse(
  property: any,
  images: any[],
  amenities: any[],
  rooms: any[]
): any {
  // Parse JSON fields for property
  const responseProperty = {
    ...property,
    images: property.images ? JSON.parse(property.images as string) : null,
    amenities: property.amenities ? JSON.parse(property.amenities as string) : null,
    whoElse: property.whoElse ? JSON.parse(property.whoElse as string) : null,
    propertyRules: property.propertyRules ? JSON.parse(property.propertyRules as string) : null,
    safetyItems: property.safetyItems ? JSON.parse(property.safetyItems as string) : null,
  };

  return {
    ...responseProperty,
    propertyImages: images,
    propertyAmenities: amenities,
    rooms: rooms,
  };
}
