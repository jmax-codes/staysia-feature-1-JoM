/**
 * Peak Season Rates API Route
 * 
 * API endpoints for managing peak season pricing rates.
 * Supports CRUD operations with authentication and ownership verification.
 * 
 * @module PeakSeasonRatesAPI
 */

import { NextRequest } from 'next/server';
import { handleGet } from './_handlers/get';
import { handlePost } from './_handlers/post';
import { handlePut } from './_handlers/put';
import { handleDelete } from './_handlers/delete';

/**
 * GET /api/peak-season-rates
 * 
 * Retrieve peak season rates filtered by property or room.
 * 
 * Query params:
 * - propertyId: Filter by property
 * - roomId: Filter by room
 * - isActive: Filter by active status (true/false)
 * - limit: Max records (default: 50, max: 100)
 * - offset: Pagination offset (default: 0)
 * 
 * @param request - Next.js request object
 * @returns JSON response with peak season rates
 * 
 * @sideEffects Queries database for peak season rates
 */
export async function GET(request: NextRequest) {
  return handleGet(request);
}

/**
 * POST /api/peak-season-rates
 * 
 * Create a new peak season rate.
 * Requires authentication and property/room ownership.
 * 
 * Request body:
 * ```json
 * {
 *   "propertyId": 1,
 *   "roomId": 2,
 *   "startDate": "2024-12-20",
 *   "endDate": "2024-12-31",
 *   "priceIncrease": 200,
 *   "percentageIncrease": 40,
 *   "isActive": true
 * }
 * ```
 * 
 * @param request - Next.js request object
 * @returns JSON response with created peak season rate
 * 
 * @sideEffects Creates peak season rate in database
 */
export async function POST(request: NextRequest) {
  return handlePost(request);
}

/**
 * PUT /api/peak-season-rates
 * 
 * Update an existing peak season rate.
 * Requires authentication and property/room ownership.
 * 
 * Request body:
 * ```json
 * {
 *   "id": 5,
 *   "priceIncrease": 250,
 *   "isActive": true
 * }
 * ```
 * 
 * @param request - Next.js request object
 * @returns JSON response with updated peak season rate
 * 
 * @sideEffects Updates peak season rate in database
 */
export async function PUT(request: NextRequest) {
  return handlePut(request);
}

/**
 * DELETE /api/peak-season-rates
 * 
 * Delete a peak season rate.
 * Requires authentication and property/room ownership.
 * 
 * Query params:
 * - id: Peak season rate ID to delete
 * 
 * @param request - Next.js request object
 * @returns JSON response confirming deletion
 * 
 * @sideEffects Deletes peak season rate from database
 */
export async function DELETE(request: NextRequest) {
  return handleDelete(request);
}