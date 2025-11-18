import { db } from '@/db';

async function seedPropertyPricing() {
  console.log('💰 Seeding property pricing with simplified pricing logic...');
  console.log('📝 LOGIC: Best Deal and Peak Season now use SINGLE prices from properties table');
  
  const properties = await db.property.findMany({
    select: { id: true, price: true, bestDealPrice: true, peakSeasonPrice: true }
  });

  const today = new Date();
  const pricingData = [];
  
  for (const property of properties) {
    const basePrice = property.price;
    const bestDealPrice = property.bestDealPrice || Math.round(basePrice * 0.80);
    const peakSeasonPrice = property.peakSeasonPrice || Math.round(basePrice * 1.40);
    
    // Create pricing for next 90 days
    for (let day = 0; day < 90; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Determine price type based on day and randomness
      let priceType: string;
      let price: number;
      
      const random = Math.random();
      
      // Weekend logic (Friday-Sunday more likely to be peak)
      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
        if (random < 0.5) {
          priceType = 'peak_season';
          price = peakSeasonPrice; // USE SINGLE PRICE
        } else if (random < 0.6) {
          priceType = 'sold_out';
          price = basePrice;
        } else if (random < 0.75) {
          priceType = 'base_price';
          price = basePrice;
        } else {
          priceType = 'best_deal';
          price = bestDealPrice; // USE SINGLE PRICE
        }
      } 
      // Weekday logic (more likely to have deals)
      else {
        if (random < 0.3) {
          priceType = 'best_deal';
          price = bestDealPrice; // USE SINGLE PRICE
        } else if (random < 0.5) {
          priceType = 'peak_season';
          price = peakSeasonPrice; // USE SINGLE PRICE
        } else if (random < 0.55) {
          priceType = 'sold_out';
          price = basePrice;
        } else {
          priceType = 'base_price';
          price = basePrice;
        }
      }
      
      pricingData.push({
        propertyId: property.id,
        roomId: null,
        date: dateString,
        price: price,
        priceType: priceType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  
  // Batch insert in chunks
  console.log(`  Total pricing records to insert: ${pricingData.length}`);
  const chunkSize = 500;
  for (let i = 0; i < pricingData.length; i += chunkSize) {
    const chunk = pricingData.slice(i, i + chunkSize);
    await db.propertyPricing.createMany({ data: chunk });
    console.log(`  Inserted ${Math.min(i + chunkSize, pricingData.length)}/${pricingData.length} pricing records`);
  }
  
  console.log(`✅ Created ${pricingData.length} property pricing records`);
  console.log('📝 Each property now has:');
  console.log('   - ONE bestDealPrice (applied to all best_deal dates)');
  console.log('   - ONE peakSeasonPrice (applied to all peak_season dates)');
}

seedPropertyPricing()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });