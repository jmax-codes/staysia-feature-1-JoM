import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID is a valid positive integer
    const hostId = parseInt(id);
    if (!id || isNaN(hostId) || hostId <= 0) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Fetch host by ID
    const host = await db.host.findUnique({
      where: { id: hostId }
    });

    if (!host) {
      return NextResponse.json(
        {
          error: 'Host not found',
          code: 'HOST_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Count total properties for this host
    const totalProperties = await db.property.count({
      where: { hostId }
    });

    // Get all reviews for properties belonging to this host
    const reviewStats = await db.review.aggregate({
      where: {
        property: {
          hostId
        }
      },
      _count: { id: true },
      _avg: { rating: true }
    });

    const totalReviews = reviewStats._count.id || 0;
    const avgRating = reviewStats._avg.rating;
    
    // Round average rating to 1 decimal place, handle null case
    const averageRating = avgRating 
      ? Math.round(avgRating * 10) / 10 
      : 0;

    // Return host profile with statistics
    return NextResponse.json({
      id: host.id,
      fullName: host.fullName,
      profilePicture: host.profilePicture,
      contactNumber: host.contactNumber,
      bio: host.bio,
      createdAt: host.createdAt,
      totalProperties,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    console.error('GET host error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}