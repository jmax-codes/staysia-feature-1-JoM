/**
 * DELETE Handler for Rooms API
 * 
 * Deletes a room by ID.
 * Requires tenant authentication and property ownership verification.
 * 
 * @module api/rooms/handlers/delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant } from '../../_utils/auth';

/**
 * DELETE handler for rooms
 * 
 * Deletes a room by ID.
 * 
 * Query Parameters:
 * - id: Room ID to delete (required)
 * 
 * @param request - Next.js request object
 * @returns Success response with deleted room ID
 */
export async function handleDelete(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await authenticateTenant(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { host } = auth;
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('id');

    // Validate room ID
    if (!roomId || isNaN(parseInt(roomId))) {
      return NextResponse.json({
        error: 'Valid room id is required',
        code: 'INVALID_ROOM_ID'
      }, { status: 400 });
    }

    const roomIdNum = parseInt(roomId);

    // Verify room exists and ownership
    const room = await db.room.findUnique({
      where: { id: roomIdNum }
    });

    if (!room) {
      return NextResponse.json({
        error: 'Room not found',
        code: 'ROOM_NOT_FOUND'
      }, { status: 404 });
    }

    const property = await db.property.findUnique({
      where: { id: room.propertyId }
    });

    if (!property || property.hostId !== host.id) {
      return NextResponse.json({
        error: 'You do not have permission to delete this room',
        code: 'PERMISSION_DENIED'
      }, { status: 403 });
    }

    // Delete room
    await db.room.delete({ where: { id: roomIdNum } });

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully',
      deletedRoomId: roomIdNum
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}
