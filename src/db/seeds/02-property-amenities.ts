import { db } from '@/db';

const amenitiesByType = {
  basics: ['WiFi', 'Air Conditioning', 'Heating', 'Hot Water', 'Kitchen', 'Refrigerator', 'Microwave', 'Coffee Maker'],
  features: ['Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Terrace', 'Workspace', 'BBQ Grill', 'Outdoor Dining'],
  safety: ['Security Guard', 'CCTV', 'Fire Extinguisher', 'First Aid Kit', 'Smoke Alarm', 'Carbon Monoxide Alarm'],
  entertainment: ['Smart TV', 'Netflix', 'Sound System', 'Game Console', 'Pool Table', 'Books & Magazines']
};

async function seedPropertyAmenities() {
  console.log('🏠 Seeding property amenities...');
  
  const properties = await db.property.findMany({
    select: { id: true }
  });

  const amenityData = [];
  
  for (const property of properties) {
    // Add 20-25 random amenities per property
    const numAmenities = Math.floor(Math.random() * 6) + 20;
    const selectedAmenities = new Set<string>();
    
    while (selectedAmenities.size < numAmenities) {
      const types = Object.keys(amenitiesByType);
      const randomType = types[Math.floor(Math.random() * types.length)] as keyof typeof amenitiesByType;
      const amenitiesOfType = amenitiesByType[randomType];
      const randomAmenity = amenitiesOfType[Math.floor(Math.random() * amenitiesOfType.length)];
      
      if (!selectedAmenities.has(randomAmenity)) {
        selectedAmenities.add(randomAmenity);
        amenityData.push({
          propertyId: property.id,
          amenityName: randomAmenity,
          amenityType: randomType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  await db.propertyAmenity.createMany({ data: amenityData });
  
  console.log(`✅ Created ${amenityData.length} property amenities`);
}

seedPropertyAmenities()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
