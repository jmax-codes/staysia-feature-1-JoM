/**
 * POST Handler for Properties API
 * 
 * Creates new property with validation.
 * 
 * @module api/properties/handlers/post
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { validatePropertyData } from '../_utils/validation';

/**
 * POST handler for creating property
 * 
 * Validates required fields and creates new property record.
 * 
 * @param request - Next.js request with property data
 * @returns Created property or validation error
 */
export async function handlePost(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate property data
    const validationError = validatePropertyData(body);
    if (validationError) {
      return NextResponse.json(validationError.error, { status: validationError.status });
    }

    const timestamp = new Date().toISOString();

    // Prepare property data
    const propertyData = {
      name: body.name.trim(),
      city: body.city.trim(),
      area: body.area.trim(),
      type: body.type.trim(),
      price: parseInt(body.price),
      nights: body.nights ? parseInt(body.nights) : 2,
      rating: parseFloat(body.rating),
      imageUrl: body.imageUrl.trim(),
      isGuestFavorite: body.isGuestFavorite === true || body.isGuestFavorite === 1,
      description: body.description?.trim() || null,
      address: body.address?.trim() || null,
      country: body.country?.trim() || null,
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      bedrooms: body.bedrooms ? parseInt(body.bedrooms) : null,
      bathrooms: body.bathrooms ? parseInt(body.bathrooms) : null,
      maxGuests: body.maxGuests ? parseInt(body.maxGuests) : null,
      petsAllowed: body.petsAllowed === true || body.petsAllowed === 1,
      checkInTime: body.checkInTime?.trim() || null,
      checkOutTime: body.checkOutTime?.trim() || null,
      images: body.images || null,
      amenities: body.amenities || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Create property
    const newProperty = await db.property.create({
      data: propertyData
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
