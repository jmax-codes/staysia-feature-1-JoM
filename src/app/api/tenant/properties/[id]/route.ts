/**
 * Tenant Property API Route
 * 
 * RESTful API for managing individual properties.
 * Supports GET, PUT, and DELETE operations with authentication.
 * 
 * @module api/tenant/properties/[id]
 */

import { NextRequest } from 'next/server';
import { handleGet } from './_handlers/get';
import { handlePut } from './_handlers/put';
import { handleDelete } from './_handlers/delete';

/**
 * GET /api/tenant/properties/[id]
 * 
 * Retrieves detailed property information.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleGet(request, { id });
}

/**
 * PUT /api/tenant/properties/[id]
 * 
 * Updates property information and relations.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handlePut(request, { id });
}

/**
 * DELETE /api/tenant/properties/[id]
 * 
 * Deletes property and all related data.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleDelete(request, { id });
}