import { db } from '@/db';
import { roomAvailability } from '@/db/schema';

async function main() {
    const today = new Date();
    const currentTimestamp = new Date().toISOString();
    const roomIds = [1, 2, 3, 4, 5];
    const availabilityRecords = [];

    // Pre-select 5 random weekday unavailable dates for each room
    const unavailableDatesPerRoom = new Map<number, Set<number>>();
    
    for (const roomId of roomIds) {
        const unavailableDays = new Set<number>();
        
        // Generate 5 random weekday offsets (0-89) that are not Saturdays
        while (unavailableDays.size < 5) {
            const randomOffset = Math.floor(Math.random() * 90);
            const testDate = new Date(today);
            testDate.setDate(testDate.getDate() + randomOffset);
            
            // Skip if it's a Saturday (day 6)
            if (testDate.getDay() !== 6) {
                unavailableDays.add(randomOffset);
            }
        }
        
        unavailableDatesPerRoom.set(roomId, unavailableDays);
    }

    // Generate 90 days of availability for each room
    for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
        const currentDate = new Date(today);
        currentDate.setDate(currentDate.getDate() + dayOffset);
        
        const dateString = currentDate.toISOString().split('T')[0];
        const dayOfWeek = currentDate.getDay();
        const isSaturday = dayOfWeek === 6;

        for (const roomId of roomIds) {
            const unavailableDays = unavailableDatesPerRoom.get(roomId)!;
            const isRandomUnavailable = unavailableDays.has(dayOffset);
            
            // Mark as unavailable if:
            // 1. It's a Saturday (sold out pattern)
            // 2. It's one of the 5 random weekday unavailable dates for this room
            const isAvailable = !isSaturday && !isRandomUnavailable;

            availabilityRecords.push({
                roomId,
                date: dateString,
                isAvailable,
                createdAt: currentTimestamp,
                updatedAt: currentTimestamp,
            });
        }
    }

    await db.insert(roomAvailability).values(availabilityRecords);
    
    console.log('✅ Room availability seeder completed successfully');
    console.log(`📊 Generated ${availabilityRecords.length} availability records (5 rooms × 90 days)`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});