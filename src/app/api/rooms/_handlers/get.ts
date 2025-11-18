/**
 * GET Handler for Rooms API
 * 
 * Retrieves rooms by property ID or single room by room ID.
 * 
 * @module api/rooms/handlers/get
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

/**
 * GET handler for rooms
 * 
 * Query Parameters:
 * - roomId (optional): Get single room by ID
 * - propertyId (optional): Get all rooms for a property
 * - limit (optional): Maximum results (default 50, max 100)
 * - offset (optional): Pagination offset (default 0)
 * 
 * @param request - Next.js request object
 * @returns Room(s) data
 */
export async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const roomId = searchParams.get('roomId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Require either propertyId or roomId
    if (!propertyId && !roomId) {
      return NextResponse.json({
        error: 'propertyId or roomId is required',
        code: 'MISSING_FILTER'
      }, { status: 400 });
    }

    // Single room by ID
    if (roomId) {
      const roomIdNum = parseInt(roomId);
      if (isNaN(roomIdNum)) {
        return NextResponse.json({
          error: 'Valid roomId is required',
          code: 'INVALID_ROOM_ID'
        }, { status: 400 });
      }

      const room = await db.room.findUnique({
        where: { id: roomIdNum }
      });

      if (!room) {
        return NextResponse.json({
          error: 'Room not found',
          code: 'ROOM_NOT_FOUND'
        }, { status: 404 });
      }

      return NextResponse.json(room);
    }

    // List rooms by propertyId
    const propertyIdNum = parseInt(propertyId);
    if (isNaN(propertyIdNum)) {
      return NextResponse.json({
        error: 'Valid propertyId is required',
        code: 'INVALID_PROPERTY_ID'
      }, { status: 400 });
    }

    const roomsList = await db.room.findMany({
      where: { propertyId: propertyIdNum },
      take: limit,
      skip: offset
    });

    return NextResponse.json(roomsList);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}
