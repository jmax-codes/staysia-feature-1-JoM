import { NextResponse } from 'next/server';
import { db } from '@/db';

const propertyImages = {
  villa: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde"
  ],
  apartment: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    "https://images.unsplash.com/photo-1556912173-46c336c7fd55",
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d",
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf"
  ],
  house: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126",
    "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    "https://images.unsplash.com/photo-1575517111478-7f6afd0973db",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
  ],
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
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
    "Toiletories", "Hair Dryer", "Towels", "Shower", "Fire Extinguisher",
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

export async function POST() {
  try {
    console.log("🚀 Starting property enhancement...");

    // Get all properties
    const properties = await db.property.findMany();
    console.log(`📊 Found ${properties.length} properties to enhance`);

    let updated = 0;

    for (const property of properties) {
      const propertyType = property.type.toLowerCase();
      const images = propertyImages[propertyType as keyof typeof propertyImages] || propertyImages.apartment;
      const amenities = amenitiesByType[propertyType as keyof typeof amenitiesByType] || amenitiesByType.apartment;

      // Generate description based on property type and location
      const descriptions = {
        villa: `Experience ultimate luxury in this stunning ${property.name} located in the heart of ${property.area}, ${property.city}. This exquisite villa features spacious living areas, modern amenities, and a private pool perfect for relaxation. Whether you're planning a family getaway or a romantic retreat, this property offers the perfect blend of comfort and elegance. Enjoy easy access to local attractions, fine dining, and shopping while staying in one of ${property.city}'s most sought-after neighborhoods.`,
        apartment: `Welcome to ${property.name}, a beautifully appointed apartment in ${property.area}, ${property.city}. This modern living space combines contemporary design with practical amenities to ensure a comfortable stay. Perfect for business travelers, couples, or small families, the apartment offers everything you need for a memorable visit. Located in a vibrant neighborhood with excellent connectivity, you'll have easy access to the city's best restaurants, entertainment venues, and cultural attractions.`,
        house: `Discover the charm of ${property.name}, a spacious house nestled in the peaceful ${property.area} neighborhood of ${property.city}. This comfortable home features ample living space, a well-equipped kitchen, and cozy bedrooms perfect for families or groups. Enjoy the privacy and convenience of a full house while being close to all the amenities ${property.city} has to offer. The property provides a relaxing retreat after a day of exploring local attractions, with plenty of space for everyone to unwind.`,
        hotel: `Stay at ${property.name}, a premier hotel accommodation in ${property.area}, ${property.city}. Our professional hospitality ensures a seamless experience with modern comforts and convenient services. Ideal for both business and leisure travelers, the hotel offers well-appointed rooms, excellent amenities, and a prime location. Experience the best of ${property.city} with easy access to major landmarks, business districts, and entertainment hubs while enjoying the comfort of hotel-style services.`
      };

      const description = descriptions[propertyType as keyof typeof descriptions] || descriptions.apartment;

      // Update property with enhanced data
      await db.property.update({
        where: { id: property.id },
        data: {
          images: images,
          amenities: amenities,
          description: description
        }
      });

      updated++;
      console.log(`✅ Enhanced property ${property.id}: ${property.name}`);
    }

    // Now create dynamic pricing
    console.log("\n💰 Creating dynamic pricing data...");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let pricingCreated = 0;

    for (const property of properties) {
      // Calculate base price per night
      const basePricePerNight = Math.round(property.price / property.nights);

      // Delete existing pricing data for this property
      await db.propertyPricing.deleteMany({
        where: { propertyId: property.id }
      });

      const pricingData = [];

      for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        // Determine price type and price
        let priceType: string;
        let price: number;
        
        const dayOfWeek = date.getDay();
        const random = Math.random();

        // 15% sold out (randomly distributed)
        if (random < 0.15) {
          priceType = 'sold_out';
          price = 0;
        }
        // 25% peak season (weekends + some random days)
        else if (dayOfWeek === 5 || dayOfWeek === 6 || (random >= 0.15 && random < 0.40)) {
          priceType = 'peak_season';
          price = Math.round(basePricePerNight * (1.3 + Math.random() * 0.2)); // 30-50% increase
        }
        // 20% best deal (randomly distributed weekdays)
        else if (random >= 0.40 && random < 0.60) {
          priceType = 'best_deal';
          price = Math.round(basePricePerNight * (0.7 + Math.random() * 0.1)); // 20-30% discount
        }
        // 40% base price
        else {
          priceType = 'base_price';
          price = basePricePerNight;
        }

        pricingData.push({
          propertyId: property.id,
          date: dateString,
          price: price,
          priceType: priceType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Insert all pricing data at once
      await db.propertyPricing.createMany({
        data: pricingData
      });

      pricingCreated += pricingData.length;
      console.log(`✅ Created ${pricingData.length} pricing entries for property ${property.id}`);
    }

    console.log("\n🎉 Enhancement complete!");

    return NextResponse.json({
      success: true,
      message: "Properties enhanced successfully",
      stats: {
        propertiesUpdated: updated,
        pricingEntriesCreated: pricingCreated
      }
    });
  } catch (error) {
    console.error("❌ Error enhancing properties:", error);
    return NextResponse.json(
      { error: "Failed to enhance properties: " + (error as Error).message },
      { status: 500 }
    );
  }
}
