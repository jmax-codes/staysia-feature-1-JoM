/**
 * PUT Handler for Rooms API
 * 
 * Updates an existing room.
 * Requires tenant authentication and property ownership verification.
 * 
 * @module api/rooms/handlers/put
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant } from '../../_utils/auth';

/**
 * PUT handler for rooms
 * 
 * Updates an existing room.
 * 
 * Request Body:
 * - id: Room ID (required)
 * - Other fields to update (optional)
 * 
 * @param request - Next.js request object
 * @returns Updated room data
 */
export async function handlePut(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await authenticateTenant(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { host } = auth;
    const body = await request.json();

    // Validate room ID
    if (!body.id || typeof body.id !== 'number') {
      return NextResponse.json({
        error: 'Valid room id is required',
        code: 'INVALID_ROOM_ID'
      }, { status: 400 });
    }

    // Verify room exists and ownership
    const room = await db.room.findUnique({
      where: { id: body.id }
    });

    if (!room) {
      return NextResponse.json({
        error: 'Room not found',
        code: 'ROOM_NOT_FOUND'
      }, { status: 404 });
    }

    const property = await db.property.findUnique({
      where: { id: room.propertyId }
    });

    if (!property || property.hostId !== host.id) {
      return NextResponse.json({
        error: 'You do not have permission to update this room',
        code: 'PERMISSION_DENIED'
      }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {
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

    // Update room
    const updatedRoom = await db.room.update({
      where: { id: body.id },
      data: updateData
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}
