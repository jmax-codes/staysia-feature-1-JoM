/**
 * Room Availability API Route
 * 
 * Main route handler for room availability operations.
 * Delegates to individual handlers for each HTTP method.
 * 
 * @module api/room-availability
 */

import { NextRequest } from 'next/server';
import { handleGet, handlePost, handlePut, handleDelete } from './_handlers';

export { handleGet as GET, handlePost as POST, handlePut as PUT, handleDelete as DELETE };