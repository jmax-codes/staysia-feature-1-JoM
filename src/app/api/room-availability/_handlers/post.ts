/**
 * POST Handler for Room Availability API
 * 
 * Creates or updates room availability records for a date range.
 * Requires tenant authentication and room ownership verification.
 * 
 * @module api/room-availability/handlers/post
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateAndVerifyTenant, verifyRoomOwnership } from '../_utils/auth';

/**
 * Validates date format (YYYY-MM-DD)
 */
function validateDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Calculates days difference between two dates
 */
function calculateDaysDifference(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generates array of dates between start and end (inclusive)
 */
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * POST handler for room availability
 * 
 * Creates or updates availability records for a date range.
 * 
 * Request Body:
 * - roomId: Room ID
 * - startDate: Start date (YYYY-MM-DD)
 * - endDate: End date (YYYY-MM-DD)
 * - isAvailable: Availability status
 * 
 * @param request - Next.js request object
 * @returns Success response with created/updated counts
 */
export async function handlePost(request: NextRequest) {
  try {
    // Authenticate and verify tenant
    const authResult = await authenticateAndVerifyTenant(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { host } = authResult;
    const body = await request.json();
    const { roomId, startDate, endDate, isAvailable } = body;

    // Validate required fields
    if (!roomId || !startDate || !endDate || typeof isAvailable !== 'boolean') {
      return NextResponse.json({ 
        error: 'Missing required fields: roomId, startDate, endDate, isAvailable',
        code: 'MISSING_REQUIRED_FIELDS' 
      }, { status: 400 });
    }

    if (typeof roomId !== 'number' || roomId <= 0) {
      return NextResponse.json({ 
        error: 'Valid roomId is required',
        code: 'INVALID_ROOM_ID' 
      }, { status: 400 });
    }

    // Verify room ownership
    const ownershipResult = await verifyRoomOwnership(roomId, host.id);
    if ('error' in ownershipResult) {
      return NextResponse.json({ error: ownershipResult.error }, { status: ownershipResult.status });
    }

    // Validate dates
    if (!validateDateFormat(startDate)) {
      return NextResponse.json({ 
        error: 'Invalid startDate format. Use YYYY-MM-DD',
        code: 'INVALID_START_DATE' 
      }, { status: 400 });
    }

    if (!validateDateFormat(endDate)) {
      return NextResponse.json({ 
        error: 'Invalid endDate format. Use YYYY-MM-DD',
        code: 'INVALID_END_DATE' 
      }, { status: 400 });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ 
        error: 'startDate must be before or equal to endDate',
        code: 'INVALID_DATE_RANGE' 
      }, { status: 400 });
    }

    const daysDiff = calculateDaysDifference(startDate, endDate);
    if (daysDiff > 365) {
      return NextResponse.json({ 
        error: 'Date range cannot exceed 365 days',
        code: 'DATE_RANGE_TOO_LARGE' 
      }, { status: 400 });
    }

    // Generate dates and create/update records
    const dates = generateDateRange(startDate, endDate);
    let createdCount = 0;
    let updatedCount = 0;

    for (const date of dates) {
      const existing = await db.roomAvailability.findFirst({
        where: { roomId, date }
      });

      if (existing) {
        await db.roomAvailability.update({
          where: { id: existing.id },
          data: {
            isAvailable,
            updatedAt: new Date().toISOString()
          }
        });
        updatedCount++;
      } else {
        await db.roomAvailability.create({
          data: {
            roomId,
            date,
            isAvailable,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${dates.length} dates`,
      created: createdCount,
      updated: updatedCount,
      totalRecords: dates.length
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
