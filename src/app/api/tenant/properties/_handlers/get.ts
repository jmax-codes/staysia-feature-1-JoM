/**
 * Tenant Properties GET Handler
 * 
 * Handles GET requests for tenant's properties list.
 * Returns enriched property data with counts.
 * 
 * @module TenantPropertiesGETHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant } from '@/app/api/_utils/auth';

/**
 * Handle GET request for tenant properties
 * 
 * Retrieves all properties owned by authenticated tenant
 * with enriched data (images count, amenities count, rooms count).
 * 
 * @param request - Next.js request object
 * @returns JSON response with properties list
 * 
 * @sideEffects Queries database for user session, host, and properties
 * 
 * @example
 * ```
 * GET /api/tenant/properties?limit=20&offset=0
 * Authorization: Bearer <token>
 * ```
 */
export async function handleGet(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await authenticateTenant(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { userId } = auth;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Get host profile
    const host = await db.host.findFirst({
      where: { userId }
    });

    if (!host) {
      return NextResponse.json({
        properties: [],
        total: 0,
        limit,
        offset,
      });
    }

    const hostId = host.id;

    // Get properties for this host
    const propertiesList = await db.property.findMany({
      where: { hostId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Get total count
    const total = await db.property.count({
      where: { hostId }
    });

    // Enrich each property with counts and first image
    const enrichedProperties = await Promise.all(
      propertiesList.map(async (property) => {
        return await enrichPropertyData(property);
      })
    );

    return NextResponse.json({
      properties: enrichedProperties,
      total,
      limit,
      offset,
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

/**
 * Enrich property data with counts and images
 * 
 * Adds image count, amenity count, room count,
 * and first image URL to property object.
 * 
 * @param property - Property record from database
 * @returns Enriched property object
 * 
 * @sideEffects Queries database for related data
 */
async function enrichPropertyData(property: any) {
  // Count images
  const imagesCount = await db.propertyImage.count({
    where: { propertyId: property.id }
  });

  // Count amenities
  const amenitiesCount = await db.propertyAmenity.count({
    where: { propertyId: property.id }
  });

  // Count rooms
  const roomsCount = await db.room.count({
    where: { propertyId: property.id }
  });

  // Get first image
  const firstImageData = await db.propertyImage.findFirst({
    where: { propertyId: property.id },
    orderBy: { displayOrder: 'asc' }
  });
  
  const firstImage = firstImageData 
    ? firstImageData.imageUrl 
    : property.imageUrl;

  return {
    id: property.id,
    name: property.name,
    city: property.city,
    area: property.area,
    type: property.type,
    price: property.price,
    nights: property.nights,
    rating: property.rating,
    isPublished: property.isPublished,
    propertyCategory: property.propertyCategory,
    placeType: property.placeType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    maxGuests: property.maxGuests,
    imagesCount,
    amenitiesCount,
    roomsCount,
    firstImage,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  };
}
