/**
 * DELETE Handler for Single Tenant Property
 * 
 * Deletes a property and all related data (images, amenities, rooms, pricing).
 * Requires tenant authentication and property ownership verification.
 * 
 * @module api/tenant/properties/[id]/handlers/delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant, verifyPropertyOwnership } from '../_utils/auth';

/**
 * DELETE handler for property
 * 
 * Performs cascade deletion of property and all related entities.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters with property ID
 * @returns Success response with deleted property ID
 */
export async function handleDelete(
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

    // Cascade delete all related data in parallel
    await Promise.all([
      db.propertyPricing.deleteMany({ where: { propertyId } }),
      db.propertyImage.deleteMany({ where: { propertyId } }),
      db.propertyAmenity.deleteMany({ where: { propertyId } }),
      db.room.deleteMany({ where: { propertyId } })
    ]);

    // Delete property
    await db.property.delete({
      where: { id: propertyId }
    });

    return NextResponse.json({
      success: true,
      message: 'Property and all related data deleted successfully',
      deletedPropertyId: propertyId
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
