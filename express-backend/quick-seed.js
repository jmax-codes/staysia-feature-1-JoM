const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickSeed() {
  try {
    console.log('🌱 Starting quick seed...');
    
    const now = new Date().toISOString();
    
    // Create properties WITHOUT host (hostId can be null)
    const properties = await Promise.all([
      prisma.property.create({
        data: {
          name: 'Beautiful Villa in Jakarta',
          city: 'Jakarta',
          area: 'Central Jakarta',
          type: 'Villa',
          price: 150,
          imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          rating: 4.5,
          nights: 2,
          isGuestFavorite: true,
          description: 'Amazing villa with modern amenities',
          address: '123 Main Street',
          country: 'Indonesia',
          latitude: -6.2088,
          longitude: 106.8456,
          bedrooms: 3,
          bathrooms: 2,
          maxGuests: 6,
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.property.create({
        data: {
          name: 'Luxury Apartment in Bali',
          city: 'Bali',
          area: 'Seminyak',
          type: 'Apartment',
          price: 200,
          imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
          rating: 4.8,
          nights: 2,
          isGuestFavorite: true,
          description: 'Luxury beachfront apartment',
          address: '456 Beach Road',
          country: 'Indonesia',
          latitude: -8.6905,
          longitude: 115.1700,
          bedrooms: 2,
          bathrooms: 1,
          maxGuests: 4,
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.property.create({
        data: {
          name: 'Cozy House in Surabaya',
          city: 'Surabaya',
          area: 'Downtown',
          type: 'House',
          price: 120,
          imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          rating: 4.3,
          nights: 2,
          isGuestFavorite: false,
          description: 'Cozy family house in the city center',
          address: '789 City Avenue',
          country: 'Indonesia',
          latitude: -7.2575,
          longitude: 112.7521,
          bedrooms: 4,
          bathrooms: 3,
          maxGuests: 8,
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.property.create({
        data: {
          name: 'Modern Condo in Bandung',
          city: 'Bandung',
          area: 'Dago',
          type: 'Condo',
          price: 180,
          imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          rating: 4.7,
          nights: 2,
          isGuestFavorite: true,
          description: 'Modern condo with mountain views',
          address: '321 Mountain View',
          country: 'Indonesia',
          latitude: -6.9175,
          longitude: 107.6191,
          bedrooms: 2,
          bathrooms: 2,
          maxGuests: 4,
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.property.create({
        data: {
          name: 'Beach House in Lombok',
          city: 'Lombok',
          area: 'Senggigi',
          type: 'House',
          price: 250,
          imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          rating: 4.9,
          nights: 2,
          isGuestFavorite: true,
          description: 'Stunning beach house with private access',
          address: '555 Beach Front',
          country: 'Indonesia',
          latitude: -8.4905,
          longitude: 116.0419,
          bedrooms: 5,
          bathrooms: 4,
          maxGuests: 10,
          createdAt: now,
          updatedAt: now,
        },
      }),
    ]);

    console.log(`✅ Created ${properties.length} properties`);
    console.log('🎉 Seed completed!');
  } catch (error) {
    console.error('❌ Quick seed failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

quickSeed();
