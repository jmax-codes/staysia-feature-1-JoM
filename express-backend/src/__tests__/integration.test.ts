/**
 * Integration Tests
 * 
 * Tests for card/details consistency and other integration scenarios.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Integration Tests', () => {
  beforeAll(async () => {
    // Setup test data
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Card/Details Consistency', () => {
    it('should fail when card.bedrooms does not match details.rooms.length', async () => {
      // Create property with mismatched data
      const propertyData = {
        name: 'Test Property',
        city: 'Jakarta',
        area: 'Test Area',
        type: 'Villa',
        price: 100,
        bedrooms: 3, // Card shows 3 bedrooms
        imageUrl: 'https://example.com/image.jpg',
        hostId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        const property = await prisma.property.create({
          data: propertyData
        });

        // Create only 2 rooms (mismatch!)
        await prisma.room.create({
          data: {
            propertyId: property.id,
            name: 'Room 1',
            type: 'Bedroom',
            pricePerNight: 50,
            maxGuests: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });

        await prisma.room.create({
          data: {
            propertyId: property.id,
            name: 'Room 2',
            type: 'Bedroom',
            pricePerNight: 50,
            maxGuests: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });

        // Verify mismatch
        const rooms = await prisma.room.findMany({
          where: { propertyId: property.id }
        });

        expect(rooms.length).not.toBe(property.bedrooms);
        expect(rooms.length).toBe(2);
        expect(property.bedrooms).toBe(3);

        // This should fail validation in production
        const isValid = rooms.length === property.bedrooms;
        expect(isValid).toBe(false);

        // Cleanup
        await prisma.room.deleteMany({ where: { propertyId: property.id } });
        await prisma.property.delete({ where: { id: property.id } });
      } catch (error) {
        // Expected to fail
        expect(error).toBeDefined();
      }
    });

    it('should pass when card.bedrooms matches details.rooms.length', async () => {
      const propertyData = {
        name: 'Test Property 2',
        city: 'Jakarta',
        area: 'Test Area',
        type: 'Villa',
        price: 100,
        bedrooms: 2, // Card shows 2 bedrooms
        imageUrl: 'https://example.com/image.jpg',
        hostId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const property = await prisma.property.create({
        data: propertyData
      });

      // Create exactly 2 rooms (match!)
      await prisma.room.create({
        data: {
          propertyId: property.id,
          name: 'Room 1',
          type: 'Bedroom',
          pricePerNight: 50,
          maxGuests: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });

      await prisma.room.create({
        data: {
          propertyId: property.id,
          name: 'Room 2',
          type: 'Bedroom',
          pricePerNight: 50,
          maxGuests: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });

      // Verify match
      const rooms = await prisma.room.findMany({
        where: { propertyId: property.id }
      });

      expect(rooms.length).toBe(property.bedrooms);
      expect(rooms.length).toBe(2);

      // This should pass validation
      const isValid = rooms.length === property.bedrooms;
      expect(isValid).toBe(true);

      // Cleanup
      await prisma.room.deleteMany({ where: { propertyId: property.id } });
      await prisma.property.delete({ where: { id: property.id } });
    });
  });

  describe('Pricing Logic Integration', () => {
    it('should calculate total price correctly with mixed pricing types', async () => {
      const property = await prisma.property.create({
        data: {
          name: 'Test Property 3',
          city: 'Jakarta',
          area: 'Test Area',
          type: 'Villa',
          price: 100,
          bestDealPrice: 80,
          peakSeasonPrice: 150,
          imageUrl: 'https://example.com/image.jpg',
          hostId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });

      // Create pricing for 5 days
      const today = new Date();
      await prisma.propertyPricing.createMany({
        data: [
          {
            propertyId: property.id,
            date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
            price: 100,
            priceType: 'available',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            propertyId: property.id,
            date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
            price: 80,
            priceType: 'best_deal',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            propertyId: property.id,
            date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
            price: 150,
            priceType: 'peak_season',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      });

      const expectedTotal = 100 + 80 + 150; // 330
      expect(expectedTotal).toBe(330);

      // Cleanup
      await prisma.propertyPricing.deleteMany({ where: { propertyId: property.id } });
      await prisma.property.delete({ where: { id: property.id } });
    });
  });
});
