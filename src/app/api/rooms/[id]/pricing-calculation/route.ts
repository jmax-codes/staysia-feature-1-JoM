/**
 * Room Pricing Calculation API Route
 * 
 * Calculates room pricing for date ranges considering availability,
 * best deals, and peak season rates.
 * 
 * @module api/rooms/[id]/pricing-calculation
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { isValidDateFormat, getDateRange, getDaysDifference } from './_utils/date-helpers';
import { calculatePricing } from './_utils/pricing-calculator';

/**
 * GET /api/rooms/[id]/pricing-calculation
 * 
 * Calculates total and nightly pricing for a room over a date range.
 * 
 * @param request - Request with startDate and endDate query params
 * @param params - Route params with room ID
 * @returns Pricing breakdown and totals
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    // Validate room ID
    const roomId = parseInt(id);
    if (isNaN(roomId) || roomId <= 0) {
      return NextResponse.json({
        error: 'Valid room ID is required',
        code: 'INVALID_ROOM_ID'
      }, { status: 400 });
    }

    // Validate date parameters
    if (!startDate || !endDate) {
      return NextResponse.json({
        error: 'Both startDate and endDate are required',
        code: 'MISSING_DATE_PARAMETERS'
      }, { status: 400 });
    }

    if (!isValidDateFormat(startDate)) {
      return NextResponse.json({
        error: 'startDate must be in YYYY-MM-DD format',
        code: 'INVALID_START_DATE_FORMAT'
      }, { status: 400 });
    }

    if (!isValidDateFormat(endDate)) {
      return NextResponse.json({
        error: 'endDate must be in YYYY-MM-DD format',
        code: 'INVALID_END_DATE_FORMAT'
      }, { status: 400 });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({
        error: 'startDate must be less than or equal to endDate',
        code: 'INVALID_DATE_RANGE'
      }, { status: 400 });
    }

    if (getDaysDifference(startDate, endDate) > 365) {
      return NextResponse.json({
        error: 'Date range cannot exceed 365 days',
        code: 'DATE_RANGE_TOO_LARGE'
      }, { status: 400 });
    }

    // Fetch room
    const room = await db.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return NextResponse.json({
        error: 'Room not found',
        code: 'ROOM_NOT_FOUND'
      }, { status: 404 });
    }

    const basePricePerNight = room.pricePerNight;
    const dateRange = getDateRange(startDate, endDate);
    const nights = dateRange.length;

    // Calculate pricing
    const { pricingDetails, breakdown } = await calculatePricing(
      roomId,
      room.propertyId,
      basePricePerNight,
      dateRange,
      startDate,
      endDate
    );

    // Check if all dates unavailable
    if (breakdown.unavailableNights === nights) {
      return NextResponse.json({
        error: 'All dates in the requested range are unavailable',
        code: 'ALL_DATES_UNAVAILABLE',
        unavailableDates: breakdown.unavailableDates
      }, { status: 400 });
    }

    // Calculate totals
    const totalPrice = pricingDetails
      .filter(detail => detail.type !== 'unavailable')
      .reduce((sum, detail) => sum + detail.price, 0);

    const availableNights = nights - breakdown.unavailableNights;
    const averagePricePerNight = availableNights > 0 
      ? Math.round(totalPrice / availableNights) 
      : 0;

    return NextResponse.json({
      roomId: room.id,
      roomName: room.name,
      basePricePerNight,
      startDate,
      endDate,
      nights,
      breakdown,
      pricing: pricingDetails,
      totalPrice,
      averagePricePerNight
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}