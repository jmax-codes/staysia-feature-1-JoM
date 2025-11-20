import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate pricing data
function generatePricingData(propertyId: number, basePrice: number, bestDealPrice: number, peakSeasonPrice: number) {
  const pricingData = [];
  const today = new Date();
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Distribute price types: 60% base, 20% best deal, 15% peak, 5% sold out
    const random = Math.random();
    let priceType: string;
    let price: number;
    
    if (random < 0.05) {
      // 5% sold out
      priceType = 'soldOut';
      price = 0;
    } else if (random < 0.25) {
      // 20% best deal
      priceType = 'bestDeal';
      price = bestDealPrice;
    } else if (random < 0.40) {
      // 15% peak season
      priceType = 'peakSeason';
      price = peakSeasonPrice;
    } else {
      // 60% base price
      priceType = 'base';
      price = basePrice;
    }
    
    pricingData.push({
      propertyId,
      date: dateString,
      price,
      priceType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return pricingData;
}

async function main() {
  console.log('🌱 Seeding database...');
  
  // Delete all data in correct order
  console.log('🗑️  Deleting existing data...');
  await prisma.propertyPricing.deleteMany();
  await prisma.roomAvailability.deleteMany();
  await prisma.peakSeasonRate.deleteMany();
  await prisma.room.deleteMany();
  await prisma.review.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();
  
  const timestamp = new Date().toISOString();
  
  // Create diverse Indonesian hosts
  console.log('👤 Creating hosts...');
  const hostsData = [
    {
      fullName: 'Budi Santoso',
      profilePicture: 'https://i.pravatar.cc/150?u=budi',
      contactNumber: '+6281234567890',
      bio: 'Experienced host from Bandung, loves introducing guests to local Sundanese culture.',
    },
    {
      fullName: 'Siti Aminah',
      profilePicture: 'https://i.pravatar.cc/150?u=siti',
      contactNumber: '+6281345678901',
      bio: 'Jakarta native who knows all the best hidden gems in the city.',
    },
    {
      fullName: 'Agus Pratama',
      profilePicture: 'https://i.pravatar.cc/150?u=agus',
      contactNumber: '+6281456789012',
      bio: 'Surfer and yoga instructor living the dream in Bali.',
    },
    {
      fullName: 'Dewi Lestari',
      profilePicture: 'https://i.pravatar.cc/150?u=dewi',
      contactNumber: '+6281567890123',
      bio: 'Passionate about Javanese heritage and traditional architecture in Yogyakarta.',
    },
    {
      fullName: 'Rina Wulandari',
      profilePicture: 'https://i.pravatar.cc/150?u=rina',
      contactNumber: '+6281678901234',
      bio: 'Modern living enthusiast based in BSD City.',
    }
  ];

  const hosts = [];
  for (const hostData of hostsData) {
    const host = await prisma.host.create({
      data: {
        ...hostData,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });
    hosts.push(host);
  }
  
  console.log('🏠 Creating properties with diverse locations...\n');
  
  // Define properties with unique images and varying data
  const propertiesData = [
    {
      name: 'Villa Dago Pakar',
      city: 'Bandung',
      area: 'Dago',
      type: 'Villa',
      price: 2500000,
      latitude: -6.8735,
      longitude: 107.6353,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
      ],
      rules: ['No loud music after 9 PM', 'No smoking', 'Pets allowed'],
      roomCount: 4,
      reviewCount: 6
    },
    {
      name: 'Menteng Heritage Residence',
      city: 'Jakarta',
      area: 'Menteng',
      type: 'House',
      price: 3500000,
      latitude: -6.1954,
      longitude: 106.8346,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfe1?w=800'
      ],
      rules: ['No parties', 'No smoking', 'Check-in after 2 PM'],
      roomCount: 3,
      reviewCount: 8
    },
    {
      name: 'BSD City Modern Loft',
      city: 'Kabupaten Tangerang',
      area: 'BSD City',
      type: 'Apartment',
      price: 1200000,
      latitude: -6.3024,
      longitude: 106.6532,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1502005229766-939cb4a5c909?w=800',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
      ],
      rules: ['No pets', 'No smoking', 'Quiet hours 10 PM - 7 AM'],
      roomCount: 2,
      reviewCount: 4
    },
    {
      name: 'Omah Jogja Traditional House',
      city: 'Yogyakarta',
      area: 'Kaliurang',
      type: 'House',
      price: 950000,
      latitude: -7.6079,
      longitude: 110.4162,
      imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
        'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800',
        'https://images.unsplash.com/photo-1576675784201-0e142b423952?w=800',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'
      ],
      rules: ['Respect local customs', 'No shoes inside', 'No loud noise'],
      roomCount: 3,
      reviewCount: 12
    },
    {
      name: 'Ubud Rice Field Villa',
      city: 'Bali',
      area: 'Ubud',
      type: 'Villa',
      price: 1700000,
      latitude: -8.5069,
      longitude: 115.2625,
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
        'https://images.unsplash.com/photo-1576675784201-0e142b423952?w=800',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
      ],
      rules: ['Check-in: After 2:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No pets'],
      roomCount: 3,
      reviewCount: 5
    },
    {
      name: 'Seminyak Beach Villa',
      city: 'Bali',
      area: 'Seminyak',
      type: 'Villa',
      price: 2000000,
      latitude: -8.6836,
      longitude: 115.1613,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'
      ],
      rules: ['Check-in: 3:00 PM - 8:00 PM', 'Checkout: 12:00 PM', 'No smoking inside'],
      roomCount: 2,
      reviewCount: 3
    }
  ];
  
  for (const propData of propertiesData) {
    const bestDealPrice = Math.round(propData.price * 0.8); // 20% off
    const peakSeasonPrice = Math.round(propData.price * 1.4); // 40% increase
    
    // Assign random host
    const randomHost = hosts[Math.floor(Math.random() * hosts.length)];
    
    // Create property with bedrooms matching room count
    const property = await prisma.property.create({
      data: {
        name: propData.name,
        city: propData.city,
        area: propData.area,
        type: propData.type,
        price: propData.price,
        bestDealPrice,
        peakSeasonPrice,
        rating: 4.5 + Math.random() * 0.5,
        imageUrl: propData.imageUrl,
        isGuestFavorite: Math.random() > 0.3,
        country: 'Indonesia',
        bedrooms: propData.roomCount, // SYNCHRONIZED with room count
        bathrooms: Math.max(1, propData.roomCount - 1),
        maxGuests: propData.roomCount * 2,
        petsAllowed: Math.random() > 0.5,
        isPublished: true,
        latitude: propData.latitude,
        longitude: propData.longitude,
        description: `Beautiful ${propData.type} in ${propData.area}, ${propData.city}. Experience luxury and comfort.`,
        amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking', 'Pool', 'Gym'],
        propertyRules: propData.rules,
        images: propData.images,
        checkInTime: '14:00',
        checkOutTime: '12:00',
        hostId: randomHost.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });
    
    // Create rooms (count matches bedrooms)
    const roomTypes = [
      { name: 'Deluxe Twin Bed', type: 'Twin', priceMultiplier: 0.6, maxGuests: 2, beds: { type: 'Twin', count: 2 } },
      { name: 'Deluxe King Bed', type: 'King', priceMultiplier: 0.8, maxGuests: 2, beds: { type: 'King', count: 1 } },
      { name: 'Family Suite', type: 'Suite', priceMultiplier: 1.2, maxGuests: 4, beds: { type: 'Queen', count: 2 } },
      { name: 'Master Suite', type: 'Suite', priceMultiplier: 1.5, maxGuests: 2, beds: { type: 'King', count: 1 } },
    ];
    
    for (let i = 0; i < propData.roomCount; i++) {
      const roomType = roomTypes[i % roomTypes.length];
      await prisma.room.create({
        data: {
          propertyId: property.id,
          name: roomType.name,
          type: roomType.type,
          pricePerNight: Math.round(property.price * roomType.priceMultiplier),
          maxGuests: roomType.maxGuests,
          beds: roomType.beds,
          amenities: ['Queen/King Bed', 'Private Bathroom', 'Room Heating', 'Free Wi-Fi', 'Power Outlets Near Bed', 'Kitchen'],
          available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        }
      });
    }
    
    // Create reviews (varying count)
    const reviewTexts = [
      { name: 'Anna Lee', rating: 4.3, comment: 'Incredible experience! The property had everything we needed and more.' },
      { name: 'Ryan O\'Brien', rating: 4.8, comment: 'Superb accommodation! The property is well-designed with quality furnishings.' },
      { name: 'Emily White', rating: 4.8, comment: 'Amazing stay! Clean, comfortable, and exactly as described.' },
      { name: 'Michael Chen', rating: 4.5, comment: 'Great location and wonderful amenities. The host was very responsive.' },
      { name: 'Sarah Johnson', rating: 4.7, comment: 'Perfect getaway! The property exceeded our expectations.' },
      { name: 'David Kim', rating: 4.6, comment: 'Lovely place, very peaceful and relaxing.' },
      { name: 'Jessica Wong', rating: 4.9, comment: 'Absolutely stunning! Will definitely come back.' },
    ];
    
    for (let i = 0; i < propData.reviewCount; i++) {
      const review = reviewTexts[i % reviewTexts.length];
      await prisma.review.create({
        data: {
          propertyId: property.id,
          userName: review.name,
          userAvatar: `https://i.pravatar.cc/150?u=user${i}`,
          rating: review.rating,
          comment: review.comment,
          createdAt: timestamp,
          updatedAt: timestamp,
        }
      });
    }
    
    // Create pricing data with all price types
    const pricingData = generatePricingData(property.id, property.price, bestDealPrice, peakSeasonPrice);
    await prisma.propertyPricing.createMany({
      data: pricingData
    });
    
    console.log(`✅ ${property.name} (${property.city})`);
    console.log(`   - Host: ${randomHost.fullName}`);
    console.log(`   - Pricing: Base ${property.price} | Best Deal ${bestDealPrice} | Peak ${peakSeasonPrice}`);
  }
  
  console.log('🎉 Database seeded successfully!');
  console.log(`📊 Total: ${propertiesData.length} properties`);
  console.log(`💰 Pricing Logic: Best Deal < Base < Peak Season`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
