import { db } from '@/db';

const reviewComments = [
  "Amazing stay! The property exceeded our expectations in every way. The host was incredibly responsive and helpful throughout our visit. The location was perfect with easy access to everything we needed. Would definitely book again and highly recommend to anyone visiting the area.",
  "Fantastic experience from start to finish. The property was spotlessly clean and exactly as described in the photos. The amenities were top-notch and we had everything we needed for a comfortable stay. The host went above and beyond to ensure we had a great time. Thank you for the wonderful hospitality!",
  "Wonderful property in a great location. We loved the modern design and comfortable furnishings. The host provided excellent recommendations for local restaurants and attractions. Communication was smooth and check-in was a breeze. Will definitely return on our next visit!",
  "Perfect getaway! The property was beautiful, spacious, and well-maintained. We especially enjoyed the outdoor space and the peaceful surroundings. The host was very accommodating and quick to respond to any questions. Highly recommend this place for anyone looking for quality accommodation.",
  "Outstanding property with exceptional service. Everything was immaculate and the attention to detail was impressive. The location couldn't be better and we felt safe and comfortable throughout our stay. The host made us feel very welcome. Five stars all around!",
  "Incredible experience! The property had everything we needed and more. The photos don't do it justice - it's even better in person. The host was friendly, professional, and provided great local insights. We can't wait to come back!",
  "Lovely property with great amenities. The space was clean, comfortable, and perfect for our group. The host was very helpful in arranging transportation and activities. Location was convenient with lots of nearby options for dining and entertainment. Highly satisfied with our choice.",
  "Superb accommodation! The property is well-designed with quality furnishings and excellent facilities. The host was attentive without being intrusive and gave us privacy when needed. The neighborhood was safe and had a great local vibe. Would recommend to friends and family.",
  "Absolutely loved this place! It felt like a home away from home with all the comforts you could want. The host was warm and welcoming, making sure we had everything we needed. The location offered the perfect balance of accessibility and tranquility. Will book again without hesitation!",
  "Exceptional property that made our trip memorable. The cleanliness and maintenance standards were impressive. The host communicated clearly and was very accommodating with our requests. The area had plenty of attractions within easy reach. Overall a fantastic stay!",
];

const guestNames = [
  'Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Martinez', 'Sophie Anderson',
  'James Taylor', 'Maria Garcia', 'Robert Kim', 'Lisa Thompson', 'John Brown',
  'Anna Lee', 'Tom Wilson', 'Jessica Davis', 'Daniel Rodriguez', 'Emily White',
  'Chris Martin', 'Amanda Singh', 'Ryan O\'Brien', 'Michelle Tan', 'Kevin Nguyen'
];

async function seedReviews() {
  console.log('⭐ Seeding property reviews...');
  
  const properties = await db.property.findMany({
    select: { id: true }
  });

  const reviewData = [];
  
  for (const property of properties) {
    // Add 8-12 reviews per property
    const numReviews = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < numReviews; i++) {
      const rating = (Math.random() * 1 + 4).toFixed(1); // 4.0 - 5.0
      const cleanliness = (Math.random() * 1 + 4).toFixed(1);
      const accuracy = (Math.random() * 1 + 4).toFixed(1);
      const communication = (Math.random() * 1 + 4).toFixed(1);
      const location = (Math.random() * 1 + 4).toFixed(1);
      const value = (Math.random() * 1 + 4).toFixed(1);
      
      // Random date within last 6 months
      const daysAgo = Math.floor(Math.random() * 180);
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() - daysAgo);
      
      const randomName = guestNames[Math.floor(Math.random() * guestNames.length)];
      const randomComment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
      
      reviewData.push({
        propertyId: property.id,
        userId: null,
        userName: randomName,
        userAvatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
        rating: parseFloat(rating),
        comment: randomComment,
        cleanliness: parseFloat(cleanliness),
        accuracy: parseFloat(accuracy),
        communication: parseFloat(communication),
        location: parseFloat(location),
        value: parseFloat(value),
        createdAt: reviewDate.toISOString(),
        updatedAt: reviewDate.toISOString(),
      });
    }
  }

  // Batch insert in chunks to avoid timeout
  const chunkSize = 100;
  for (let i = 0; i < reviewData.length; i += chunkSize) {
    const chunk = reviewData.slice(i, i + chunkSize);
    await db.review.createMany({ data: chunk });
    console.log(`  Inserted ${Math.min(i + chunkSize, reviewData.length)}/${reviewData.length} reviews`);
  }
  
  console.log(`✅ Created ${reviewData.length} property reviews`);
}

seedReviews()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
