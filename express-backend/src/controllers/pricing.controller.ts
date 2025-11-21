/**
 * Pricing Controller
 * 
 * Handles property pricing operations.
 */

import { Request, Response } from 'express';
import { db } from '../db';

/**
 * GET /api/property-pricing
 * Get pricing records
 */
export async function getPropertyPricing(req: Request, res: Response): Promise<void> {
  try {
    const { propertyId, roomId, startDate, endDate } = req.query;

    const where: any = {};
    if (propertyId) where.propertyId = parseInt(propertyId as string);
    if (roomId) where.roomId = parseInt(roomId as string);
    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string
      };
    }

    const pricingRecords = await db.propertyPricing.findMany({
      where,
      orderBy: { date: 'asc' }
    });

    res.json(pricingRecords);
  } catch (error) {
    console.error('GET property pricing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/property-pricing
 * Create pricing record
 */
export async function createPropertyPricing(req: Request, res: Response): Promise<void> {
  try {
    const pricingData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newPricing = await db.propertyPricing.create({
      data: pricingData
    });

    res.status(201).json(newPricing);
  } catch (error) {
    console.error('POST property pricing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/room-availability
 * Get room availability
 */
export async function getRoomAvailability(req: Request, res: Response): Promise<void> {
  try {
    const { roomId, startDate, endDate } = req.query;

    const where: any = {};
    if (roomId) where.roomId = parseInt(roomId as string);
    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string
      };
    }

    const availability = await db.roomAvailability.findMany({
      where,
      orderBy: { date: 'asc' }
    });

    res.json(availability);
  } catch (error) {
    console.error('GET room availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/room-availability
 * Create room availability
 */
export async function createRoomAvailability(req: Request, res: Response): Promise<void> {
  try {
    const availabilityData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newAvailability = await db.roomAvailability.create({
      data: availabilityData
    });

    res.status(201).json(newAvailability);
  } catch (error) {
    console.error('POST room availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /api/room-availability/:id
 * Update room availability
 */
export async function updateRoomAvailability(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const availabilityId = parseInt(id);

    if (isNaN(availabilityId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const updated = await db.roomAvailability.update({
      where: { id: availabilityId },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('PUT room availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * DELETE /api/room-availability/:id
 * Delete room availability
 */
export async function deleteRoomAvailability(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const availabilityId = parseInt(id);

    if (isNaN(availabilityId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    await db.roomAvailability.delete({
      where: { id: availabilityId }
    });

    res.json({ success: true, message: 'Availability deleted' });
  } catch (error) {
    console.error('DELETE room availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/peak-season-rates
 * Get peak season rates
 */
export async function getPeakSeasonRates(req: Request, res: Response): Promise<void> {
  try {
    const { propertyId, roomId } = req.query;

    const where: any = {};
    if (propertyId) where.propertyId = parseInt(propertyId as string);
    if (roomId) where.roomId = parseInt(roomId as string);

    const rates = await db.peakSeasonRate.findMany({
      where,
      orderBy: { startDate: 'asc' }
    });

    res.json(rates);
  } catch (error) {
    console.error('GET peak season rates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/peak-season-rates
 * Create peak season rate
 */
export async function createPeakSeasonRate(req: Request, res: Response): Promise<void> {
  try {
    const rateData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newRate = await db.peakSeasonRate.create({
      data: rateData
    });

    res.status(201).json(newRate);
  } catch (error) {
    console.error('POST peak season rate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /api/peak-season-rates/:id
 * Update peak season rate
 */
export async function updatePeakSeasonRate(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const rateId = parseInt(id);

    if (isNaN(rateId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const updated = await db.peakSeasonRate.update({
      where: { id: rateId },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('PUT peak season rate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * DELETE /api/peak-season-rates/:id
 * Delete peak season rate
 */
export async function deletePeakSeasonRate(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const rateId = parseInt(id);

    if (isNaN(rateId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    await db.peakSeasonRate.delete({
      where: { id: rateId }
    });

    res.json({ success: true, message: 'Peak season rate deleted' });
  } catch (error) {
    console.error('DELETE peak season rate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
