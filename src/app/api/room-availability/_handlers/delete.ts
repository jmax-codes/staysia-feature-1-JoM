/**
 * DELETE Handler for Room Availability API
 * 
 * Deletes a single availability record by ID.
 * Requires tenant authentication and room ownership verification.
 * 
 * @module api/room-availability/handlers/delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateAndVerifyTenant, verifyRoomOwnership } from '../_utils/auth';

/**
 * DELETE handler for room availability
 * 
 * Deletes a single availability record.
 * 
 * Query Parameters:
 * - id: Availability record ID to delete
 * 
 * @param request - Next.js request object
 * @returns Success response with deleted record
 */
export async function handleDelete(request: NextRequest) {
  try {
    // Authenticate and verify tenant
    const authResult = await authenticateAndVerifyTenant(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { host } = authResult;
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id) {
      return NextResponse.json({ 
        error: 'id parameter is required',
        code: 'MISSING_ID' 
      }, { status: 400 });
    }

    const idInt = parseInt(id);
    if (isNaN(idInt) || idInt <= 0) {
      return NextResponse.json({ 
        error: 'Valid id is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Find availability record
    const availabilityRecord = await db.roomAvailability.findUnique({
      where: { id: idInt }
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

    // Delete record
    const deleted = await db.roomAvailability.delete({
      where: { id: idInt }
    });

    return NextResponse.json({
      success: true,
      message: 'Availability record deleted successfully',
      deletedRecord: deleted
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
