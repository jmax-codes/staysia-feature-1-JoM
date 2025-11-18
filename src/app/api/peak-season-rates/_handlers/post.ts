/**
 * Peak Season Rates POST Handler
 * 
 * Handles POST requests for creating peak season rates.
 * Requires authentication and ownership verification.
 * 
 * @module PeakSeasonRatesPOSTHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant, verifyPropertyOwnership, verifyRoomOwnership } from '@/app/api/_utils/auth';
import { validateDateFormat, validateDateRange, validatePositiveInteger, validatePercentage } from '@/app/api/_utils/validation';

/**
 * Handle POST request for peak season rate creation
 * 
 * Creates a new peak season rate for a property or room.
 * Validates date range and pricing rules.
 * 
 * @param request - Next.js request object
 * @returns JSON response with created peak season rate
 * 
 * @sideEffects Creates peak season rate in database
 * 
 * @example
 * ```
 * POST /api/peak-season-rates
 * Authorization: Bearer <token>
 * {
 *   "propertyId": 1,
 *   "startDate": "2024-12-20",
 *   "endDate": "2024-12-31",
 *   "priceIncrease": 200,
 *   "percentageIncrease": 40
 * }
 * ```
 */
export async function handlePost(request: NextRequest) {
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
    const { roomId, propertyId, startDate, endDate, priceIncrease, percentageIncrease, isActive } = body;

    // Validate required fields
    const validation = validateCreateData(body);
    if (!validation.valid) {
      return NextResponse.json({
        error: validation.error,
        code: validation.code
      }, { status: 400 });
    }

    // Verify ownership
    const ownership = await verifyOwnership(auth.host.id, roomId, propertyId);
    if (!ownership.valid) {
      return NextResponse.json({
        error: ownership.error,
        code: 'OWNERSHIP_VERIFICATION_FAILED'
      }, { status: 403 });
    }

    // Create record
    const now = new Date().toISOString();
    const insertData: any = {
      roomId: roomId || null,
      propertyId: propertyId || null,
      startDate,
      endDate,
      priceIncrease,
      percentageIncrease: percentageIncrease !== undefined ? percentageIncrease : null,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: now,
      updatedAt: now
    };

    const newRate = await db.peakSeasonRate.create({
      data: insertData
    });

    return NextResponse.json(newRate, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

/**
 * Validate peak season rate creation data
 */
function validateCreateData(body: any): { valid: boolean; error?: string; code?: string } {
  const { roomId, propertyId, startDate, endDate, priceIncrease, percentageIncrease } = body;

  // At least one of roomId or propertyId required
  if (!roomId && !propertyId) {
    return {
      valid: false,
      error: 'At least one of roomId or propertyId must be provided',
      code: 'MISSING_REQUIRED_FIELD'
    };
  }

  // Validate IDs
  if (roomId && !validatePositiveInteger(roomId)) {
    return {
      valid: false,
      error: 'Valid roomId must be a positive integer',
      code: 'INVALID_ROOM_ID'
    };
  }

  if (propertyId && !validatePositiveInteger(propertyId)) {
    return {
      valid: false,
      error: 'Valid propertyId must be a positive integer',
      code: 'INVALID_PROPERTY_ID'
    };
  }

  // Validate dates
  if (!startDate || !endDate) {
    return {
      valid: false,
      error: 'startDate and endDate are required',
      code: 'MISSING_DATES'
    };
  }

  if (!validateDateFormat(startDate) || !validateDateFormat(endDate)) {
    return {
      valid: false,
      error: 'Dates must be in YYYY-MM-DD format',
      code: 'INVALID_DATE_FORMAT'
    };
  }

  if (!validateDateRange(startDate, endDate)) {
    return {
      valid: false,
      error: 'startDate must be less than or equal to endDate',
      code: 'INVALID_DATE_RANGE'
    };
  }

  // Validate price increase
  if (!validatePositiveInteger(priceIncrease)) {
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

  return { valid: true };
}

/**
 * Verify ownership of property or room
 */
async function verifyOwnership(
  hostId: number,
  roomId: number | undefined,
  propertyId: number | undefined
): Promise<{ valid: boolean; error?: string }> {
  if (roomId) {
    return await verifyRoomOwnership(hostId, roomId);
  }

  if (propertyId) {
    return await verifyPropertyOwnership(hostId, propertyId);
  }

  return { valid: false, error: 'Either roomId or propertyId must be provided' };
}
