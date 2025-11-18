import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const propertyId = searchParams.get('propertyId');
    const carId = searchParams.get('carId');
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single review by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const review = await db.review.findUnique({
        where: { id: parseInt(id) }
      });

      if (!review) {
        return NextResponse.json({ 
          error: 'Review not found',
          code: 'REVIEW_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(review, { status: 200 });
    }

    // List reviews with filters
    const where: any = {};

    if (propertyId) {
      if (isNaN(parseInt(propertyId))) {
        return NextResponse.json({ 
          error: "Valid property ID is required",
          code: "INVALID_PROPERTY_ID" 
        }, { status: 400 });
      }
      where.propertyId = parseInt(propertyId);
    }

    if (userId) {
      where.userId = userId;
    }

    const results = await db.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      propertyId, 
      carId, 
      userId,
      userName, 
      userAvatar,
      rating, 
      comment,
      cleanliness,
      accuracy,
      communication,
      location,
      value
    } = body;

    // Validate required fields
    if (!userName || userName.trim() === '') {
      return NextResponse.json({ 
        error: "User name is required",
        code: "MISSING_USER_NAME" 
      }, { status: 400 });
    }

    if (rating === undefined || rating === null || typeof rating !== 'number' || rating < 0 || rating > 5) {
      return NextResponse.json({ 
        error: "Rating is required and must be between 0 and 5",
        code: "INVALID_RATING" 
      }, { status: 400 });
    }

    if (!comment || comment.trim() === '' || comment.trim().length < 10) {
      return NextResponse.json({ 
        error: "Comment is required and must be at least 10 characters",
        code: "INVALID_COMMENT" 
      }, { status: 400 });
    }

    // Validate that propertyId is provided
    const hasPropertyId = propertyId !== undefined && propertyId !== null;

    if (!hasPropertyId) {
      return NextResponse.json({ 
        error: "propertyId must be provided",
        code: "INVALID_REFERENCE" 
      }, { status: 400 });
    }

    // Validate propertyId if provided
    if (hasPropertyId) {
      if (isNaN(parseInt(propertyId)) || parseInt(propertyId) <= 0) {
        return NextResponse.json({ 
          error: "Property ID must be a valid positive integer",
          code: "INVALID_PROPERTY_ID" 
        }, { status: 400 });
      }
    }

    // Validate optional rating fields
    const ratingFields = [
      { name: 'cleanliness', value: cleanliness },
      { name: 'accuracy', value: accuracy },
      { name: 'communication', value: communication },
      { name: 'location', value: location },
      { name: 'value', value: value }
    ];

    for (const field of ratingFields) {
      if (field.value !== undefined && field.value !== null) {
        if (typeof field.value !== 'number' || field.value < 0 || field.value > 5) {
          return NextResponse.json({ 
            error: `${field.name} must be between 0 and 5`,
            code: `INVALID_${field.name.toUpperCase()}` 
          }, { status: 400 });
        }
      }
    }

    // Prepare insert data
    const insertData: any = {
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add optional fields
    if (hasPropertyId) {
      insertData.propertyId = parseInt(propertyId);
    }

    if (userId) {
      insertData.userId = userId;
    }

    if (userAvatar) {
      insertData.userAvatar = userAvatar;
    }

    if (cleanliness !== undefined && cleanliness !== null) {
      insertData.cleanliness = cleanliness;
    }

    if (accuracy !== undefined && accuracy !== null) {
      insertData.accuracy = accuracy;
    }

    if (communication !== undefined && communication !== null) {
      insertData.communication = communication;
    }

    if (location !== undefined && location !== null) {
      insertData.location = location;
    }

    if (value !== undefined && value !== null) {
      insertData.value = value;
    }

    // Insert review
    const newReview = await db.review.create({
      data: insertData
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}