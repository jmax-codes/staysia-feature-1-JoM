/**
 * GET Handler for Room Availability API
 * 
 * Retrieves room availability records by room ID and optional date range.
 * 
 * @module api/room-availability/handlers/get
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

/**
 * Validates date format (YYYY-MM-DD)
 * 
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 */
function validateDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Calculates days difference between two dates
 * 
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @returns Number of days difference
 */
function calculateDaysDifference(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * GET handler for room availability
 * 
 * Query Parameters:
 * - roomId (required): Room ID
 * - startDate (optional): Start date for range query
 * - endDate (optional): End date for range query
 * 
 * @param request - Next.js request object
 * @returns Room availability records
 */
export async function handleGet(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get('roomId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Validate roomId
    if (!roomId) {
      return NextResponse.json({ 
        error: 'roomId parameter is required',
        code: 'MISSING_ROOM_ID' 
      }, { status: 400 });
    }

    const roomIdInt = parseInt(roomId);
    if (isNaN(roomIdInt) || roomIdInt <= 0) {
      return NextResponse.json({ 
        error: 'Valid roomId is required',
        code: 'INVALID_ROOM_ID' 
      }, { status: 400 });
    }

    // Verify room exists
    const roomExists = await db.room.findUnique({
      where: { id: roomIdInt }
    });

    if (!roomExists) {
      return NextResponse.json({ 
        error: 'Room not found',
        code: 'ROOM_NOT_FOUND' 
      }, { status: 404 });
    }

    // Handle date range query
    if (startDate && endDate) {
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

      // Query with date range
      const results = await db.roomAvailability.findMany({
        where: {
          roomId: roomIdInt,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'asc' }
      });

      return NextResponse.json(results, { status: 200 });
    } 
    
    // Handle incomplete date range
    if (startDate || endDate) {
      return NextResponse.json({ 
        error: 'Both startDate and endDate must be provided together',
        code: 'INCOMPLETE_DATE_RANGE' 
      }, { status: 400 });
    }

    // Query all availability (limited to 365 days)
    const results = await db.roomAvailability.findMany({
      where: { roomId: roomIdInt },
      orderBy: { date: 'asc' },
      take: 365
    });

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
