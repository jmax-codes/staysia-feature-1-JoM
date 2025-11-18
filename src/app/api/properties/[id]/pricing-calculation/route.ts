import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

// Helper function to validate YYYY-MM-DD format
function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Helper function to generate array of dates between start and end (EXCLUDING END DATE - checkout date not counted)
function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const current = new Date(start);
  // CRITICAL: Stop BEFORE endDate (checkout date should not be counted)
  while (current < end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

// Helper function to calculate days between dates
function getDaysDifference(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

interface PricingDetail {
  date: string;
  price: number;
  type: 'base' | 'best_deal' | 'peak_season' | 'unavailable';
}

interface PricingBreakdown {
  baseNights: number;
  bestDealNights: number;
  peakSeasonNights: number;
  unavailableNights: number;
  unavailableDates: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    // Debug logging
    console.log('Property Pricing Calculation API called:', {
      id,
      startDate,
      endDate,
      url: request.url,
      searchParams: Object.fromEntries(request.nextUrl.searchParams)
    });

    // Validate property ID
    const propertyId = parseInt(id);
    if (isNaN(propertyId) || propertyId <= 0) {
      return NextResponse.json({
        error: 'Valid property ID is required',
        code: 'INVALID_PROPERTY_ID'
      }, { status: 400 });
    }

    // Validate required date parameters
    if (!startDate || !endDate) {
      return NextResponse.json({
        error: 'Both startDate and endDate are required',
        code: 'MISSING_DATE_PARAMETERS'
      }, { status: 400 });
    }

    // Validate date format
    if (!isValidDateFormat(startDate)) {
      return NextResponse.json({
        error: 'startDate must be in YYYY-MM-DD format',
        code: 'INVALID_START_DATE_FORMAT'
      }, { status: 400 });
    }

    if (!isValidDateFormat(endDate)) {
      return NextResponse.json({
        error: 'endDate must be in YYYY-MM-DD format',
        code: 'INVALID_END_DATE_FORMAT'
      }, { status: 400 });
    }

    // Validate startDate <= endDate
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({
        error: 'startDate must be less than or equal to endDate',
        code: 'INVALID_DATE_RANGE'
      }, { status: 400 });
    }

    // Validate date range doesn't exceed 365 days
    const daysDiff = getDaysDifference(startDate, endDate);
    if (daysDiff > 365) {
      return NextResponse.json({
        error: 'Date range cannot exceed 365 days',
        code: 'DATE_RANGE_TOO_LARGE'
      }, { status: 400 });
    }

    // Fetch property data
    const property = await db.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json({
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      }, { status: 404 });
    }

    const basePricePerNight = Math.round(property.price / property.nights);
    // NEW: Use single prices for best_deal and peak_season
    const bestDealPrice = property.bestDealPrice || Math.round(basePricePerNight * 0.80);
    const peakSeasonPrice = property.peakSeasonPrice || Math.round(basePricePerNight * 1.40);

    // Generate date range
    const dateRange = getDateRange(startDate, endDate);
    const nights = dateRange.length;

    // Fetch all property pricing records for the date range (property-level only, no room-specific)
    const pricingRecords = await db.propertyPricing.findMany({
      where: {
        propertyId,
        roomId: null,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Create pricing map for efficient lookup
    const pricingMap = new Map<string, { price: number; status: string }>();
    pricingRecords.forEach(record => {
      pricingMap.set(record.date, {
        price: record.price,
        status: record.priceType
      });
    });

    // Calculate pricing for each date
    const pricingDetails: PricingDetail[] = [];
    const breakdown: PricingBreakdown = {
      baseNights: 0,
      bestDealNights: 0,
      peakSeasonNights: 0,
      unavailableNights: 0,
      unavailableDates: []
    };

    for (const date of dateRange) {
      const pricing = pricingMap.get(date);

      // Check for sold out
      if (pricing && pricing.status === 'sold_out') {
        pricingDetails.push({
          date,
          price: 0,
          type: 'unavailable'
        });
        breakdown.unavailableNights++;
        breakdown.unavailableDates.push(date);
        continue;
      }

      // Check for best deal pricing - USE SINGLE PRICE
      if (pricing && pricing.status === 'best_deal') {
        pricingDetails.push({
          date,
          price: bestDealPrice,
          type: 'best_deal'
        });
        breakdown.bestDealNights++;
        continue;
      }

      // Check for peak_season pricing - USE SINGLE PRICE
      if (pricing && pricing.status === 'peak_season') {
        pricingDetails.push({
          date,
          price: peakSeasonPrice,
          type: 'peak_season'
        });
        breakdown.peakSeasonNights++;
        continue;
      }

      // Default to base price
      pricingDetails.push({
        date,
        price: basePricePerNight,
        type: 'base'
      });
      breakdown.baseNights++;
    }

    // Calculate total price (excluding unavailable dates)
    const totalPrice = pricingDetails
      .filter(detail => detail.type !== 'unavailable')
      .reduce((sum, detail) => sum + detail.price, 0);

    // Calculate average price per night (excluding unavailable dates)
    const availableNights = nights - breakdown.unavailableNights;
    const averagePricePerNight = availableNights > 0 
      ? Math.round(totalPrice / availableNights) 
      : 0;

    // Check if all dates are unavailable
    if (breakdown.unavailableNights === nights) {
      return NextResponse.json({
        error: 'All dates in the requested range are unavailable',
        code: 'ALL_DATES_UNAVAILABLE',
        unavailableDates: breakdown.unavailableDates
      }, { status: 400 });
    }

    return NextResponse.json({
      propertyId: property.id,
      propertyName: property.name,
      basePricePerNight,
      startDate,
      endDate,
      nights,
      breakdown,
      pricing: pricingDetails,
      totalPrice,
      averagePricePerNight
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}