const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const propertyImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.propertyPricing.deleteMany();
  await prisma.room.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();

  // Create hosts
  console.log('Creating hosts...');
  const host1 = await prisma.host.create({
    data: {
      userId: 'host-1',
      bio: 'Experienced property manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  const host2 = await prisma.host.create({
    data: {
      userId: 'host-2',
      bio: 'Passionate host',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  // Create properties
  console.log('Creating properties...');
  const properties = [];
  
  for (let i = 0; i < 10; i++) {
    const types = ['Villa', 'Apartment', 'House', 'Condo'];
    const cities = ['Jakarta', 'Bali', 'Surabaya', 'Bandung'];
    
    const property = await prisma.property.create({
      data: {
        name: `Beautiful ${types[i % 4]} ${i + 1}`,
        city: cities[i % 4],
        area: `Area ${i + 1}`,
        type: types[i % 4],
        price: 100 + (i * 50),
        bestDealPrice: 80 + (i * 40),
        peakSeasonPrice: 150 + (i * 60),
        nights: 2,
        rating: 4 + (Math.random() * 1),
        imageUrl: propertyImages[i % propertyImages.length] + `?w=800&h=600&fit=crop&q=80&sig=${i}`,
        isGuestFavorite: Math.random() > 0.5,
        description: `A wonderful property in a great location. Perfect for families.`,
        address: `${i + 1} Main Street`,
        country: 'Indonesia',
        latitude: -6.2 + (Math.random() * 0.1),
        longitude: 106.8 + (Math.random() * 0.1),
        bedrooms: 2 + (i % 3),
        bathrooms: 1 + (i % 2),
        maxGuests: 4 + (i % 4),
        petsAllowed: Math.random() > 0.7,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        hostId: i % 2 === 0 ? host1.id : host2.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
    properties.push(property);
  }

  // Create reviews
  console.log('Creating reviews...');
  for (const property of properties) {
    const reviewCount = 2 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < reviewCount; i++) {
      await prisma.review.create({
        data: {
          propertyId: property.id,
          userName: 'John Doe',
          userAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          rating: 4 + (Math.random() * 1),
          comment: 'Great property!',
          cleanliness: 4 + (Math.random() * 1),
          accuracy: 4 + (Math.random() * 1),
          communication: 4 + (Math.random() * 1),
          location: 4 + (Math.random() * 1),
          value: 4 + (Math.random() * 1),
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log(`Created 2 hosts`);
  console.log(`Created ${properties.length} properties`);
  console.log(`Created reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
