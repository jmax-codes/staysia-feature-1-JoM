import { db } from '@/db';
import { reviews } from '@/db/schema';

async function main() {
    const reviewerNames = [
        'John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson', 'David Lee',
        'Jennifer Garcia', 'Robert Martinez', 'Jessica Rodriguez', 'William Anderson',
        'Lisa Thompson', 'James White', 'Mary Harris', 'Christopher Martin', 'Patricia Clark',
        'Kenji Tanaka', 'Li Wei', 'Kim Min-joo', 'Priya Sharma', 'Yuki Sato',
        'Chen Wang', 'Park Ji-won', 'Ravi Kumar', 'Mei Lin', 'Hiroshi Yamamoto',
        'Marco Rossi', 'Sophie Dubois', 'Hans Mueller', 'Isabella Ferrari', 'Pierre Laurent',
        'Emma Schmidt', 'Luca Romano', 'Marie Petit', 'Klaus Weber', 'Giulia Conti',
        'Ahmed Hassan', 'Fatima Ali', 'Omar Ibrahim', 'Layla Mohammed', 'Khalid Rahman',
        'Amina Youssef', 'Carlos Silva', 'Ana Santos', 'Miguel Fernandez', 'Laura Gonzalez'
    ];

    const avatarUrls = [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
        'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150',
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
        'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150',
        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    ];

    const reviewComments = [
        'The place is very nice and clean. Highly recommend!',
        'I love the view from the balcony. Woke up to beautiful sunrises every morning.',
        'Great location near the beach. Perfect for families with kids.',
        'The host was very accommodating and responsive to all our questions.',
        'Amazing sunset views from the terrace. The pool was spotless.',
        'Perfect spot for a weekend getaway. Everything was as described.',
        'Spacious rooms and comfortable beds. We slept so well here.',
        'The kitchen was well-equipped. Made cooking easy and enjoyable.',
        'Walking distance to restaurants and shops. Very convenient location.',
        'Clean property with modern amenities. Would definitely stay again.',
        'Beautiful decor and thoughtful touches throughout the property.',
        'Quiet neighborhood but close to everything. Best of both worlds.',
        'The photos don\'t do it justice - even better in person!',
        'Great value for money. Exceeded our expectations in every way.',
        'Host provided excellent local recommendations for dining and activities.',
        'Loved the outdoor space. Perfect for morning coffee and evening relaxation.',
        'Everything was spotless and well-maintained. Attention to detail is impressive.',
        'Comfortable and cozy atmosphere. Felt like a home away from home.',
        'The location is unbeatable. Easy access to all major attractions.',
        'Wonderful experience from check-in to check-out. Seamless process.',
        'Amazing place with stunning views. Perfect for a romantic getaway.',
        'The property exceeded all expectations. Will definitely return.',
        'Super clean and well-organized. Everything we needed was provided.',
        'Great communication with the host. Very helpful and friendly.',
        'The neighborhood is safe and peaceful. Great for relaxing vacation.',
        'Fantastic amenities and comfortable furnishings throughout.',
        'Perfect for our family vacation. Kids loved the pool area.',
        'Beautifully decorated with attention to every detail.',
        'The beds were incredibly comfortable. Best sleep we\'ve had on vacation.',
        'Excellent location for exploring the area. Centrally located.'
    ];

    const sampleReviews = [];
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    for (let propertyId = 1; propertyId <= 30; propertyId++) {
        const numReviews = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < numReviews; i++) {
            const randomName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
            const hasAvatar = Math.random() > 0.3;
            const randomAvatar = hasAvatar ? avatarUrls[Math.floor(Math.random() * avatarUrls.length)] : null;
            
            const reviewDate = new Date(
                sixMonthsAgo.getTime() + Math.random() * (today.getTime() - sixMonthsAgo.getTime())
            );
            
            if (Math.random() > 0.5) {
                const recentDate = new Date(today);
                recentDate.setDate(recentDate.getDate() - Math.floor(Math.random() * 60));
                reviewDate.setTime(recentDate.getTime());
            }

            const rating = Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
            const cleanliness = Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
            const accuracy = Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
            const communication = Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
            const location = Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
            const value = Math.round((4.0 + Math.random() * 1.0) * 10) / 10;

            const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

            sampleReviews.push({
                propertyId: propertyId,
                carId: null,
                userId: null,
                userName: randomName,
                userAvatar: randomAvatar,
                rating: rating,
                comment: comment,
                cleanliness: cleanliness,
                accuracy: accuracy,
                communication: communication,
                location: location,
                value: value,
                createdAt: reviewDate.toISOString(),
                updatedAt: reviewDate.toISOString(),
            });
        }
    }

    await db.insert(reviews).values(sampleReviews);
    
    console.log(`✅ Reviews seeder completed successfully. Generated ${sampleReviews.length} reviews for 30 properties.`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});