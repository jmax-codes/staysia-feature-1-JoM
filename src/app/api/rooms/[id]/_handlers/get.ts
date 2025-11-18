/**
 * GET Handler for Single Room API
 * 
 * Retrieves detailed information for a specific room including
 * availability and peak season rates.
 * 
 * @module api/rooms/[id]/handlers/get
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

/**
 * GET handler for single room
 * 
 * Retrieves room details, availability for next 90 days, and peak season rates.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters with room ID
 * @returns Room data with availability and pricing
 */
export async function handleGet(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid room ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const roomId = parseInt(id);

    // Fetch room data
    const room = await db.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found', code: 'ROOM_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Calculate date range for next 90 days
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 90);

    const todayStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Fetch availability data for next 90 days
    const availability = await db.roomAvailability.findMany({
      where: {
        roomId,
        date: {
          gte: todayStr,
          lte: endDateStr
        }
      }
    });

    // Fetch active peak season rates for this room or property
    const peakRates = await db.peakSeasonRate.findMany({
      where: {
        isActive: true,
        endDate: { gte: todayStr },
        OR: [
          { roomId },
          { propertyId: room.propertyId, roomId: null }
        ]
      }
    });

    return NextResponse.json({
      room,
      availability,
      peakSeasonRates: peakRates
    }, { status: 200 });

  } catch (error) {
    console.error('GET room error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
