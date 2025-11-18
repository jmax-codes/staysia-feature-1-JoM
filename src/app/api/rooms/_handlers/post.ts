/**
 * POST Handler for Rooms API
 * 
 * Creates a new room for a property.
 * Requires tenant authentication and property ownership verification.
 * 
 * @module api/rooms/handlers/post
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant } from '../../_utils/auth';

/**
 * POST handler for rooms
 * 
 * Creates a new room for a property.
 * 
 * Request Body:
 * - propertyId: Property ID (required)
 * - name: Room name (required)
 * - type: Room type (required)
 * - pricePerNight: Price per night (required, > 0)
 * - maxGuests: Maximum guests (required, > 0)
 * - beds: Bed configuration (optional)
 * - size: Room size in sqm (optional)
 * - amenities: Room amenities (optional)
 * - available: Availability status (optional, default true)
 * - roomNumber: Room number (optional)
 * - Additional amenity fields (optional)
 * 
 * @param request - Next.js request object
 * @returns Created room data
 */
export async function handlePost(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await authenticateTenant(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { host } = auth;
    const body = await request.json();

    // Validate required fields
    if (!body.propertyId || typeof body.propertyId !== 'number') {
      return NextResponse.json({
        error: 'Valid propertyId is required',
        code: 'INVALID_PROPERTY_ID'
      }, { status: 400 });
    }

    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json({
        error: 'Room name is required',
        code: 'MISSING_NAME'
      }, { status: 400 });
    }

    if (!body.type || typeof body.type !== 'string' || body.type.trim() === '') {
      return NextResponse.json({
        error: 'Room type is required',
        code: 'MISSING_TYPE'
      }, { status: 400 });
    }

    if (!body.pricePerNight || typeof body.pricePerNight !== 'number' || body.pricePerNight <= 0) {
      return NextResponse.json({
        error: 'Valid pricePerNight is required',
        code: 'INVALID_PRICE'
      }, { status: 400 });
    }

    if (!body.maxGuests || typeof body.maxGuests !== 'number' || body.maxGuests <= 0) {
      return NextResponse.json({
        error: 'Valid maxGuests is required',
        code: 'INVALID_MAX_GUESTS'
      }, { status: 400 });
    }

    // Verify property ownership
    const property = await db.property.findUnique({
      where: { id: body.propertyId }
    });

    if (!property) {
      return NextResponse.json({
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      }, { status: 404 });
    }

    if (property.hostId !== host.id) {
      return NextResponse.json({
        error: 'You do not have permission to add rooms to this property',
        code: 'PERMISSION_DENIED'
      }, { status: 403 });
    }

    const timestamp = new Date().toISOString();

    // Create room
    const newRoom = await db.room.create({
      data: {
        propertyId: body.propertyId,
        name: body.name.trim(),
        type: body.type.trim(),
        pricePerNight: body.pricePerNight,
        maxGuests: body.maxGuests,
        beds: body.beds || null,
        size: body.size || null,
        amenities: body.amenities || null,
        available: body.available !== undefined ? body.available : true,
        roomNumber: body.roomNumber || null,
        inRoomAmenities: body.inRoomAmenities || null,
        bathroomFacilities: body.bathroomFacilities || null,
        additionalFeatures: body.additionalFeatures || null,
        technologyComfort: body.technologyComfort || null,
        extraServices: body.extraServices || null,
        hasLock: body.hasLock || null,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}
