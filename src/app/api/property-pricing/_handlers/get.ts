/**
 * Property Pricing GET Handler
 * 
 * Handles GET requests for property pricing data.
 * Supports filtering by property, room, dates, and status.
 * 
 * @module PropertyPricingGETHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { validateDateFormat, validatePositiveInteger } from '@/app/api/_utils/validation';

/**
 * Handle GET request for property pricing
 * 
 * Retrieves pricing data with optional filters:
 * - Single record by ID
 * - List filtered by propertyId, roomId, date range, status
 * 
 * @param request - Next.js request object
 * @returns JSON response with pricing data
 * 
 * @sideEffects Queries database for pricing records
 * 
 * @example
 * ```
 * GET /api/property-pricing?propertyId=1&startDate=2024-01-01
 * GET /api/property-pricing?id=123
 * ```
 */
export async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const propertyId = searchParams.get('propertyId');
    const roomId = searchParams.get('roomId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 365);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single record by ID
    if (id) {
      return await getSingleRecord(parseInt(id));
    }

    // List with filters
    return await getFilteredRecords({
      propertyId,
      roomId,
      startDate,
      endDate,
      status,
      limit,
      offset,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

/**
 * Get single pricing record by ID
 */
async function getSingleRecord(id: number) {
  if (isNaN(id)) {
    return NextResponse.json({
      error: 'Valid ID is required',
      code: 'INVALID_ID'
    }, { status: 400 });
  }

  const record = await db.propertyPricing.findUnique({
    where: { id }
  });

  if (!record) {
    return NextResponse.json({
      error: 'Pricing record not found',
      code: 'NOT_FOUND'
    }, { status: 404 });
  }

  // Map priceType to status for frontend compatibility
  const result = {
    ...record,
    status: record.priceType
  };

  return NextResponse.json(result, { status: 200 });
}

/**
 * Get filtered pricing records
 */
async function getFilteredRecords(params: {
  propertyId: string | null;
  roomId: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  limit: number;
  offset: number;
}) {
  const { propertyId, roomId, startDate, endDate, status, limit, offset } = params;

  // Validate required property ID
  if (!propertyId) {
    return NextResponse.json({
      error: 'Property ID is required',
      code: 'PROPERTY_ID_REQUIRED'
    }, { status: 400 });
  }

  if (!validatePositiveInteger(parseInt(propertyId))) {
    return NextResponse.json({
      error: 'Valid Property ID is required',
      code: 'INVALID_PROPERTY_ID'
    }, { status: 400 });
  }

  // Validate dates
  if (startDate && !validateDateFormat(startDate)) {
    return NextResponse.json({
      error: 'Start date must be in ISO format (YYYY-MM-DD)',
      code: 'INVALID_START_DATE'
    }, { status: 400 });
  }

  if (endDate && !validateDateFormat(endDate)) {
    return NextResponse.json({
      error: 'End date must be in ISO format (YYYY-MM-DD)',
      code: 'INVALID_END_DATE'
    }, { status: 400 });
  }

  // Validate room ID
  if (roomId && !validatePositiveInteger(parseInt(roomId))) {
    return NextResponse.json({
      error: 'Valid Room ID is required',
      code: 'INVALID_ROOM_ID'
    }, { status: 400 });
  }

  // Build where conditions
  const where: any = { propertyId: parseInt(propertyId) };

  if (roomId) {
    where.roomId = parseInt(roomId);
  }

  if (startDate) {
    where.date = { ...where.date, gte: startDate };
  }

  if (endDate) {
    where.date = { ...where.date, lte: endDate };
  }

  if (status) {
    where.priceType = { equals: status, mode: 'insensitive' };
  }

  const results = await db.propertyPricing.findMany({
    where,
    orderBy: { date: 'asc' },
    take: limit,
    skip: offset,
  });

  // Map priceType to status for frontend compatibility
  const mappedResults = results.map(record => ({
    ...record,
    status: record.priceType
  }));

  return NextResponse.json(mappedResults, { status: 200 });
}
