import { db } from '@/db';
import { propertyPricing } from '@/db/schema';

async function main() {
    const propertyBasePrices = {
        78: 4500000, 79: 1200000, 80: 3200000, 81: 950000, 82: 1800000,
        84: 850000, 85: 1100000, 86: 2800000, 87: 750000, 88: 2200000,
        89: 680000, 90: 580000, 91: 1350000, 92: 920000, 93: 5500000,
        94: 3800000, 95: 2400000, 96: 1100000, 97: 1400000, 99: 1650000,
        100: 1550000, 101: 2200000, 102: 780000, 103: 950000, 104: 1450000,
        105: 1800000, 106: 650000, 107: 580000
    };

    const propertyIds = Object.keys(propertyBasePrices).map(Number);
    const currentTimestamp = new Date().toISOString();
    const startDate = new Date();
    
    const allPricingData = [];

    for (const propertyId of propertyIds) {
        const basePrice = propertyBasePrices[propertyId];
        
        // Create status distribution for 90 days
        const statusDays = [
            ...Array(54).fill('available'),
            ...Array(18).fill('best_deal'),
            ...Array(14).fill('peak_season'),
            ...Array(4).fill('sold_out')
        ];

        // Shuffle the status days
        for (let i = statusDays.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [statusDays[i], statusDays[j]] = [statusDays[j], statusDays[i]];
        }

        // Generate 90 consecutive days with weekend bias
        for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + dayOffset);
            
            const dayOfWeek = currentDate.getDay();
            const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0; // Friday, Saturday, Sunday
            
            let status = statusDays[dayOffset];
            let price = basePrice;

            // Apply weekend bias - override some statuses
            if (isWeekend) {
                const weekendRandom = Math.random();
                if (weekendRandom < 0.4 && status === 'available') {
                    status = 'peak_season';
                } else if (weekendRandom >= 0.4 && weekendRandom < 0.5 && status === 'available') {
                    status = 'sold_out';
                }
            } else {
                // Weekday bias - higher chance for available/best_deal
                const weekdayRandom = Math.random();
                if (weekdayRandom < 0.3 && (status === 'peak_season' || status === 'sold_out')) {
                    status = 'available';
                } else if (weekdayRandom >= 0.3 && weekdayRandom < 0.5 && status === 'peak_season') {
                    status = 'best_deal';
                }
            }

            // Calculate price based on status
            switch (status) {
                case 'best_deal':
                    const discountFactor = 0.65 + Math.random() * 0.15; // 0.65 to 0.80
                    price = Math.round(basePrice * discountFactor);
                    break;
                case 'peak_season':
                    const premiumFactor = 1.25 + Math.random() * 0.25; // 1.25 to 1.50
                    price = Math.round(basePrice * premiumFactor);
                    break;
                case 'sold_out':
                case 'available':
                default:
                    price = basePrice;
                    break;
            }

            const dateString = currentDate.toISOString().split('T')[0];

            allPricingData.push({
                propertyId: propertyId,
                roomId: null,
                date: dateString,
                price: price,
                status: status,
                createdAt: currentTimestamp,
                updatedAt: currentTimestamp,
            });
        }
    }

    // Insert all pricing data in one batch
    await db.insert(propertyPricing).values(allPricingData);
    
    console.log(`✅ Property pricing seeder completed successfully - Generated ${allPricingData.length} pricing records for ${propertyIds.length} properties over 90 days`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});