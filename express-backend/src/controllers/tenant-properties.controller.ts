/**
 * Tenant Properties Controller
 * 
 * Handles tenant-specific property management.
 */

import { Request, Response } from 'express';
import { db } from '../db';

/**
 * GET /api/tenant/properties
 * List properties owned by tenant
 */
export async function listTenantProperties(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.host) {
      res.status(401).json({ error: 'Tenant authentication required' });
      return;
    }

    const properties = await db.property.findMany({
      where: { hostId: req.host.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(properties);
  } catch (error) {
    console.error('GET tenant properties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/tenant/properties
 * Create new property as tenant
 */
export async function createTenantProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.host) {
      res.status(401).json({ error: 'Tenant authentication required' });
      return;
    }

    const propertyData = {
      ...req.body,
      hostId: req.host.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newProperty = await db.property.create({
      data: propertyData
    });

    res.status(201).json(newProperty);
  } catch (error) {
    console.error('POST tenant property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/tenant/properties/:id
 * Get tenant property by ID
 */
export async function getTenantProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.host) {
      res.status(401).json({ error: 'Tenant authentication required' });
      return;
    }

    const { id } = req.params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    const property = await db.property.findFirst({
      where: {
        id: propertyId,
        hostId: req.host.id
      }
    });

    if (!property) {
      res.status(404).json({ error: 'Property not found or not owned by you' });
      return;
    }

    res.json(property);
  } catch (error) {
    console.error('GET tenant property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /api/tenant/properties/:id
 * Update tenant property
 */
export async function updateTenantProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.host) {
      res.status(401).json({ error: 'Tenant authentication required' });
      return;
    }

    const { id } = req.params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    // Verify ownership
    const existing = await db.property.findFirst({
      where: {
        id: propertyId,
        hostId: req.host.id
      }
    });

    if (!existing) {
      res.status(404).json({ error: 'Property not found or not owned by you' });
      return;
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const updated = await db.property.update({
      where: { id: propertyId },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('PUT tenant property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * DELETE /api/tenant/properties/:id
 * Delete tenant property
 */
export async function deleteTenantProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.host) {
      res.status(401).json({ error: 'Tenant authentication required' });
      return;
    }

    const { id } = req.params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    // Verify ownership
    const existing = await db.property.findFirst({
      where: {
        id: propertyId,
        hostId: req.host.id
      }
    });

    if (!existing) {
      res.status(404).json({ error: 'Property not found or not owned by you' });
      return;
    }

    await db.property.delete({
      where: { id: propertyId }
    });

    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    console.error('DELETE tenant property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
