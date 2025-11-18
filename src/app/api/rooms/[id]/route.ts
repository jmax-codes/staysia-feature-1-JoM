/**
 * Single Room API Route
 * 
 * Handles GET, PUT, and DELETE operations for individual rooms.
 * Provides room details with availability and peak season rates.
 * 
 * @module api/rooms/[id]
 */

import { NextRequest } from 'next/server';
import { handleGet } from './_handlers/get';
import { handlePut } from './_handlers/put';
import { handleDelete } from './_handlers/delete';

/**
 * GET /api/rooms/[id]
 * 
 * Retrieves room details with availability and peak season rates.
 * Public endpoint - no authentication required.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters with room ID
 * @returns Room data with availability and peak rates
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleGet(request, { params });
}

/**
 * PUT /api/rooms/[id]
 * 
 * Updates room details.
 * Requires tenant authentication and property ownership.
 * 
 * @param request - Next.js request object with bearer token
 * @param params - Route parameters with room ID
 * @returns Updated room data
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handlePut(request, { params });
}

/**
 * DELETE /api/rooms/[id]
 * 
 * Deletes a room.
 * Requires tenant authentication and property ownership.
 * Cascades to availability and peak season rates.
 * 
 * @param request - Next.js request object with bearer token
 * @param params - Route parameters with room ID
 * @returns Success confirmation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleDelete(request, { params });
}