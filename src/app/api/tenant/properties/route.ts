/**
 * Tenant Properties API Route
 * 
 * API endpoints for tenant property management.
 * Allows authenticated tenants to create and list their properties.
 * 
 * @module TenantPropertiesAPI
 */

import { NextRequest } from 'next/server';
import { handleGet } from './_handlers/get';
import { handlePost } from './_handlers/post';

/**
 * GET /api/tenant/properties
 * 
 * Retrieve all properties owned by authenticated tenant.
 * Returns enriched data with images count, amenities count, rooms count.
 * 
 * Query params:
 * - limit: Max records (default: 20, max: 100)
 * - offset: Pagination offset (default: 0)
 * 
 * @param request - Next.js request object
 * @returns JSON response with properties list
 * 
 * @sideEffects Queries database for authenticated user's properties
 */
export async function GET(request: NextRequest) {
  return handleGet(request);
}

/**
 * POST /api/tenant/properties
 * 
 * Create a new property with optional images, amenities, and rooms.
 * Requires authentication with tenant role.
 * 
 * Request body:
 * ```json
 * {
 *   "name": "Luxury Villa",
 *   "city": "Jakarta",
 *   "area": "South Jakarta",
 *   "type": "Villa",
 *   "price": 500000,
 *   "imageUrl": "https://...",
 *   "rooms": [...],
 *   "amenities": [...],
 *   "images": [...]
 * }
 * ```
 * 
 * @param request - Next.js request object
 * @returns JSON response with created property
 * 
 * @sideEffects Creates property and related data in database
 */
export async function POST(request: NextRequest) {
  return handlePost(request);
}