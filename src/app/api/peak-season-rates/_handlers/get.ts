/**
 * Peak Season Rates GET Handler
 * 
 * Handles GET requests for peak season rate data.
 * Supports filtering by property and room.
 * 
 * @module PeakSeasonRatesGETHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { validatePositiveInteger } from '@/app/api/_utils/validation';

/**
 * Handle GET request for peak season rates
 * 
 * Retrieves peak season rates filtered by property or room.
 * At least one of propertyId or roomId must be provided.
 * 
 * @param request - Next.js request object
 * @returns JSON response with peak season rates
 * 
 * @sideEffects Queries database for peak season rates
 * 
 * @example
 * ```
 * GET /api/peak-season-rates?propertyId=1&isActive=true
 * GET /api/peak-season-rates?roomId=5
 * ```
 */
export async function handleGet(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get('roomId');
    const propertyId = searchParams.get('propertyId');
    const isActive = searchParams.get('isActive');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate at least one filter
    if (!roomId && !propertyId) {
      return NextResponse.json({
        error: 'At least one of roomId or propertyId must be provided',
        code: 'MISSING_FILTER'
      }, { status: 400 });
    }

    // Build where conditions
    const where: any = {};

    if (roomId) {
      const parsedRoomId = parseInt(roomId);
      if (!validatePositiveInteger(parsedRoomId)) {
        return NextResponse.json({
          error: 'Valid roomId is required',
          code: 'INVALID_ROOM_ID'
        }, { status: 400 });
      }
      where.OR = where.OR || [];
      where.OR.push({ roomId: parsedRoomId });
    }

    if (propertyId) {
      const parsedPropertyId = parseInt(propertyId);
      if (!validatePositiveInteger(parsedPropertyId)) {
        return NextResponse.json({
          error: 'Valid propertyId is required',
          code: 'INVALID_PROPERTY_ID'
        }, { status: 400 });
      }
      where.OR = where.OR || [];
      where.OR.push({ propertyId: parsedPropertyId });
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const results = await db.peakSeasonRate.findMany({
      where,
      orderBy: { startDate: 'asc' },
      take: limit,
      skip: offset
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}
