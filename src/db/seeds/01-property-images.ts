import { db } from '@/db';

async function seedPropertyImages() {
  console.log('🖼️  Seeding property images...');
  
  const properties = await db.property.findMany({
    select: { id: true }
  });

  const imageData = [];
  
  for (const property of properties) {
    // 6 images per property
    for (let i = 1; i <= 6; i++) {
      const imageId = 1560184697 + (property.id * 10 + i);
      imageData.push({
        propertyId: property.id,
        imageUrl: `https://images.unsplash.com/photo-${imageId}?w=800&q=80`,
        displayOrder: i,
        isCover: i === 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  await db.propertyImage.createMany({ data: imageData });
  
  console.log(`✅ Created ${imageData.length} property images`);
}

seedPropertyImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });