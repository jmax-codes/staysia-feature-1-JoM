/**
 * GET Handler for Properties API
 * 
 * Retrieves properties with filtering, search, and pagination.
 * Includes review aggregation and Indonesian property prioritization.
 * 
 * @module api/properties/handlers/get
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { buildWhereClause, buildOrderBy } from '../_utils/query-builder';

/**
 * GET handler for properties list
 * 
 * Supports filtering by city, type, price, guests, and search.
 * Prioritizes Indonesian properties in results.
 * 
 * @param request - Next.js request with query parameters
 * @returns Filtered and sorted properties with review data
 */
export async function handleGetList(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const sortBy = searchParams.get('sortBy') || 'name';

    // Build query clauses
    const where = buildWhereClause(searchParams);
    const orderBy = buildOrderBy(sortBy);
    
    console.log('API Query Where:', JSON.stringify(where, null, 2));

    // Fetch properties
    const results = await db.property.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    });
    
    console.log(`API Found ${results.length} properties`);

    // Aggregate reviews for each property
    const propertiesWithReviews = await Promise.all(
      results.map(async (property) => {
        const propertyReviews = await db.review.findMany({
          where: { propertyId: property.id }
        });

        const reviewCount = propertyReviews.length;
        const avgRating = reviewCount > 0
          ? propertyReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
          : property.rating;

        return {
          ...property,
          rating: avgRating,
          reviewCount,
        };
      })
    );

    return NextResponse.json(propertiesWithReviews, { status: 200 });
  } catch (error) {
    console.error('GET list error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * GET handler for single property
 * 
 * Retrieves a specific property by ID.
 * 
 * @param id - Property ID
 * @returns Property data or 404 error
 */
export async function handleGetSingle(id: string) {
  try {
    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const property = await db.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error('GET single error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
