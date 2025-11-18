/**
 * Peak Season Rates PUT Handler
 * 
 * Handles PUT requests for updating peak season rates.
 * Requires authentication and ownership verification.
 * 
 * @module PeakSeasonRatesPUTHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant, verifyPropertyOwnership, verifyRoomOwnership } from '@/app/api/_utils/auth';
import { validateDateFormat, validateDateRange, validatePositiveInteger, validatePercentage } from '@/app/api/_utils/validation';

/**
 * Handle PUT request for peak season rate update
 * 
 * Updates an existing peak season rate.
 * Validates ownership and data integrity.
 * 
 * @param request - Next.js request object
 * @returns JSON response with updated peak season rate
 * 
 * @sideEffects Updates peak season rate in database
 * 
 * @example
 * ```
 * PUT /api/peak-season-rates
 * Authorization: Bearer <token>
 * {
 *   "id": 5,
 *   "priceIncrease": 250,
 *   "isActive": true
 * }
 * ```
 */
export async function handlePut(request: NextRequest) {
  try {
    // Authenticate
    const auth = await authenticateTenant(request);
    if (!auth || 'error' in auth) {
      return NextResponse.json({
        error: auth?.error || 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, startDate, endDate, priceIncrease, percentageIncrease, isActive } = body;

    // Validate ID
    if (!validatePositiveInteger(id)) {
      return NextResponse.json({
        error: 'Valid id is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    // Get existing rate
    const existingRate = await db.peakSeasonRate.findUnique({
      where: { id }
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

    // Validate updates
    const validation = validateUpdateData(body, existingRate);
    if (!validation.valid) {
      return NextResponse.json({
        error: validation.error,
        code: validation.code
      }, { status: 400 });
    }

    // Build update object
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (startDate !== undefined) updates.startDate = startDate;
    if (endDate !== undefined) updates.endDate = endDate;
    if (priceIncrease !== undefined) updates.priceIncrease = priceIncrease;
    if (percentageIncrease !== undefined) updates.percentageIncrease = percentageIncrease;
    if (isActive !== undefined) updates.isActive = isActive;

    // Update record
    const updatedRate = await db.peakSeasonRate.update({
      where: { id },
      data: updates
    });

    return NextResponse.json(updatedRate, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

/**
 * Validate peak season rate update data
 */
function validateUpdateData(
  body: any,
  existingRate: any
): { valid: boolean; error?: string; code?: string } {
  const { startDate, endDate, priceIncrease, percentageIncrease, isActive } = body;

  // Validate dates if provided
  if (startDate !== undefined && !validateDateFormat(startDate)) {
    return {
      valid: false,
      error: 'startDate must be in YYYY-MM-DD format',
      code: 'INVALID_DATE_FORMAT'
    };
  }

  if (endDate !== undefined && !validateDateFormat(endDate)) {
    return {
      valid: false,
      error: 'endDate must be in YYYY-MM-DD format',
      code: 'INVALID_DATE_FORMAT'
    };
  }

  // Validate date range
  const finalStartDate = startDate !== undefined ? startDate : existingRate.startDate;
  const finalEndDate = endDate !== undefined ? endDate : existingRate.endDate;

  if (!validateDateRange(finalStartDate, finalEndDate)) {
    return {
      valid: false,
      error: 'startDate must be less than or equal to endDate',
      code: 'INVALID_DATE_RANGE'
    };
  }

  // Validate price increase if provided
  if (priceIncrease !== undefined && !validatePositiveInteger(priceIncrease)) {
    return {
      valid: false,
      error: 'priceIncrease must be a positive integer',
      code: 'INVALID_PRICE_INCREASE'
    };
  }

  // Validate percentage if provided
  if (percentageIncrease !== undefined && percentageIncrease !== null) {
    if (!validatePercentage(percentageIncrease)) {
      return {
        valid: false,
        error: 'percentageIncrease must be between 0 and 100',
        code: 'INVALID_PERCENTAGE_INCREASE'
      };
    }
  }

  // Validate isActive if provided
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return {
      valid: false,
      error: 'isActive must be a boolean',
      code: 'INVALID_IS_ACTIVE'
    };
  }

  return { valid: true };
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
