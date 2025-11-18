import { db } from '@/db';

/**
 * Update all properties to have single bestDealPrice and peakSeasonPrice
 * LOGIC:
 * - bestDealPrice: 20% lower than base price (must be < base price)
 * - peakSeasonPrice: 40% higher than base price (must be > base price)
 */
async function updatePropertyPricing() {
  console.log('🔄 Updating properties with single Best Deal and Peak Season prices...');
  
  const properties = await db.property.findMany({
    select: { id: true, price: true }
  });

  console.log(`Found ${properties.length} properties to update`);

  for (const property of properties) {
    const basePrice = property.price;
    
    // Calculate single prices
    const bestDealPrice = Math.round(basePrice * 0.80); // 20% discount (must be < base)
    const peakSeasonPrice = Math.round(basePrice * 1.40); // 40% increase (must be > base)
    
    // Validate logic
    if (bestDealPrice >= basePrice) {
      console.error(`❌ Property ${property.id}: bestDealPrice (${bestDealPrice}) must be < basePrice (${basePrice})`);
      continue;
    }
    
    if (peakSeasonPrice <= basePrice) {
      console.error(`❌ Property ${property.id}: peakSeasonPrice (${peakSeasonPrice}) must be > basePrice (${basePrice})`);
      continue;
    }

    await db.property.update({
      where: { id: property.id },
      data: {
        bestDealPrice,
        peakSeasonPrice,
        updatedAt: new Date().toISOString()
      }
    });

    console.log(`  ✅ Property ${property.id}: base=${basePrice}, bestDeal=${bestDealPrice}, peak=${peakSeasonPrice}`);
  }

  console.log('\n✅ Property pricing update completed!');
  console.log('📝 Summary:');
  console.log('   - Best Deal Price: 20% lower than base price (single price for ALL best_deal dates)');
  console.log('   - Peak Season Price: 40% higher than base price (single price for ALL peak_season dates)');
}

updatePropertyPricing()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
