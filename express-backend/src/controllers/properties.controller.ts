/**
 * Properties Controller
 * 
 * Handles all property-related operations including CRUD, filtering, and pricing.
 */

import { Request, Response } from 'express';
import { db } from '../db';
import { buildWhereClause, buildOrderBy, buildPaginationMeta } from '../utils/query-builder';

/**
 * GET /api/properties
 * List properties with filtering, sorting, and pagination
 */
export async function listProperties(req: Request, res: Response): Promise<void> {
  try {
    const { 
      location, 
      category, 
      adults, 
      children, 
      pets, 
      checkIn, 
      checkOut, 
      minPrice, 
      maxPrice, 
      limit = '50', 
      offset = '0', 
      sortBy = 'name' 
    } = req.query;
    
    const limitNum = Math.min(parseInt(limit as string), 100);
    const offsetNum = parseInt(offset as string);

    // Build query
    const params = new URLSearchParams(req.query as any);
    const where = buildWhereClause(params);
    const orderBy = buildOrderBy(sortBy as string);

    // Log search query for debugging
    console.log('Property search query:', {
      location,
      category,
      checkIn,
      checkOut,
      adults,
      children,
      pets,
      whereClause: JSON.stringify(where)
    });

    // Get total count
    const total = await db.property.count({ where });

    // Fetch properties
    const results = await db.property.findMany({
      where,
      orderBy,
      take: limitNum,
      skip: offsetNum,
    });

    // Aggregate reviews and check favorites
    const propertiesWithReviews = await Promise.all(
      results.map(async (property) => {
        const propertyReviews = await db.review.findMany({
          where: { propertyId: property.id }
        });

        const reviewCount = propertyReviews.length;
        const avgRating = reviewCount > 0
          ? propertyReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
          : property.rating;

        let isFavorite = false;
        if (req.user) {
          const favorite = await db.favorite.findUnique({
            where: {
              userId_propertyId: {
                userId: req.user.id,
                propertyId: property.id
              }
            }
          });
          isFavorite = !!favorite;
        }

        return {
          ...property,
          rating: avgRating,
          reviewCount,
          isFavorite
        };
      })
    );

    // Build pagination metadata
    const meta = buildPaginationMeta(total, limitNum, offsetNum);

    res.json({
      data: propertiesWithReviews,
      meta
    });
  } catch (error) {
    console.error('GET properties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/properties/:id
 * Get single property by ID
 */
export async function getProperty(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      res.status(400).json({ error: 'Valid ID is required', code: 'INVALID_ID' });
      return;
    }

    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: {
        host: true,
        rooms: true,
        reviews: true,
        propertyPricing: true
      }
    });

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    // Calculate host statistics
    let hostWithStats = null;
    if (property.host) {
      const hostProperties = await db.property.findMany({
        where: { hostId: property.host.id },
        include: { reviews: true }
      });

      const totalProperties = hostProperties.length;
      const allReviews = hostProperties.flatMap(p => p.reviews);
      const totalReviews = allReviews.length;
      const averageRating = totalReviews > 0
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;

      hostWithStats = {
        ...property.host,
        totalProperties,
        totalReviews,
        averageRating
      };
    }

    // Transform to match frontend PropertyData interface
    const responseData = {
      property: {
        ...property,
      },
      host: hostWithStats,
      rooms: property.rooms,
      reviews: property.reviews,
      pricing: property.propertyPricing.map(p => ({
        ...p,
        status: p.priceType // Frontend expects 'status'
      }))
    };

    res.json(responseData);
  } catch (error) {
    console.error('GET property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/properties
 * Create new property
 */
export async function createProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const propertyData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newProperty = await db.property.create({
      data: propertyData
    });

    res.status(201).json(newProperty);
  } catch (error) {
    console.error('POST property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /api/properties/:id
 * Update property
 */
export async function updateProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      res.status(400).json({ error: 'Valid ID is required' });
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
    console.error('PUT property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * DELETE /api/properties/:id
 * Delete property
 */
export async function deleteProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      res.status(400).json({ error: 'Valid ID is required' });
      return;
    }

    await db.property.delete({
      where: { id: propertyId }
    });

    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    console.error('DELETE property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/properties/favorite
 * Toggle favorite property
 */
export async function toggleFavorite(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { propertyId } = req.body;

    if (!propertyId) {
      res.status(400).json({ error: 'Property ID is required' });
      return;
    }

    const userId = req.user.id;

    // Check if favorite exists
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    });

    if (existingFavorite) {
      // Remove favorite
      await db.favorite.delete({
        where: {
          userId_propertyId: {
            userId,
            propertyId
          }
        }
      });
      res.json({ success: true, isFavorite: false, message: 'Removed from favorites' });
    } else {
      // Add favorite
      await db.favorite.create({
        data: {
          userId,
          propertyId
        }
      });
      res.json({ success: true, isFavorite: true, message: 'Added to favorites' });
    }
  } catch (error) {
    console.error('POST favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/properties/favorites
 * Get user's favorite properties
 */
export async function getFavorites(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userId = req.user.id;

    const favorites = await db.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to match property list format
    const properties = favorites.map(fav => {
      const property = fav.property;
      const reviewCount = property.reviews.length;
      const avgRating = reviewCount > 0
        ? property.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : property.rating;

      return {
        ...property,
        rating: avgRating,
        reviewCount,
        isFavorite: true // Explicitly mark as favorite
      };
    });

    res.json(properties);
  } catch (error) {
    console.error('GET favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/properties/:id/pricing-calculation
 * Calculate pricing for date range
 */
export async function calculatePricing(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Start date and end date are required' });
      return;
    }

    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      res.status(400).json({ error: 'Valid property ID is required' });
      return;
    }

    // Get property
    const property = await db.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    // Get pricing records for date range
    const pricingRecords = await db.propertyPricing.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate as string,
          lte: endDate as string
        }
      }
    });

    // Calculate total
    let totalPrice = 0;
    let baseNights = 0;
    let peakNights = 0;
    let bestDealNights = 0;
    let soldOutNights = 0;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      const pricing = pricingRecords.find(p => p.date === dateStr);

      if (pricing) {
        if (pricing.priceType === 'sold_out') {
          soldOutNights++;
        } else if (pricing.priceType === 'peak_season') {
          totalPrice += pricing.price;
          peakNights++;
        } else if (pricing.priceType === 'best_deal') {
          totalPrice += pricing.price;
          bestDealNights++;
        } else {
          totalPrice += pricing.price;
          baseNights++;
        }
      } else {
        totalPrice += property.price;
        baseNights++;
      }
    }

    res.json({
      propertyId,
      startDate,
      endDate,
      nights,
      baseNights,
      peakNights,
      bestDealNights,
      soldOutNights,
      totalPrice,
      averagePerNight: nights > 0 ? totalPrice / nights : 0,
      breakdown: pricingRecords
    });
  } catch (error) {
    console.error('GET pricing calculation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
