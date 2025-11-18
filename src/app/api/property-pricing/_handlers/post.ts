/**
 * Property Pricing POST Handler
 * 
 * Handles POST requests for creating property pricing data.
 * Supports both single and bulk creation.
 * 
 * @module PropertyPricingPOSTHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authenticateTenant, verifyPropertyOwnership } from '@/app/api/_utils/auth';
import { 
  validateDateFormat, 
  validatePositiveInteger, 
  validatePriceType,
  validatePriceAgainstBase 
} from '@/app/api/_utils/validation';

/**
 * Handle POST request for property pricing
 * 
 * Creates pricing entries. Supports:
 * - Single entry creation (no auth required for backward compatibility)
 * - Bulk entry creation with authentication
 * 
 * @param request - Next.js request object
 * @returns JSON response with created pricing data
 * 
 * @sideEffects Creates pricing records in database
 * 
 * @example
 * Single: POST /api/property-pricing
 * ```json
 * { "propertyId": 1, "date": "2024-01-15", "price": 150, "status": "available" }
 * ```
 * 
 * Bulk: POST /api/property-pricing (with auth)
 * ```json
 * { 
 *   "propertyId": 1, 
 *   "pricingEntries": [
 *     { "date": "2024-01-15", "price": 150, "priceType": "available" }
 *   ]
 * }
 * ```
 */
export async function handlePost(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if bulk creation
    if (body.pricingEntries && Array.isArray(body.pricingEntries)) {
      return await handleBulkCreation(request, body);
    }

    // Single creation
    return await handleSingleCreation(body);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

/**
 * Handle bulk pricing creation with authentication
 */
async function handleBulkCreation(request: NextRequest, body: any) {
  // Authenticate
  const auth = await authenticateTenant(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { host } = auth;

  // Validate property ID
  if (!validatePositiveInteger(body.propertyId)) {
    return NextResponse.json({ 
      error: 'Valid property ID is required',
      code: 'INVALID_PROPERTY_ID' 
    }, { status: 400 });
  }

  // Verify ownership
  const ownership = await verifyPropertyOwnership(host.id, body.propertyId);
  if (!ownership.valid) {
    return NextResponse.json({ 
      error: ownership.error,
      code: 'PERMISSION_DENIED' 
    }, { status: 403 });
  }

  // Get base prices
  const roomBasePrices = await getRoomBasePrices(body.propertyId, body.roomId);
  const property = await db.property.findUnique({
    where: { id: body.propertyId }
  });

  // Validate and prepare entries
  const pricingData = [];
  const timestamp = new Date().toISOString();
  
  for (let i = 0; i < body.pricingEntries.length; i++) {
    const entry = body.pricingEntries[i];
    
    // Validate entry
    const validation = validatePricingEntry(entry, i, roomBasePrices, property);
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.error,
        code: validation.code 
      }, { status: 400 });
    }

    pricingData.push({
      propertyId: body.propertyId,
      roomId: entry.roomId || null,
      date: entry.date,
      price: entry.price,
      priceType: entry.priceType,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  // Bulk insert
  if (pricingData.length > 0) {
    await db.propertyPricing.createMany({
      data: pricingData
    });
  }

  return NextResponse.json({
    success: true,
    message: `Successfully created ${pricingData.length} pricing entries`,
    count: pricingData.length,
  }, { status: 201 });
}

/**
 * Handle single pricing creation (no auth for backward compatibility)
 */
async function handleSingleCreation(body: any) {
  const { propertyId, roomId, date, price, status } = body;

  // Validate property ID
  if (!validatePositiveInteger(propertyId)) {
    return NextResponse.json({
      error: 'Property ID must be a valid positive integer',
      code: 'INVALID_PROPERTY_ID'
    }, { status: 400 });
  }

  // Validate date
  if (!date || !validateDateFormat(date)) {
    return NextResponse.json({
      error: 'Date is required and must be in ISO format (YYYY-MM-DD)',
      code: 'INVALID_DATE_FORMAT'
    }, { status: 400 });
  }

  // Validate price
  if (!validatePositiveInteger(price)) {
    return NextResponse.json({
      error: 'Price is required and must be a positive integer',
      code: 'INVALID_PRICE'
    }, { status: 400 });
  }

  // Validate status
  if (!status || !validatePriceType(status)) {
    return NextResponse.json({
      error: 'Status is required and must be one of: available, sold_out, peak_season, best_deal',
      code: 'INVALID_STATUS'
    }, { status: 400 });
  }

  // Validate price against base price
  if (roomId !== undefined && roomId !== null) {
    if (!validatePositiveInteger(roomId)) {
      return NextResponse.json({
        error: 'Room ID must be a valid positive integer',
        code: 'INVALID_ROOM_ID'
      }, { status: 400 });
    }
    
    const room = await db.room.findUnique({
      where: { id: roomId }
    });
    
    if (room) {
      const validation = validatePriceAgainstBase(price, room.pricePerNight, status);
      if (!validation.valid) {
        return NextResponse.json({
          error: validation.error,
          code: status === 'best_deal' ? 'INVALID_BEST_DEAL_PRICE' : 'INVALID_PEAK_SEASON_PRICE'
        }, { status: 400 });
      }
    }
  } else {
    const property = await db.property.findUnique({
      where: { id: propertyId }
    });
    
    if (property) {
      const validation = validatePriceAgainstBase(price, property.price, status);
      if (!validation.valid) {
        return NextResponse.json({
          error: validation.error,
          code: status === 'best_deal' ? 'INVALID_BEST_DEAL_PRICE' : 'INVALID_PEAK_SEASON_PRICE'
        }, { status: 400 });
      }
    }
  }

  // Create record
  const insertData: any = {
    propertyId,
    date,
    price,
    priceType: status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (roomId !== undefined && roomId !== null) {
    insertData.roomId = roomId;
  }

  const newRecord = await db.propertyPricing.create({
    data: insertData
  });

  // Map priceType to status for frontend compatibility
  const result = {
    ...newRecord,
    status: newRecord.priceType
  };

  return NextResponse.json(result, { status: 201 });
}

/**
 * Get room base prices for validation
 */
async function getRoomBasePrices(
  propertyId: number, 
  specificRoomId?: number
): Promise<Record<number, number>> {
  const roomBasePrices: Record<number, number> = {};
  
  if (specificRoomId) {
    const room = await db.room.findUnique({
      where: { id: specificRoomId }
    });
    
    if (room) {
      roomBasePrices[specificRoomId] = room.pricePerNight;
    }
  } else {
    const propertyRooms = await db.room.findMany({
      where: { propertyId }
    });
    
    propertyRooms.forEach(room => {
      roomBasePrices[room.id] = room.pricePerNight;
    });
  }
  
  return roomBasePrices;
}

/**
 * Validate single pricing entry
 */
function validatePricingEntry(
  entry: any, 
  index: number, 
  roomBasePrices: Record<number, number>,
  property: any
): { valid: boolean; error?: string; code?: string } {
  if (!entry.date || typeof entry.date !== 'string') {
    return { 
      valid: false, 
      error: `Entry ${index + 1}: date is required and must be a string`,
      code: 'INVALID_ENTRY_DATE'
    };
  }

  if (!validatePositiveInteger(entry.price)) {
    return { 
      valid: false, 
      error: `Entry ${index + 1}: price must be a positive number`,
      code: 'INVALID_ENTRY_PRICE'
    };
  }

  if (!entry.priceType || !validatePriceType(entry.priceType)) {
    return { 
      valid: false, 
      error: `Entry ${index + 1}: priceType must be 'best_deal', 'peak_season', 'available', or 'sold_out'`,
      code: 'INVALID_ENTRY_PRICE_TYPE'
    };
  }

  // Validate pricing rules
  const entryRoomId = entry.roomId || null;
  if (entryRoomId && roomBasePrices[entryRoomId]) {
    const basePrice = roomBasePrices[entryRoomId];
    const validation = validatePriceAgainstBase(entry.price, basePrice, entry.priceType);
    
    if (!validation.valid) {
      return { 
        valid: false, 
        error: `Entry ${index + 1}: ${validation.error}`,
        code: 'INVALID_ENTRY_PRICING'
      };
    }
  } else if (!entryRoomId && property) {
    const basePrice = property.price;
    const validation = validatePriceAgainstBase(entry.price, basePrice, entry.priceType);
    
    if (!validation.valid) {
      return { 
        valid: false, 
        error: `Entry ${index + 1}: ${validation.error}`,
        code: 'INVALID_ENTRY_PRICING'
      };
    }
  }

  return { valid: true };
}
