import { db } from '@/db';
import { propertyPricing } from '@/db/schema';

async function main() {
    const today = new Date();
    const pricingData = [];
    
    for (let i = 0; i < 60; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        const dateString = currentDate.toISOString().split('T')[0];
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
        
        let status: string;
        let price: number;
        
        const rand = Math.random() * 100;
        
        if (isWeekend) {
            if (rand < 45) {
                status = 'peak_season';
                price = Math.floor(5500000 + Math.random() * 800000);
            } else if (rand < 70) {
                status = 'available';
                price = 4200000;
            } else if (rand < 85) {
                status = 'sold_out';
                price = 4200000;
            } else {
                status = 'best_deal';
                price = Math.floor(3500000 + Math.random() * 200000);
            }
        } else {
            if (rand < 50) {
                status = 'available';
                price = 4200000;
            } else if (rand < 75) {
                status = 'best_deal';
                price = Math.floor(3500000 + Math.random() * 200000);
            } else if (rand < 88) {
                status = 'peak_season';
                price = Math.floor(5500000 + Math.random() * 800000);
            } else {
                status = 'sold_out';
                price = 4200000;
            }
        }
        
        pricingData.push({
            propertyId: 98,
            roomId: null,
            date: dateString,
            price: price,
            status: status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }
    
    await db.insert(propertyPricing).values(pricingData);
    
    console.log('✅ Property pricing seeder completed successfully for property_id 98');
    console.log(`📊 Generated ${pricingData.length} pricing records for the next 60 days`);
    
    const statusCounts = pricingData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    console.log('📈 Status distribution:', statusCounts);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});