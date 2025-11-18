import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    // Validate ID is provided
    if (!id) {
      return NextResponse.json(
        { 
          error: 'Valid property ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Validate ID is a positive integer
    const propertyId = parseInt(id);
    if (isNaN(propertyId) || propertyId <= 0) {
      return NextResponse.json(
        { 
          error: 'Valid property ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Fetch current property
    const currentProperty = await db.property.findUnique({
      where: { id: propertyId }
    });

    // Check if property exists
    if (!currentProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Toggle isGuestFavorite status
    const newFavoriteStatus = !currentProperty.isGuestFavorite;

    // Update property with new favorite status and updatedAt
    const updatedProperty = await db.property.update({
      where: { id: propertyId },
      data: {
        isGuestFavorite: newFavoriteStatus,
        updatedAt: new Date().toISOString()
      }
    });

    return NextResponse.json(updatedProperty, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}