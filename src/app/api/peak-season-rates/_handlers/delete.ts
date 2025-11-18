/**
 * Peak Season Rates DELETE Handler
 * 
 * Handles DELETE requests for removing peak season rates.
 * Requires authentication and ownership verification.
 * 
 * @module PeakSeasonRatesDELETEHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant, verifyPropertyOwnership, verifyRoomOwnership } from '@/app/api/_utils/auth';

/**
 * Handle DELETE request for peak season rate removal
 * 
 * Deletes an existing peak season rate.
 * Verifies ownership before deletion.
 * 
 * @param request - Next.js request object
 * @returns JSON response confirming deletion
 * 
 * @sideEffects Deletes peak season rate from database
 * 
 * @example
 * ```
 * DELETE /api/peak-season-rates?id=5
 * Authorization: Bearer <token>
 * ```
 */
export async function handleDelete(request: NextRequest) {
  try {
    // Authenticate
    const auth = await authenticateTenant(request);
    if (!auth || 'error' in auth) {
      return NextResponse.json({
        error: auth?.error || 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: 'Valid id is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const rateId = parseInt(id);

    // Get existing rate
    const existingRate = await db.peakSeasonRate.findUnique({
      where: { id: rateId }
    });

    if (!existingRate) {
      return NextResponse.json({
        error: 'Peak season rate not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    // Verify ownership
    const ownership = await verifyOwnership(
      auth.host.id,
      existingRate.roomId,
      existingRate.propertyId
    );
    
    if (!ownership.valid) {
      return NextResponse.json({
        error: ownership.error,
        code: 'OWNERSHIP_VERIFICATION_FAILED'
      }, { status: 403 });
    }

    // Delete record
    const deleted = await db.peakSeasonRate.delete({
      where: { id: rateId }
    });

    return NextResponse.json({
      message: 'Peak season rate deleted successfully',
      deletedRate: deleted
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

/**
 * Verify ownership of property or room
 */
async function verifyOwnership(
  hostId: number,
  roomId: number | null,
  propertyId: number | null
): Promise<{ valid: boolean; error?: string }> {
  if (roomId) {
    return await verifyRoomOwnership(hostId, roomId);
  }

  if (propertyId) {
    return await verifyPropertyOwnership(hostId, propertyId);
  }

  return { valid: false, error: 'Either roomId or propertyId must be provided' };
}
