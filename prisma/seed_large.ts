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
    
    const random = Math.random();
    let priceType: string;
    let price: number;
    
    if (random < 0.05) {
      priceType = 'soldOut';
      price = 0;
    } else if (random < 0.25) {
      priceType = 'bestDeal';
      price = bestDealPrice;
    } else if (random < 0.40) {
      priceType = 'peakSeason';
      price = peakSeasonPrice;
    } else {
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
  console.log('🌱 Seeding database with 80+ properties...');
  
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
  
  console.log('👤 Creating 20 hosts...');
  const hostsData = [
    { fullName: 'Budi Santoso', profilePicture: 'https://i.pravatar.cc/150?u=budi', contactNumber: '+6281234567890', bio: 'Experienced host from Bandung, loves introducing guests to local Sundanese culture.' },
    { fullName: 'Siti Aminah', profilePicture: 'https://i.pravatar.cc/150?u=siti', contactNumber: '+6281345678901', bio: 'Jakarta native who knows all the best hidden gems in the city.' },
    { fullName: 'Agus Pratama', profilePicture: 'https://i.pravatar.cc/150?u=agus', contactNumber: '+6281456789012', bio: 'Surfer and yoga instructor living the dream in Bali.' },
    { fullName: 'Dewi Lestari', profilePicture: 'https://i.pravatar.cc/150?u=dewi', contactNumber: '+6281567890123', bio: 'Passionate about Javanese heritage and traditional architecture in Yogyakarta.' },
    { fullName: 'Rina Wulandari', profilePicture: 'https://i.pravatar.cc/150?u=rina', contactNumber: '+6281678901234', bio: 'Modern living enthusiast based in BSD City.' },
    { fullName: 'Ahmad Hidayat', profilePicture: 'https://i.pravatar.cc/150?u=ahmad', contactNumber: '+6281789012345', bio: 'Property investor with a passion for hospitality in Surabaya.' },
    { fullName: 'Putri Maharani', profilePicture: 'https://i.pravatar.cc/150?u=putri', contactNumber: '+6281890123456', bio: 'Boutique hotel owner in Seminyak, Bali.' },
    { fullName: 'Rudi Hermawan', profilePicture: 'https://i.pravatar.cc/150?u=rudi', contactNumber: '+6281901234567', bio: 'Bogor resident who loves nature and mountain views.' },
    { fullName: 'Maya Kusuma', profilePicture: 'https://i.pravatar.cc/150?u=maya', contactNumber: '+6281012345678', bio: 'Semarang local with expertise in Javanese cuisine and culture.' },
    { fullName: 'Eko Prasetyo', profilePicture: 'https://i.pravatar.cc/150?u=eko', contactNumber: '+6281123456789', bio: 'Medan host specializing in Sumatran hospitality.' },
    { fullName: 'Lina Wijaya', profilePicture: 'https://i.pravatar.cc/150?u=lina', contactNumber: '+6281234567891', bio: 'Makassar entrepreneur with beautiful seaside properties.' },
    { fullName: 'Hendra Gunawan', profilePicture: 'https://i.pravatar.cc/150?u=hendra', contactNumber: '+6281345678902', bio: 'Jakarta businessman turned hospitality professional.' },
    { fullName: 'Sari Indah', profilePicture: 'https://i.pravatar.cc/150?u=sari', contactNumber: '+6281456789013', bio: 'Bandung artist with uniquely designed properties.' },
    { fullName: 'Bambang Sutrisno', profilePicture: 'https://i.pravatar.cc/150?u=bambang', contactNumber: '+6281567890124', bio: 'Yogyakarta cultural ambassador and host.' },
    { fullName: 'Dian Permata', profilePicture: 'https://i.pravatar.cc/150?u=dian', contactNumber: '+6281678901235', bio: 'Bali villa owner with focus on wellness retreats.' },
    { fullName: 'Fajar Nugroho', profilePicture: 'https://i.pravatar.cc/150?u=fajar', contactNumber: '+6281789012346', bio: 'Tangerang property manager with modern apartments.' },
    { fullName: 'Ratna Sari', profilePicture: 'https://i.pravatar.cc/150?u=ratna', contactNumber: '+6281890123457', bio: 'Surabaya host passionate about East Java culture.' },
    { fullName: 'Yoga Aditya', profilePicture: 'https://i.pravatar.cc/150?u=yoga', contactNumber: '+6281901234568', bio: 'Bogor eco-tourism advocate with sustainable properties.' },
    { fullName: 'Indah Puspita', profilePicture: 'https://i.pravatar.cc/150?u=indah', contactNumber: '+6281012345679', bio: 'Semarang heritage house owner.' },
    { fullName: 'Rizki Ramadan', profilePicture: 'https://i.pravatar.cc/150?u=rizki', contactNumber: '+6281123456780', bio: 'Medan culinary expert and host.' }
  ];

  const hosts = [];
  for (const hostData of hostsData) {
    const host = await prisma.host.create({
      data: { ...hostData, createdAt: timestamp, updatedAt: timestamp }
    });
    hosts.push(host);
  }
  
  console.log('🏠 Creating 80+ properties...\n');
  
  const cities = [
    { name: 'Jakarta', areas: ['Menteng', 'Kemang', 'Senopati', 'SCBD', 'Kuningan', 'Kelapa Gading', 'PIK', 'Pondok Indah'], count: 18 },
    { name: 'Bandung', areas: ['Dago', 'Lembang', 'Cihampelas', 'Riau', 'Setiabudi', 'Ciumbuleuit'], count: 12 },
    { name: 'Bali', areas: ['Ubud', 'Seminyak', 'Canggu', 'Sanur', 'Nusa Dua', 'Jimbaran', 'Uluwatu', 'Kuta'], count: 18 },
    { name: 'Bogor', areas: ['Puncak', 'Cisarua', 'Sentul', 'Bogor Kota'], count: 8 },
    { name: 'Yogyakarta', areas: ['Kaliurang', 'Prawirotaman', 'Malioboro', 'Sleman'], count: 10 },
    { name: 'Kabupaten Tangerang', areas: ['BSD City', 'Alam Sutera', 'Gading Serpong'], count: 8 },
    { name: 'Surabaya', areas: ['Gubeng', 'Darmo', 'Citraland'], count: 6 },
    { name: 'Semarang', areas: ['Simpang Lima', 'Candi', 'Tembalang'], count: 5 },
    { name: 'Medan', areas: ['Polonia', 'Merdeka'], count: 3 },
    { name: 'Makassar', areas: ['Losari', 'Panakkukang'], count: 3 }
  ];

  const propertyTypes = ['Villa', 'House', 'Apartment', 'Hotel', 'Condo', 'Penthouse'];
  const propertyPrefixes = ['Luxury', 'Modern', 'Cozy', 'Elegant', 'Charming', 'Spacious', 'Beautiful', 'Stunning', 'Premium', 'Deluxe'];
  
  let propertyCount = 0;
  
  for (const cityData of cities) {
    for (let i = 0; i < cityData.count; i++) {
      const area = cityData.areas[i % cityData.areas.length];
      const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const prefix = propertyPrefixes[Math.floor(Math.random() * propertyPrefixes.length)];
      const name = `${prefix} ${type} ${area}`;
      
      const basePrice = Math.round((500000 + Math.random() * 4500000) / 100000) * 100000;
      const bestDealPrice = Math.round(basePrice * 0.8);
      const peakSeasonPrice = Math.round(basePrice * 1.4);
      
      const randomHost = hosts[Math.floor(Math.random() * hosts.length)];
      const roomCount = Math.floor(Math.random() * 3) + 2;
      
      // Generate unique images for this property (6-10 images)
      const imageCount = 6 + Math.floor(Math.random() * 5); // 6 to 10 images
      const propertyImages = [];
      
      // Curated Pexels photo IDs for property exteriors (100 unique IDs)
      const propertyExteriorPhotoIds = [
        1396122, 1396132, 1396135, 1396139, 1396140, 186077, 206172, 210617, 259588, 259593,
        271624, 271639, 271743, 276724, 276736, 280222, 280229, 323705, 323780, 323782,
        338504, 338515, 358636, 358690, 414860, 439416, 463996, 534151, 534164, 545012,
        600607, 681331, 731082, 772177, 834892, 1029599, 1115804, 1370704, 1396132, 1457842,
        1475938, 1546168, 1643383, 1732414, 1838554, 1918291, 2047397, 2102587, 2119714, 2121121,
        2251247, 2360673, 2360676, 2467285, 2467287, 2467289, 2581922, 2635038, 2724748, 2747901,
        2747902, 2747903, 2883049, 2901209, 2901215, 2901216, 3097770, 3097785, 3097794, 3097797,
        3288100, 3288102, 3288104, 3288106, 3288108, 3288109, 3288110, 3288111, 3288112, 3288113,
        3288114, 3288115, 3288116, 3288117, 3288118, 3288119, 3288120, 3288121, 3288122, 3288123,
        3288124, 3288125, 3288126, 3288127, 3288128, 3288129, 3288130, 3288131, 3288132, 3288133
      ];
      
      // Curated Pexels photo IDs for interior spaces (20 per category = 200 total)
      const bedroomPhotoIds = [164595, 271624, 271639, 279746, 439227, 545012, 667838, 775219, 1454806, 1743229, 1838554, 2029667, 2082090, 2251247, 2506990, 2747901, 2883049, 3097770, 3288100, 3316924];
      const livingRoomPhotoIds = [1457842, 1648776, 1743227, 1838554, 2062426, 2082090, 2251247, 2635038, 2724748, 2747902, 2883049, 3097785, 3288102, 3316924, 3773575, 4050287, 4112236, 4352247, 4450337, 5178080];
      const kitchenPhotoIds = [1080721, 1599791, 2062426, 2062431, 2251247, 2724748, 2747903, 2901209, 3097794, 3288104, 3316924, 3826435, 4050287, 4112236, 4352247, 4450337, 5178080, 5490778, 5824901, 6527036];
      const bathroomPhotoIds = [1454806, 1743229, 2062426, 2251247, 2635038, 2747901, 2883049, 3097770, 3288106, 3316924, 3773575, 4050287, 4112236, 4352247, 4450337, 5178080, 5490778, 5824901, 6527036, 6969831];
      const diningRoomPhotoIds = [1080721, 1648776, 2062426, 2251247, 2724748, 2747902, 2883049, 3097785, 3288108, 3316924, 3773575, 4050287, 4112236, 4352247, 4450337, 5178080, 5490778, 5824901, 6527036, 6969831];
      const balconyPhotoIds = [1438832, 1648776, 2062426, 2251247, 2635038, 2747902, 2883049, 3097785, 3288109, 3316924, 3773575, 4050287, 4112236, 4352247, 4450337, 5178080, 5490778, 5824901, 6527036, 6969831];
      const poolPhotoIds = [261102, 261181, 261395, 261409, 261411, 261429, 261438, 261447, 261450, 261453, 261456, 261459, 261462, 261465, 261468, 261471, 261474, 261477, 261480, 261483];
      const gymPhotoIds = [1552242, 1552249, 1552252, 1552255, 1552258, 1552261, 1552264, 1552267, 1552270, 1552273, 1552276, 1552279, 1552282, 1552285, 1552288, 1552291, 1552294, 1552297, 1552300, 1552303];
      const gardenPhotoIds = [1105019, 1105191, 1105199, 1105205, 1105211, 1105217, 1105223, 1105229, 1105235, 1105241, 1105247, 1105253, 1105259, 1105265, 1105271, 1105277, 1105283, 1105289, 1105295, 1105301];
      const lobbyPhotoIds = [1838554, 2029667, 2062426, 2251247, 2635038, 2724748, 2747902, 2883049, 3097785, 3288110, 3316924, 3773575, 4050287, 4112236, 4352247, 4450337, 5178080, 5490778, 5824901, 6969831];
      
      // Select unique cover image for this property
      const coverPhotoId = propertyExteriorPhotoIds[propertyCount % propertyExteriorPhotoIds.length];
      const coverImage = `https://images.pexels.com/photos/${coverPhotoId}/pexels-photo-${coverPhotoId}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop`;
      propertyImages.push(coverImage);
      
      // Generate unique gallery images (rotate through interior categories)
      const interiorCategories = [
        bedroomPhotoIds,
        livingRoomPhotoIds,
        kitchenPhotoIds,
        bathroomPhotoIds,
        diningRoomPhotoIds,
        balconyPhotoIds,
        poolPhotoIds,
        gymPhotoIds,
        gardenPhotoIds,
        lobbyPhotoIds
      ];
      
      for (let imgIdx = 0; imgIdx < imageCount - 1; imgIdx++) {
        const categoryIdx = imgIdx % interiorCategories.length;
        const category = interiorCategories[categoryIdx];
        // Use property count and image index to select unique photo from category
        const photoIdx = Math.floor((propertyCount + imgIdx) / interiorCategories.length) % category.length;
        const photoId = category[photoIdx];
        
        propertyImages.push(
          `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop`
        );
      }
      
      const property = await prisma.property.create({
        data: {
          name,
          city: cityData.name,
          area,
          type,
          price: basePrice,
          bestDealPrice,
          peakSeasonPrice,
          rating: 4.0 + Math.random() * 1.0,
          imageUrl: propertyImages[0], // Use first image as cover
          isGuestFavorite: Math.random() > 0.6,
          country: 'Indonesia',
          bedrooms: roomCount,
          bathrooms: Math.max(1, roomCount - 1),
          maxGuests: roomCount * 2,
          petsAllowed: Math.random() > 0.7,
          isPublished: true,
          latitude: -6.2 + (Math.random() - 0.5) * 10,
          longitude: 106.8 + (Math.random() - 0.5) * 10,
          description: `Beautiful ${type} in ${area}, ${cityData.name}. Experience luxury and comfort.`,
          amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking', 'Pool', 'Gym'],
          propertyRules: ['No smoking', 'No pets', 'Check-in: After 2:00 PM', 'Checkout: 11:00 AM'],
          images: propertyImages,
          checkInTime: '14:00',
          checkOutTime: '12:00',
          hostId: randomHost.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        }
      });
      
      const roomTypes = [
        { name: 'Deluxe Twin Bed', type: 'Twin', priceMultiplier: 0.6, maxGuests: 2, beds: { type: 'Twin', count: 2 } },
        { name: 'Deluxe King Bed', type: 'King', priceMultiplier: 0.8, maxGuests: 2, beds: { type: 'King', count: 1 } },
        { name: 'Family Suite', type: 'Suite', priceMultiplier: 1.2, maxGuests: 4, beds: { type: 'Queen', count: 2 } },
      ];
      
      for (let j = 0; j < roomCount; j++) {
        const roomType = roomTypes[j % roomTypes.length];
        await prisma.room.create({
          data: {
            propertyId: property.id,
            name: roomType.name,
            type: roomType.type,
            pricePerNight: Math.round(property.price * roomType.priceMultiplier),
            maxGuests: roomType.maxGuests,
            beds: roomType.beds,
            amenities: ['Queen/King Bed', 'Private Bathroom', 'Room Heating', 'Free Wi-Fi'],
            available: true,
            createdAt: timestamp,
            updatedAt: timestamp,
          }
        });
      }
      
      const reviewCount = Math.floor(Math.random() * 8) + 3;
      const reviewTexts = [
        { name: 'Anna Lee', rating: 4.3, comment: 'Incredible experience!' },
        { name: 'Ryan O\'Brien', rating: 4.8, comment: 'Superb accommodation!' },
        { name: 'Emily White', rating: 4.8, comment: 'Amazing stay!' },
        { name: 'Michael Chen', rating: 4.5, comment: 'Great location.' },
        { name: 'Sarah Johnson', rating: 4.7, comment: 'Perfect getaway!' },
        { name: 'David Kim', rating: 4.6, comment: 'Lovely place.' },
      ];
      
      for (let k = 0; k < reviewCount; k++) {
        const review = reviewTexts[k % reviewTexts.length];
        await prisma.review.create({
          data: {
            propertyId: property.id,
            userName: review.name,
            userAvatar: `https://i.pravatar.cc/150?u=user${k}`,
            rating: review.rating,
            comment: review.comment,
            createdAt: timestamp,
            updatedAt: timestamp,
          }
        });
      }
      
      const pricingData = generatePricingData(property.id, property.price, bestDealPrice, peakSeasonPrice);
      await prisma.propertyPricing.createMany({ data: pricingData });
      
      propertyCount++;
      if (propertyCount % 10 === 0) {
        console.log(`✅ Created ${propertyCount} properties...`);
      }
    }
  }
  
  console.log(`\n🎉 Database seeded successfully with ${propertyCount} properties!`);
  console.log(`👥 Total hosts: ${hosts.length}`);
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
