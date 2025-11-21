
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Data Constants ---

const hostNames = [
  'Budi Santoso', 'Siti Nurhaliza', 'Ahmad Wijaya', 'Dewi Lestari', 'Rudi Hartono',
  'Maya Sari', 'Agus Setiawan', 'Rina Kusuma', 'Hendra Gunawan', 'Lina Wahyuni',
  'Joko Widodo', 'Sri Mulyani', 'Andi Pratama', 'Ratna Sari', 'Bambang Susilo',
  'Eka Putri', 'Dedi Kurniawan', 'Wati Suryani', 'Irfan Hakim', 'Yanti Permata'
];

const hostBios = [
  "Experienced hospitality professional with over 5 years of hosting guests from around the world. I'm passionate about sharing the beauty of Indonesia and ensuring every guest feels at home. Available 24/7 to assist with any needs or recommendations.",
  "Welcome! I've been hosting since 2018 and love meeting people from different cultures. My goal is to provide exceptional service and memorable experiences. I'm always happy to share local tips and help arrange activities or transportation.",
  "Proud host dedicated to creating comfortable and welcoming spaces for travelers. With extensive knowledge of the local area, I can recommend the best restaurants, attractions, and hidden gems. Your comfort and satisfaction are my top priorities.",
  "Professional property manager with a background in tourism and hospitality. I personally oversee all my properties to ensure they meet the highest standards. Feel free to reach out anytime - I'm here to make your stay perfect.",
  "Long-time resident and passionate host committed to showcasing the best of Indonesian hospitality. I take pride in maintaining beautiful properties and providing personalized service. Let me help make your visit truly unforgettable.",
];

const phoneNumbers = [
  '+6281234567890', '+6281345678901', '+6281456789012', '+6281567890123',
  '+6281678901234', '+6281789012345', '+6281890123456', '+6281901234567',
  '+6281234098765', '+6281345109876', '+6281456210987', '+6281567321098'
];

const guestNames = [
  'Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Martinez', 'Sophie Anderson',
  'James Taylor', 'Maria Garcia', 'Robert Kim', 'Lisa Thompson', 'John Brown',
  'Anna Lee', 'Tom Wilson', 'Jessica Davis', 'Daniel Rodriguez', 'Emily White',
  'Chris Martin', 'Amanda Singh', 'Ryan O\'Brien', 'Michelle Tan', 'Kevin Nguyen'
];

const reviewComments = [
  "Amazing stay! The property exceeded our expectations in every way. The host was incredibly responsive and helpful throughout our visit. The location was perfect with easy access to everything we needed. Would definitely book again and highly recommend to anyone visiting the area.",
  "Fantastic experience from start to finish. The property was spotlessly clean and exactly as described in the photos. The amenities were top-notch and we had everything we needed for a comfortable stay. The host went above and beyond to ensure we had a great time. Thank you for the wonderful hospitality!",
  "Wonderful property in a great location. We loved the modern design and comfortable furnishings. The host provided excellent recommendations for local restaurants and attractions. Communication was smooth and check-in was a breeze. Will definitely return on our next visit!",
  "Perfect getaway! The property was beautiful, spacious, and well-maintained. We especially enjoyed the outdoor space and the peaceful surroundings. The host was very accommodating and quick to respond to any questions. Highly recommend this place for anyone looking for quality accommodation.",
  "Outstanding property with exceptional service. Everything was immaculate and the attention to detail was impressive. The location couldn't be better and we felt safe and comfortable throughout our stay. The host made us feel very welcome. Five stars all around!",
  "Incredible experience! The property had everything we needed and more. The photos don't do it justice - it's even better in person. The host was friendly, professional, and provided great local insights. We can't wait to come back!",
  "Lovely property with great amenities. The space was clean, comfortable, and perfect for our group. The host was very helpful in arranging transportation and activities. Location was convenient with lots of nearby options for dining and entertainment. Highly satisfied with our choice.",
  "Superb accommodation! The property is well-designed with quality furnishings and excellent facilities. The host was attentive without being intrusive and gave us privacy when needed. The neighborhood was safe and had a great local vibe. Would recommend to friends and family.",
  "Absolutely loved this place! It felt like a home away from home with all the comforts you could want. The host was warm and welcoming, making sure we had everything we needed. The location offered the perfect balance of accessibility and tranquility. Will book again without hesitation!",
  "Exceptional property that made our trip memorable. The cleanliness and maintenance standards were impressive. The host communicated clearly and was very accommodating with our requests. The area had plenty of attractions within easy reach. Overall a fantastic stay!",
];

const propertyImages = {
  villa: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=80"
  ],
  apartment: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&auto=format&fit=crop&q=80"
  ],
  house: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80"
  ],
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80"
  ]
};

const amenitiesByType = {
  villa: [
    "WiFi", "Air Conditioning", "Heating", "Hot Water", "Full Kitchen", 
    "Refrigerator", "Microwave", "Coffee Maker", "Dining Table", "Smart TV",
    "Netflix", "Cable TV", "Comfortable Beds", "Quality Linens", "Blackout Curtains",
    "Iron & Board", "Toiletries", "Hair Dryer", "Towels", "Bathtub",
    "Fire Extinguisher", "Smoke Detector", "First Aid Kit", "Private Pool",
    "Garden", "Balcony", "BBQ Grill", "Outdoor Seating", "Free Parking",
    "Security System", "24/7 Check-in", "Housekeeping Service"
  ],
  apartment: [
    "WiFi", "Air Conditioning", "Heating", "Hot Water", "Full Kitchen",
    "Refrigerator", "Microwave", "Coffee Maker", "Smart TV", "Netflix",
    "Comfortable Beds", "Quality Linens", "Blackout Curtains", "Iron & Board",
    "Toiletries", "Hair Dryer", "Towels", "Shower", "Fire Extinguisher",
    "Smoke Detector", "First Aid Kit", "Balcony", "Elevator", "Free Parking",
    "24/7 Check-in", "Cleaning Service"
  ],
  house: [
    "WiFi", "Air Conditioning", "Heating", "Hot Water", "Full Kitchen",
    "Refrigerator", "Microwave", "Oven", "Coffee Maker", "Dining Table",
    "Smart TV", "Netflix", "Sound System", "Comfortable Beds", "Quality Linens",
    "Blackout Curtains", "Iron & Board", "Toiletries", "Hair Dryer", "Towels",
    "Bathtub", "Fire Extinguisher", "Smoke Detector", "First Aid Kit",
    "Garden", "Patio", "BBQ Grill", "Free Parking", "Laundry", "24/7 Check-in"
  ],
  hotel: [
    "WiFi", "Air Conditioning", "Heating", "Hot Water", "Mini Fridge",
    "Coffee Maker", "Smart TV", "Cable TV", "Premium Bedding", "Quality Linens",
    "Blackout Curtains", "Iron & Board", "Toiletries", "Hair Dryer", "Towels",
    "Shower", "Fire Extinguisher", "Smoke Detector", "First Aid Kit",
    "Room Service", "Concierge", "24/7 Reception", "Daily Housekeeping",
    "Elevator", "Free Parking", "Fitness Center", "Swimming Pool"
  ]
};

const sampleProperties = [
    // Jakarta - Kemang
    {
        name: 'Modern 2BR Apartment in Kemang',
        type: 'Apartment',
        price: 850000,
        nights: 2,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        isGuestFavorite: true,
        description: 'Experience luxury living in the heart of Kemang, Jakarta\'s most vibrant neighborhood. This modern 2-bedroom apartment features floor-to-ceiling windows, contemporary furnishings, and a fully equipped kitchen. Located within walking distance to trendy cafes, restaurants, and boutiques. The building offers 24-hour security, a rooftop pool, and fitness center. Perfect for business travelers and couples seeking a sophisticated urban retreat.',
        address: 'Jl. Kemang Raya No. 45',
        city: 'Jakarta',
        area: 'Kemang',
        country: 'Indonesia',
        latitude: -6.264352,
        longitude: 106.814928,
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        petsAllowed: false,
        checkInTime: '14:00',
        checkOutTime: '12:00',
    },
    {
        name: 'Cozy Studio in Kemang Village',
        type: 'Apartment',
        price: 450000,
        nights: 2,
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
        isGuestFavorite: false,
        description: 'Charming studio apartment in the popular Kemang Village complex. This compact yet efficiently designed space features a comfortable queen bed, kitchenette, and modern bathroom. The complex offers easy access to shopping centers, international restaurants, and entertainment venues. Ideal for solo travelers or couples on a budget who want to experience Jakarta\'s expatriate lifestyle. Includes access to shared pool and garden area.',
        address: 'Kemang Village, Jl. Pangeran Antasari',
        city: 'Jakarta',
        area: 'Kemang',
        country: 'Indonesia',
        latitude: -6.265421,
        longitude: 106.813245,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        petsAllowed: false,
        checkInTime: '15:00',
        checkOutTime: '11:00',
    },
    {
        name: 'Luxurious 3BR Penthouse Kemang',
        type: 'Apartment',
        price: 1500000,
        nights: 2,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        isGuestFavorite: true,
        description: 'Spectacular penthouse offering breathtaking city views and unparalleled luxury in Kemang. This 3-bedroom residence spans 200 square meters with a private terrace, jacuzzi, and premium furnishings throughout. Features include a gourmet kitchen with top-tier appliances, spacious living areas, and three en-suite bathrooms. The building provides concierge service, private elevator access, and exclusive amenities. Perfect for families or groups seeking the ultimate Jakarta experience.',
        address: 'Jl. Kemang Selatan No. 99',
        city: 'Jakarta',
        area: 'Kemang',
        country: 'Indonesia',
        latitude: -6.266789,
        longitude: 106.815432,
        bedrooms: 3,
        bathrooms: 3,
        maxGuests: 6,
        petsAllowed: true,
        checkInTime: '14:00',
        checkOutTime: '12:00',
    },
    // Jakarta - Senopati
    {
        name: 'Stylish Loft in Senopati',
        type: 'Apartment',
        price: 750000,
        nights: 2,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        isGuestFavorite: true,
        description: 'Contemporary loft-style apartment in the heart of Senopati\'s dining district. High ceilings, exposed brick walls, and industrial-chic design create a unique living space. The open-plan layout includes a designer kitchen, comfortable living area, and mezzanine bedroom. Located steps away from Jakarta\'s best restaurants, bars, and galleries. Building amenities include rooftop lounge and co-working space. Ideal for creative professionals and food enthusiasts.',
        address: 'Jl. Senopati No. 72',
        city: 'Jakarta',
        area: 'Senopati',
        country: 'Indonesia',
        latitude: -6.234521,
        longitude: 106.809876,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        petsAllowed: false,
        checkInTime: '15:00',
        checkOutTime: '11:00',
    },
    {
        name: 'Elegant 2BR Apartment Senopati',
        type: 'Apartment',
        price: 900000,
        nights: 2,
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        isGuestFavorite: false,
        description: 'Beautifully designed 2-bedroom apartment offering modern comfort in Senopati. Features elegant interiors with quality furnishings, a fully equipped kitchen, and spacious balcony overlooking the cityscape. Walking distance to numerous restaurants, cafes, and nightlife venues. The building provides 24-hour security, gym facilities, and covered parking. Perfect for small families or business travelers seeking a central location with excellent dining options nearby.',
        address: 'Jl. Senopati Raya No. 88',
        city: 'Jakarta',
        area: 'Senopati',
        country: 'Indonesia',
        latitude: -6.235678,
        longitude: 106.808765,
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        petsAllowed: false,
        checkInTime: '14:00',
        checkOutTime: '12:00',
    },
    // Jakarta - Menteng
    {
        name: 'Colonial House in Menteng',
        type: 'House',
        price: 1200000,
        nights: 2,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        isGuestFavorite: true,
        description: 'Charming colonial-era house in prestigious Menteng neighborhood, Jakarta\'s historic garden city. This beautifully preserved property features high ceilings, wooden floors, and classic architectural details. Three spacious bedrooms, landscaped garden, and shaded terrace create a peaceful oasis in the city center. Walking distance to Taman Suropati park and traditional Indonesian restaurants. Includes housekeeping service and private parking. Ideal for families seeking authentic Jakarta heritage experience.',
        address: 'Jl. Menteng Raya No. 12',
        city: 'Jakarta',
        area: 'Menteng',
        country: 'Indonesia',
        latitude: -6.188234,
        longitude: 106.836789,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        petsAllowed: true,
        checkInTime: '14:00',
        checkOutTime: '12:00',
    },
    // Tangerang - BSD
    {
        name: 'Modern House BSD City',
        type: 'House',
        price: 1000000,
        nights: 2,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        isGuestFavorite: true,
        description: 'Beautiful modern house in BSD City, Indonesia\'s premier satellite township. This 3-bedroom property features contemporary architecture, spacious rooms, and private garden. Fully furnished with quality furniture, modern kitchen appliances, and comfortable living spaces. Located in secure gated community with easy access to shopping malls, international schools, and business parks. Includes parking for two cars. Perfect for families relocating to Jakarta area or groups wanting suburban comfort with city accessibility.',
        address: 'BSD City, Jl. Letnan Sutopo',
        city: 'Tangerang',
        area: 'BSD City',
        country: 'Indonesia',
        latitude: -6.301689,
        longitude: 106.663456,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        petsAllowed: true,
        checkInTime: '14:00',
        checkOutTime: '12:00',
    },
    {
        name: 'Luxury Villa Gading Serpong',
        type: 'Villa',
        price: 1500000,
        nights: 2,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        isGuestFavorite: true,
        description: 'Stunning luxury villa in exclusive Gading Serpong residential area. This spacious property features 4 bedrooms, private swimming pool, tropical garden, and outdoor pavilion. Interior showcases high-end furnishings, modern kitchen with premium appliances, and elegant living spaces. The villa offers complete privacy with 24-hour security. Perfect for family gatherings, corporate retreats, or special celebrations. Located near Summarecon Mall, international schools, and golf courses.',
        address: 'Gading Serpong, Jl. Boulevard Gading Serpong',
        city: 'Tangerang',
        area: 'Gading Serpong',
        country: 'Indonesia',
        latitude: -6.242567,
        longitude: 106.625789,
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        petsAllowed: true,
        checkInTime: '14:00',
        checkOutTime: '12:00',
    },
    // Bali
    {
        name: 'Tropical Villa Ubud',
        type: 'Villa',
        price: 2500000,
        nights: 2,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        isGuestFavorite: true,
        description: 'Breathtaking tropical villa surrounded by lush rice paddies in Ubud. Features open-air living spaces, infinity pool, and traditional Balinese architecture mixed with modern luxury.',
        address: 'Jl. Raya Ubud No. 88',
        city: 'Bali',
        area: 'Ubud',
        country: 'Indonesia',
        latitude: -8.5069,
        longitude: 115.2625,
        bedrooms: 3,
        bathrooms: 3,
        maxGuests: 6,
        petsAllowed: false,
        checkInTime: '14:00',
        checkOutTime: '11:00',
    },
    {
        name: 'Beachfront Villa Seminyak',
        type: 'Villa',
        price: 3500000,
        nights: 2,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        isGuestFavorite: true,
        description: 'Luxurious beachfront villa in the heart of Seminyak. Steps away from famous beach clubs and restaurants. Features private pool, rooftop terrace, and butler service.',
        address: 'Jl. Kayu Aya No. 12',
        city: 'Bali',
        area: 'Seminyak',
        country: 'Indonesia',
        latitude: -8.6895,
        longitude: 115.1543,
        bedrooms: 4,
        bathrooms: 4,
        maxGuests: 8,
        petsAllowed: false,
        checkInTime: '15:00',
        checkOutTime: '12:00',
    }
];

// --- Seeding Functions ---

// --- Seeding Functions ---

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  try {
    // 1. Clean Database
    console.log('🧹 Cleaning database...');
    await prisma.review.deleteMany();
    await prisma.propertyPricing.deleteMany();
    await prisma.propertyImage.deleteMany();
    await prisma.propertyAmenity.deleteMany();
    await prisma.property.deleteMany();
    await prisma.host.deleteMany();

    // 2. Create Hosts
    console.log('👥 Creating hosts...');
    const hosts = [];
    for (let i = 0; i < 20; i++) {
      const randomName = hostNames[i % hostNames.length];
      const randomBio = hostBios[Math.floor(Math.random() * hostBios.length)];
      const randomPhone = phoneNumbers[i % phoneNumbers.length];
      
      const host = await prisma.host.create({
        data: {
          fullName: randomName,
          profilePicture: `https://i.pravatar.cc/150?img=${i + 1}`,
          contactNumber: randomPhone,
          bio: randomBio,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      });
      hosts.push(host);
    }
    console.log(`✅ Created ${hosts.length} hosts`);

    // 3. Create Properties
    console.log('🏠 Creating properties...');
    const createdProperties = [];
    
    for (const propData of sampleProperties) {
        const randomHost = hosts[Math.floor(Math.random() * hosts.length)];
        const propertyType = propData.type.toLowerCase();
        const imagesList = propertyImages[propertyType as keyof typeof propertyImages] || propertyImages.apartment;
        const amenitiesList = amenitiesByType[propertyType as keyof typeof amenitiesByType] || amenitiesByType.apartment;
        
        const property = await prisma.property.create({
            data: {
                ...propData,
                hostId: randomHost.id,
                images: imagesList, // Store as JSON
                amenities: amenitiesList, // Store as JSON
                propertyRules: [
                    "No smoking",
                    "No parties or events",
                    "Check-in time is 2:00 PM - 10:00 PM",
                    "Check-out by 11:00 AM",
                    "No pets allowed (unless specified)",
                    "Quiet hours after 10:00 PM"
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        });
        createdProperties.push(property);

        // Create Rooms based on bedroom count
        const numBedrooms = property.bedrooms || 1;
        const roomTypes = ['Master Bedroom', 'Guest Bedroom', 'Standard Room', 'Deluxe Room'];
        const bedTypes = ['King Bed', 'Queen Bed', 'Twin Bed', 'Double Bed'];

        for (let j = 0; j < numBedrooms; j++) {
            const roomType = roomTypes[j % roomTypes.length];
            const bedType = bedTypes[j % bedTypes.length];
            
            await prisma.room.create({
                data: {
                    propertyId: property.id,
                    name: `${roomType} ${j + 1}`,
                    type: roomType,
                    pricePerNight: Math.round(property.price / numBedrooms), // Distribute price roughly
                    maxGuests: 2,
                    beds: { [bedType]: 1 }, // JSON format
                    size: 25 + (j * 5), // Randomish size
                    amenities: ["WiFi", "Air Conditioning", "Private Bathroom"],
                    available: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            });
        }
    }
    console.log(`✅ Created ${createdProperties.length} properties with rooms`);

    // 4. Create Reviews
    console.log('⭐ Creating reviews...');
    for (const property of createdProperties) {
        const numReviews = Math.floor(Math.random() * 5) + 5; // 5-10 reviews
        
        for (let i = 0; i < numReviews; i++) {
            const rating = (Math.random() * 1 + 4).toFixed(1); // 4.0 - 5.0
            const randomName = guestNames[Math.floor(Math.random() * guestNames.length)];
            const randomComment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
            
            await prisma.review.create({
                data: {
                    propertyId: property.id,
                    userName: randomName,
                    userAvatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
                    rating: parseFloat(rating),
                    comment: randomComment,
                    cleanliness: parseFloat((Math.random() * 1 + 4).toFixed(1)),
                    accuracy: parseFloat((Math.random() * 1 + 4).toFixed(1)),
                    communication: parseFloat((Math.random() * 1 + 4).toFixed(1)),
                    location: parseFloat((Math.random() * 1 + 4).toFixed(1)),
                    value: parseFloat((Math.random() * 1 + 4).toFixed(1)),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            });
        }
    }
    console.log('✅ Reviews created');

    // 5. Create Dynamic Pricing
    console.log('💰 Creating dynamic pricing...');
    const today = new Date();
    
    for (const property of createdProperties) {
        const basePrice = property.price;
        const pricingData = [];
        
        for (let i = 0; i < 90; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
            
            let status = 'available';
            let price = basePrice;
            
            const rand = Math.random();
            
            if (isWeekend) {
                if (rand < 0.4) {
                    status = 'peak_season';
                    price = Math.round(basePrice * 1.3);
                } else if (rand < 0.5) {
                    status = 'sold_out';
                }
            } else {
                if (rand < 0.3) {
                    status = 'best_deal';
                    price = Math.round(basePrice * 0.8);
                }
            }
            
            pricingData.push({
                propertyId: property.id,
                date: dateString,
                price: price,
                priceType: status, // Using priceType field to store status
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        
        await prisma.propertyPricing.createMany({ data: pricingData });
    }
    console.log('✅ Dynamic pricing created');

    console.log('🎉 Comprehensive seed completed successfully!');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
