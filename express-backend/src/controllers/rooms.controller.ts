/**
 * Rooms Controller
 * 
 * Handles room management operations.
 */

import { Request, Response } from 'express';
import { db } from '../db';
import { verifyPropertyOwnership } from '../utils/ownership';

/**
 * GET /api/rooms
 * List rooms with optional filtering
 */
export async function listRooms(req: Request, res: Response): Promise<void> {
  try {
    const { propertyId, limit = '50', offset = '0' } = req.query;
    
    const limitNum = Math.min(parseInt(limit as string), 100);
    const offsetNum = parseInt(offset as string);

    const where: any = {};
    if (propertyId) {
      where.propertyId = parseInt(propertyId as string);
    }

    const rooms = await db.room.findMany({
      where,
      take: limitNum,
      skip: offsetNum,
      orderBy: { createdAt: 'desc' }
    });

    res.json(rooms);
  } catch (error) {
    console.error('GET rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/rooms/:id
 * Get single room
 */
export async function getRoom(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    const room = await db.room.findUnique({
      where: { id: roomId },
      include: { property: true }
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json(room);
  } catch (error) {
    console.error('GET room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/rooms
 * Create new room
 */
export async function createRoom(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.host) {
      res.status(401).json({ error: 'Tenant authentication required' });
      return;
    }

    const { propertyId } = req.body;

    // Verify property ownership
    const ownership = await verifyPropertyOwnership(req.host.id, propertyId);
    if (!ownership.valid) {
      res.status(403).json({ error: ownership.error });
      return;
    }

    const roomData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newRoom = await db.room.create({
      data: roomData
    });

    res.status(201).json(newRoom);
  } catch (error) {
    console.error('POST room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /api/rooms/:id
 * Update room
 */
export async function updateRoom(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.host) {
      res.status(401).json({ error: 'Tenant authentication required' });
      return;
    }

    const { id } = req.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    // Verify room ownership
    const room = await db.room.findUnique({
      where: { id: roomId },
      include: { property: true }
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    if (room.property.hostId !== req.host.id) {
      res.status(403).json({ error: 'You do not own this property' });
      return;
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const updated = await db.room.update({
      where: { id: roomId },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('PUT room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * DELETE /api/rooms/:id
 * Delete room
 */
export async function deleteRoom(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.host) {
      res.status(401).json({ error: 'Tenant authentication required' });
      return;
    }

    const { id } = req.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    // Verify room ownership
    const room = await db.room.findUnique({
      where: { id: roomId },
      include: { property: true }
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    if (room.property.hostId !== req.host.id) {
      res.status(403).json({ error: 'You do not own this property' });
      return;
    }

    await db.room.delete({
      where: { id: roomId }
    });

    res.json({ success: true, message: 'Room deleted' });
  } catch (error) {
    console.error('DELETE room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/rooms/:id/pricing-calculation
 * Calculate room pricing for date range
 */
export async function calculateRoomPricing(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Start date and end date are required' });
      return;
    }

    const roomId = parseInt(id);
    if (isNaN(roomId)) {
      res.status(400).json({ error: 'Valid room ID is required' });
      return;
    }

    const room = await db.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    // Calculate pricing (similar to property pricing)
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const totalPrice = room.pricePerNight * nights;

    res.json({
      roomId,
      startDate,
      endDate,
      nights,
      pricePerNight: room.pricePerNight,
      totalPrice,
      averagePerNight: room.pricePerNight
    });
  } catch (error) {
    console.error('GET room pricing calculation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
