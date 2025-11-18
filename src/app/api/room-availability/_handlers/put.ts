/**
 * PUT Handler for Room Availability API
 * 
 * Updates a single availability record by ID.
 * Requires tenant authentication and room ownership verification.
 * 
 * @module api/room-availability/handlers/put
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateAndVerifyTenant, verifyRoomOwnership } from '../_utils/auth';

/**
 * PUT handler for room availability
 * 
 * Updates a single availability record.
 * 
 * Request Body:
 * - id: Availability record ID
 * - isAvailable: New availability status
 * 
 * @param request - Next.js request object
 * @returns Updated availability record
 */
export async function handlePut(request: NextRequest) {
  try {
    // Authenticate and verify tenant
    const authResult = await authenticateAndVerifyTenant(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { host } = authResult;
    const body = await request.json();
    const { id, isAvailable } = body;

    // Validate required fields
    if (!id || typeof isAvailable !== 'boolean') {
      return NextResponse.json({ 
        error: 'Missing required fields: id, isAvailable',
        code: 'MISSING_REQUIRED_FIELDS' 
      }, { status: 400 });
    }

    if (typeof id !== 'number' || id <= 0) {
      return NextResponse.json({ 
        error: 'Valid id is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Find availability record
    const availabilityRecord = await db.roomAvailability.findUnique({
      where: { id }
    });

    if (!availabilityRecord) {
      return NextResponse.json({ 
        error: 'Availability record not found',
        code: 'RECORD_NOT_FOUND' 
      }, { status: 404 });
    }

    // Verify room ownership
    const ownershipResult = await verifyRoomOwnership(availabilityRecord.roomId, host.id);
    if ('error' in ownershipResult) {
      return NextResponse.json({ error: ownershipResult.error }, { status: ownershipResult.status });
    }

    // Update record
    const updated = await db.roomAvailability.update({
      where: { id },
      data: {
        isAvailable,
        updatedAt: new Date().toISOString()
      }
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
