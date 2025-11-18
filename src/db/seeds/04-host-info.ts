import { db } from '@/db';

const hostBios = [
  "Experienced hospitality professional with over 5 years of hosting guests from around the world. I'm passionate about sharing the beauty of Indonesia and ensuring every guest feels at home. Available 24/7 to assist with any needs or recommendations.",
  "Welcome! I've been hosting since 2018 and love meeting people from different cultures. My goal is to provide exceptional service and memorable experiences. I'm always happy to share local tips and help arrange activities or transportation.",
  "Proud host dedicated to creating comfortable and welcoming spaces for travelers. With extensive knowledge of the local area, I can recommend the best restaurants, attractions, and hidden gems. Your comfort and satisfaction are my top priorities.",
  "Professional property manager with a background in tourism and hospitality. I personally oversee all my properties to ensure they meet the highest standards. Feel free to reach out anytime - I'm here to make your stay perfect.",
  "Long-time resident and passionate host committed to showcasing the best of Indonesian hospitality. I take pride in maintaining beautiful properties and providing personalized service. Let me help make your visit truly unforgettable.",
];

const phoneNumbers = [
  '+6281234567890', '+6281345678901', '+6281456789012', '+6281567890123',
  '+6281678901234', '+6281789012345', '+6281890123456', '+6281901234567'
];

async function seedHostInfo() {
  console.log('👤 Updating host information...');
  
  const hosts = await db.host.findMany({
    select: { id: true }
  });

  let updated = 0;
  
  for (const host of hosts) {
    const randomBio = hostBios[Math.floor(Math.random() * hostBios.length)];
    const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    
    await db.host.update({
      where: { id: host.id },
      data: {
        bio: randomBio,
        contactNumber: randomPhone,
        profilePicture: `https://i.pravatar.cc/150?img=${host.id}`,
        updatedAt: new Date().toISOString(),
      }
    });
    
    updated++;
  }
  
  console.log(`✅ Updated ${updated} host profiles`);
}

seedHostInfo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
