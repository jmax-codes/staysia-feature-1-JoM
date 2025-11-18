/**
 * Property Pricing API Route
 * 
 * API endpoints for managing property pricing data.
 * Supports filtering by property, room, dates, and status.
 * 
 * @module PropertyPricingAPI
 */

import { NextRequest } from 'next/server';
import { handleGet } from './_handlers/get';
import { handlePost } from './_handlers/post';

/**
 * GET /api/property-pricing
 * 
 * Retrieve property pricing data.
 * 
 * Query params:
 * - id: Get single record by ID
 * - propertyId: Filter by property (required for list)
 * - roomId: Filter by room
 * - startDate: Filter by start date (YYYY-MM-DD)
 * - endDate: Filter by end date (YYYY-MM-DD)
 * - status: Filter by status (available, sold_out, peak_season, best_deal)
 * - limit: Max records (default: 100, max: 365)
 * - offset: Pagination offset (default: 0)
 * 
 * @param request - Next.js request object
 * @returns JSON response with pricing data
 * 
 * @sideEffects Queries database for pricing records
 */
export async function GET(request: NextRequest) {
  return handleGet(request);
}

/**
 * POST /api/property-pricing
 * 
 * Create property pricing data.
 * 
 * Single entry (no auth required):
 * ```json
 * {
 *   "propertyId": 1,
 *   "roomId": 2,
 *   "date": "2024-01-15",
 *   "price": 150,
 *   "status": "available"
 * }
 * ```
 * 
 * Bulk entries (auth required):
 * ```json
 * {
 *   "propertyId": 1,
 *   "pricingEntries": [
 *     { "date": "2024-01-15", "price": 150, "priceType": "available" }
 *   ]
 * }
 * ```
 * 
 * @param request - Next.js request object
 * @returns JSON response with created pricing data
 * 
 * @sideEffects Creates pricing records in database
 */
export async function POST(request: NextRequest) {
  return handlePost(request);
}