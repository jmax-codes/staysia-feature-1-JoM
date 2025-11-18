/**
 * Properties API Route
 * 
 * Public API for property listings and creation.
 * Supports filtering, search, pagination, and sorting.
 * 
 * @module api/properties
 */

import { NextRequest } from 'next/server';
import { handleGetList, handleGetSingle } from './_handlers/get';
import { handlePost } from './_handlers/post';

/**
 * GET /api/properties
 * 
 * Retrieves properties with optional filtering and pagination.
 * Supports single property lookup via ?id= parameter.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    return handleGetSingle(id);
  }

  return handleGetList(request);
}

/**
 * POST /api/properties
 * 
 * Creates a new property with validation.
 */
export async function POST(request: NextRequest) {
  return handlePost(request);
}