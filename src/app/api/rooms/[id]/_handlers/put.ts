/**
 * PUT Handler for Single Room API
 * 
 * Updates a specific room's details.
 * Requires tenant authentication and property ownership verification.
 * 
 * @module api/rooms/[id]/handlers/put
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant, verifyRoomOwnership } from '../_utils/auth';
import { validateRoomData } from '../_utils/validation';

/**
 * PUT handler for single room update
 * 
 * Updates room details after authentication and ownership verification.
 * 
 * Request Body: Room fields to update (all optional except validation requirements)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters with room ID
 * @returns Updated room data
 */
export async function handlePut(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await authenticateTenant(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error, code: authResult.code },
        { status: authResult.status }
      );
    }

    const { host } = authResult;
    const id = params.id;

    // Validate room ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid room ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const roomId = parseInt(id);

    // Verify room ownership
    const ownershipResult = await verifyRoomOwnership(roomId, host.id);
    if ('error' in ownershipResult) {
      return NextResponse.json(
        { error: ownershipResult.error, code: ownershipResult.code },
        { status: ownershipResult.status }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = validateRoomData(body);
    
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error, code: validationResult.code },
        { status: 400 }
      );
    }

    // Prepare update object
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
    const updated = await db.room.update({
      where: { id: roomId },
      data: updateData
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error('PUT room error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
