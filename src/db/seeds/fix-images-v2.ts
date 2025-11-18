import { db } from '@/db';

async function fixImages() {
  try {
    console.log('🔧 Fixing broken image URLs (v2)...');
    
    // Array of valid, diverse property images from Unsplash
    const propertyImageSets = [
      [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=800&auto=format&fit=crop&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502672260066-6bc35f0b1525?w=800&auto=format&fit=crop&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502672260066-6bc35f0b1525?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&auto=format&fit=crop&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1502672260066-6bc35f0b1525?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80"
      ]
    ];

    // Get all properties that need fixing
    const properties = await db.property.findMany({
      select: { id: true, name: true }
    });

    console.log(`Found ${properties.length} properties to update\n`);

    // Update each property with valid image URLs using raw SQL to ensure JSON is properly updated
    let updated = 0;
    for (const property of properties) {
      const imageSet = propertyImageSets[property.id % propertyImageSets.length];
      const imageUrl = imageSet[0];

      // Use raw SQL to update JSON field properly
      await db.$executeRaw`
        UPDATE properties 
        SET 
          image_url = ${imageUrl},
          images = ${JSON.stringify(imageSet)}::jsonb
        WHERE id = ${property.id}
      `;

      updated++;
      console.log(`✓ [${updated}/${properties.length}] Updated: ${property.name}`);
    }

    console.log(`\n✅ Successfully updated all ${updated} properties with valid image URLs`);
    
    // Verify one property
    console.log('\n🔍 Verifying update...');
    const verifyProperty = await db.property.findUnique({
      where: { id: 1 },
      select: { id: true, name: true, imageUrl: true, images: true }
    });
    console.log('Property 1 verification:', {
      id: verifyProperty?.id,
      name: verifyProperty?.name,
      imageUrl: verifyProperty?.imageUrl,
      imagesCount: Array.isArray(verifyProperty?.images) ? verifyProperty.images.length : 0,
      firstImage: Array.isArray(verifyProperty?.images) ? verifyProperty.images[0] : 'N/A'
    });
    
  } catch (error) {
    console.error('❌ Failed to fix images:', error);
    throw error;
  }
}

fixImages();
