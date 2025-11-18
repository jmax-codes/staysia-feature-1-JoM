import { db } from '@/db';
import { propertyPricing } from '@/db/schema';

async function main() {
    const basePrice = 1400000;
    const propertyId = 83;
    const totalDays = 90;
    
    // Calculate exact counts based on percentages
    const availableCount = 54; // 60%
    const bestDealCount = 18; // 20%
    const peakSeasonCount = 14; // 15%
    const soldOutCount = 4; // 5%
    
    // Create status distribution array
    const statusDistribution: string[] = [
        ...Array(availableCount).fill('available'),
        ...Array(bestDealCount).fill('best_deal'),
        ...Array(peakSeasonCount).fill('peak_season'),
        ...Array(soldOutCount).fill('sold_out'),
    ];
    
    // Generate pricing data for 90 consecutive days
    const pricingData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
        
        // Determine status with weekend bias
        let status: string;
        
        if (isWeekend) {
            // Higher chance of peak_season or sold_out on weekends
            const weekendRandom = Math.random();
            if (weekendRandom < 0.4 && peakSeasonCount > 0) {
                status = 'peak_season';
            } else if (weekendRandom < 0.5 && soldOutCount > 0) {
                status = 'sold_out';
            } else if (weekendRandom < 0.75 && availableCount > 0) {
                status = 'available';
            } else if (bestDealCount > 0) {
                status = 'best_deal';
            } else {
                status = statusDistribution.shift() || 'available';
            }
        } else {
            // Weekdays favor available and best_deal
            const weekdayRandom = Math.random();
            if (weekdayRandom < 0.5 && availableCount > 0) {
                status = 'available';
            } else if (weekdayRandom < 0.75 && bestDealCount > 0) {
                status = 'best_deal';
            } else if (weekdayRandom < 0.9 && peakSeasonCount > 0) {
                status = 'peak_season';
            } else if (soldOutCount > 0) {
                status = 'sold_out';
            } else {
                status = statusDistribution.shift() || 'available';
            }
        }
        
        // Remove used status from distribution
        const statusIndex = statusDistribution.indexOf(status);
        if (statusIndex !== -1) {
            statusDistribution.splice(statusIndex, 1);
        }
        
        // Calculate price based on status
        let price: number;
        
        switch (status) {
            case 'available':
                price = basePrice;
                break;
            case 'best_deal':
                // 20-30% discount: 980,000 - 1,120,000
                const discountPercent = 0.70 + (Math.random() * 0.10);
                price = Math.floor(basePrice * discountPercent);
                break;
            case 'peak_season':
                // 30-40% premium: 1,820,000 - 1,960,000
                const premiumPercent = 1.30 + (Math.random() * 0.10);
                price = Math.floor(basePrice * premiumPercent);
                break;
            case 'sold_out':
                price = basePrice;
                break;
            default:
                price = basePrice;
        }
        
        // Format date as YYYY-MM-DD
        const dateString = currentDate.toISOString().split('T')[0];
        
        pricingData.push({
            propertyId: propertyId,
            roomId: null,
            date: dateString,
            price: price,
            status: status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }
    
    await db.insert(propertyPricing).values(pricingData);
    
    console.log('✅ Property pricing seeder completed successfully');
    console.log(`   Generated ${pricingData.length} pricing records for property ID 83`);
    console.log(`   Date range: ${pricingData[0].date} to ${pricingData[pricingData.length - 1].date}`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});