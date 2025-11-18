import { db } from '@/db';

async function seedRoomPricing() {
  console.log('🛏️  Seeding room-level pricing...');
  
  const rooms = await db.room.findMany({
    select: { id: true, pricePerNight: true }
  });

  if (rooms.length === 0) {
    console.log('⚠️  No rooms found, skipping room pricing');
    return;
  }

  const today = new Date();
  const pricingData = [];
  
  for (const room of rooms) {
    const basePrice = room.pricePerNight;
    
    // Create pricing for next 90 days
    for (let day = 0; day < 90; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      let priceType: string;
      let price: number;
      
      const random = Math.random();
      
      // Weekend pricing
      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
        if (random < 0.5) {
          priceType = 'peak_season';
          price = Math.round(basePrice * 1.4);
        } else if (random < 0.6) {
          priceType = 'sold_out';
          price = basePrice;
        } else if (random < 0.75) {
          priceType = 'base_price';
          price = basePrice;
        } else {
          priceType = 'best_deal';
          price = Math.round(basePrice * 0.75);
        }
      } 
      // Weekday pricing
      else {
        if (random < 0.3) {
          priceType = 'best_deal';
          price = Math.round(basePrice * 0.75);
        } else if (random < 0.5) {
          priceType = 'peak_season';
          price = Math.round(basePrice * 1.4);
        } else if (random < 0.55) {
          priceType = 'sold_out';
          price = basePrice;
        } else {
          priceType = 'base_price';
          price = basePrice;
        }
      }
      
      pricingData.push({
        propertyId: null,
        roomId: room.id,
        date: dateString,
        price: price,
        priceType: priceType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  
  // Batch insert in chunks
  console.log(`  Total room pricing records to insert: ${pricingData.length}`);
  const chunkSize = 500;
  for (let i = 0; i < pricingData.length; i += chunkSize) {
    const chunk = pricingData.slice(i, i + chunkSize);
    await db.propertyPricing.createMany({ data: chunk });
    console.log(`  Inserted ${Math.min(i + chunkSize, pricingData.length)}/${pricingData.length} room pricing records`);
  }
  
  console.log(`✅ Created ${pricingData.length} room pricing records`);
}

seedRoomPricing()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
