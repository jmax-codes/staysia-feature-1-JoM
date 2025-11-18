/**
 * GET Handler for Single Tenant Property
 * 
 * Retrieves detailed property information including images, amenities, and rooms.
 * Requires tenant authentication and property ownership verification.
 * 
 * @module api/tenant/properties/[id]/handlers/get
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant, verifyPropertyOwnership } from '../_utils/auth';

/**
 * GET handler for single property with all relations
 * 
 * Fetches property data including images, amenities, rooms, and recent pricing.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters with property ID
 * @returns Property data with relations
 */
export async function handleGet(
  request: NextRequest,
  params: { id: string }
) {
  try {
    const propertyId = parseInt(params.id);
    if (isNaN(propertyId)) {
      return NextResponse.json({ 
        error: 'Valid property ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Authenticate user
    const authResult = await authenticateTenant(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { host } = authResult;

    // Verify ownership
    const property = await verifyPropertyOwnership(propertyId, host.id);
    if (!property) {
      return NextResponse.json({ 
        error: 'Property not found or you don\'t have permission',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Fetch all related data in parallel
    const [propertyImages, propertyAmenities, rooms, recentPricing] = await Promise.all([
      db.propertyImage.findMany({
        where: { propertyId },
        orderBy: { displayOrder: 'asc' }
      }),
      db.propertyAmenity.findMany({
        where: { propertyId }
      }),
      db.room.findMany({
        where: { propertyId }
      }),
      (async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return db.propertyPricing.findMany({
          where: {
            propertyId,
            date: { gte: thirtyDaysAgo.toISOString().split('T')[0] }
          },
          orderBy: { date: 'asc' }
        });
      })()
    ]);

    return NextResponse.json({
      ...property,
      images: propertyImages,
      amenities: propertyAmenities,
      rooms,
      recentPricing
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
