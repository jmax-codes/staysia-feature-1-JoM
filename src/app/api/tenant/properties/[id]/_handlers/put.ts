/**
 * PUT Handler for Single Tenant Property
 * 
 * Updates property details including metadata, images, amenities, and rooms.
 * Supports partial updates with validation.
 * 
 * @module api/tenant/properties/[id]/handlers/put
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant, verifyPropertyOwnership } from '../_utils/auth';
import { validatePropertyData, prepareUpdateData } from '../_utils/validation';
import { updatePropertyImages, updatePropertyAmenities, updateRooms } from '../_utils/updates';

/**
 * PUT handler for updating property
 * 
 * Handles full or partial property updates with validation.
 * Updates related entities (images, amenities, rooms) if provided.
 * 
 * @param request - Next.js request object with update data
 * @param params - Route parameters with property ID
 * @returns Updated property with relations
 */
export async function handlePut(
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
    const existingProperty = await verifyPropertyOwnership(propertyId, host.id);
    if (!existingProperty) {
      return NextResponse.json({ 
        error: 'Property not found or you don\'t have permission',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();

    // Validate property data
    const validationError = validatePropertyData(body);
    if (validationError) {
      return NextResponse.json(validationError.error, { status: validationError.status });
    }

    // Prepare update data
    const updateData = prepareUpdateData(body);

    // Update property
    await db.property.update({
      where: { id: propertyId },
      data: updateData
    });

    // Update related entities if provided
    if (body.propertyImages) {
      await updatePropertyImages(propertyId, body.propertyImages);
    }

    if (body.propertyAmenities) {
      await updatePropertyAmenities(propertyId, body.propertyAmenities);
    }

    if (body.rooms) {
      await updateRooms(propertyId, body.rooms);
    }

    // Fetch updated property with all relations
    const [updatedProperty, images, amenities, rooms, recentPricing] = await Promise.all([
      verifyPropertyOwnership(propertyId, host.id),
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
      ...updatedProperty,
      images,
      amenities,
      rooms,
      recentPricing
    }, { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
