/**
 * Update Utilities for Property Relations
 * 
 * Handles updates to property images, amenities, and rooms.
 * 
 * @module api/tenant/properties/[id]/utils/updates
 */

import { db } from '@/db';

/**
 * Update property images
 * 
 * Replaces all property images with new set.
 * 
 * @param propertyId - Property ID
 * @param images - Array of image objects
 */
export async function updatePropertyImages(propertyId: number, images: any[]) {
  // Delete existing images
  await db.propertyImage.deleteMany({
    where: { propertyId }
  });

  // Insert new images
  if (images.length > 0) {
    const timestamp = new Date().toISOString();
    const newImages = images.map((img: any, index: number) => ({
      propertyId,
      imageUrl: img.imageUrl,
      displayOrder: img.displayOrder !== undefined ? img.displayOrder : index,
      isCover: img.isCover || false,
      createdAt: timestamp,
      updatedAt: timestamp
    }));

    await db.propertyImage.createMany({ data: newImages });
  }
}

/**
 * Update property amenities
 * 
 * Replaces all property amenities with new set.
 * 
 * @param propertyId - Property ID
 * @param amenities - Array of amenity objects
 */
export async function updatePropertyAmenities(propertyId: number, amenities: any[]) {
  // Delete existing amenities
  await db.propertyAmenity.deleteMany({
    where: { propertyId }
  });

  // Insert new amenities
  if (amenities.length > 0) {
    const timestamp = new Date().toISOString();
    const newAmenities = amenities.map((amenity: any) => ({
      propertyId,
      amenityName: amenity.amenityName,
      amenityType: amenity.amenityType,
      createdAt: timestamp,
      updatedAt: timestamp
    }));

    await db.propertyAmenity.createMany({ data: newAmenities });
  }
}

/**
 * Update property rooms
 * 
 * Handles room create, update, and delete operations.
 * 
 * @param propertyId - Property ID
 * @param rooms - Array of room objects
 */
export async function updateRooms(propertyId: number, rooms: any[]) {
  const existingRooms = await db.room.findMany({
    where: { propertyId }
  });
  
  const existingRoomIds = existingRooms.map(r => r.id);
  const updatedRoomIds: number[] = [];
  const timestamp = new Date().toISOString();

  for (const room of rooms) {
    const roomData: any = {
      propertyId,
      name: room.name,
      type: room.type,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      updatedAt: timestamp
    };

    // Handle optional fields
    if (room.beds !== undefined) roomData.beds = JSON.stringify(room.beds);
    if (room.size !== undefined) roomData.size = room.size;
    if (room.amenities !== undefined) roomData.amenities = JSON.stringify(room.amenities);
    if (room.available !== undefined) roomData.available = room.available;
    if (room.roomNumber !== undefined) roomData.roomNumber = room.roomNumber;
    if (room.inRoomAmenities !== undefined) roomData.inRoomAmenities = JSON.stringify(room.inRoomAmenities);
    if (room.bathroomFacilities !== undefined) roomData.bathroomFacilities = JSON.stringify(room.bathroomFacilities);
    if (room.additionalFeatures !== undefined) roomData.additionalFeatures = JSON.stringify(room.additionalFeatures);
    if (room.technologyComfort !== undefined) roomData.technologyComfort = JSON.stringify(room.technologyComfort);
    if (room.extraServices !== undefined) roomData.extraServices = JSON.stringify(room.extraServices);
    if (room.hasLock !== undefined) roomData.hasLock = room.hasLock;

    if (room.id) {
      // Update existing room
      await db.room.update({
        where: { id: room.id },
        data: roomData
      });
      updatedRoomIds.push(room.id);
    } else {
      // Create new room
      roomData.createdAt = timestamp;
      const newRoom = await db.room.create({
        data: roomData
      });
      updatedRoomIds.push(newRoom.id);
    }
  }

  // Delete rooms not in update
  const roomsToDelete = existingRoomIds.filter(id => !updatedRoomIds.includes(id));
  if (roomsToDelete.length > 0) {
    await db.room.deleteMany({
      where: { id: { in: roomsToDelete } }
    });
  }
}
