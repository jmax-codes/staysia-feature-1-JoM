import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid property ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const propertyId = parseInt(id);

    if (propertyId <= 0) {
      return NextResponse.json(
        {
          error: 'Property ID must be a positive integer',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Fetch property
    const property = await db.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json(
        {
          error: 'Property not found',
          code: 'PROPERTY_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Fetch property images from property_images table
    const propertyImages = await db.propertyImage.findMany({
      where: { propertyId },
      orderBy: { displayOrder: 'asc' }
    });

    // Use property_images if available, otherwise fall back to property.images or imageUrl
    let finalImages: string[] = [];
    if (propertyImages.length > 0) {
      finalImages = propertyImages.map(img => img.imageUrl);
    } else if (property.images && Array.isArray(property.images)) {
      finalImages = property.images as string[];
    } else {
      finalImages = [property.imageUrl];
    }

    // Fetch amenities from property_amenities table
    const propertyAmenities = await db.propertyAmenity.findMany({
      where: { propertyId },
      orderBy: { amenityType: 'asc' }
    });

    // Use property_amenities if available, otherwise fall back to property.amenities
    let finalAmenities: string[] = [];
    if (propertyAmenities.length > 0) {
      finalAmenities = propertyAmenities.map(a => a.amenityName);
    } else if (property.amenities && Array.isArray(property.amenities)) {
      finalAmenities = property.amenities as string[];
    }

    // Fetch host information if hostId exists
    let hostInfo = null;
    if (property.hostId) {
      const host = await db.host.findUnique({
        where: { id: property.hostId }
      });

      if (host) {
        // Get host statistics
        const propertiesCount = await db.property.count({
          where: { hostId: property.hostId }
        });

        const reviewStats = await db.review.aggregate({
          where: {
            property: {
              hostId: property.hostId
            }
          },
          _count: { id: true },
          _avg: { rating: true }
        });

        const totalReviews = reviewStats._count.id || 0;
        const avgRating = reviewStats._avg.rating;
        const averageRating = avgRating 
          ? Math.round(avgRating * 10) / 10 
          : 0;

        hostInfo = {
          id: host.id,
          fullName: host.fullName,
          profilePicture: host.profilePicture,
          contactNumber: host.contactNumber,
          bio: host.bio,
          totalProperties: propertiesCount,
          totalReviews,
          averageRating,
        };
      }
    }

    // Fetch rooms for this property
    const propertyRooms = await db.room.findMany({
      where: { propertyId }
    });

    // Fetch reviews for this property
    const propertyReviews = await db.review.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' }
    });

    // Auto-calculate rating average from reviews
    const avgRating = propertyReviews.length > 0
      ? propertyReviews.reduce((acc, r) => acc + r.rating, 0) / propertyReviews.length
      : property.rating;

    // Fetch pricing data for next 60 days
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 60);
    const endDateString = endDate.toISOString().split('T')[0];

    const pricingDataRaw = await db.propertyPricing.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
          lte: endDateString
        }
      },
      orderBy: { date: 'asc' }
    });

    // Map priceType to status for frontend compatibility
    const pricingData = pricingDataRaw.map(record => ({
      ...record,
      status: record.priceType
    }));

    // Return comprehensive property details with images and amenities from database
    return NextResponse.json({
      property: {
        ...property,
        rating: avgRating,
        images: finalImages,
        amenities: finalAmenities,
        bestDealPrice: property.bestDealPrice,
        peakSeasonPrice: property.peakSeasonPrice,
      },
      host: hostInfo,
      rooms: propertyRooms,
      reviews: propertyReviews,
      pricing: pricingData,
    });
  } catch (error) {
    console.error('GET property error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}