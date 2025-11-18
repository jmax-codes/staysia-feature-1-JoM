/**
 * Rooms API Route
 * 
 * Main route handler for room operations.
 * Delegates to individual handlers for each HTTP method.
 * 
 * @module api/rooms
 */

import { NextRequest } from 'next/server';
import { handleGet, handlePost, handlePut, handleDelete } from './_handlers';

export { handleGet as GET, handlePost as POST, handlePut as PUT, handleDelete as DELETE };