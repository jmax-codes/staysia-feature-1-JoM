import { db } from '@/db';

const hostNames = [
  'Budi Santoso', 'Siti Nurhaliza', 'Ahmad Wijaya', 'Dewi Lestari', 'Rudi Hartono',
  'Maya Sari', 'Agus Setiawan', 'Rina Kusuma', 'Hendra Gunawan', 'Lina Wahyuni',
  'Joko Widodo', 'Sri Mulyani', 'Andi Pratama', 'Ratna Sari', 'Bambang Susilo',
  'Eka Putri', 'Dedi Kurniawan', 'Wati Suryani', 'Irfan Hakim', 'Yanti Permata'
];

const hostBios = [
  "Experienced hospitality professional with over 5 years of hosting guests from around the world. I'm passionate about sharing the beauty of Indonesia and ensuring every guest feels at home. Available 24/7 to assist with any needs or recommendations.",
  "Welcome! I've been hosting since 2018 and love meeting people from different cultures. My goal is to provide exceptional service and memorable experiences. I'm always happy to share local tips and help arrange activities or transportation.",
  "Proud host dedicated to creating comfortable and welcoming spaces for travelers. With extensive knowledge of the local area, I can recommend the best restaurants, attractions, and hidden gems. Your comfort and satisfaction are my top priorities.",
  "Professional property manager with a background in tourism and hospitality. I personally oversee all my properties to ensure they meet the highest standards. Feel free to reach out anytime - I'm here to make your stay perfect.",
  "Long-time resident and passionate host committed to showcasing the best of Indonesian hospitality. I take pride in maintaining beautiful properties and providing personalized service. Let me help make your visit truly unforgettable.",
];

const phoneNumbers = [
  '+6281234567890', '+6281345678901', '+6281456789012', '+6281567890123',
  '+6281678901234', '+6281789012345', '+6281890123456', '+6281901234567',
  '+6281234098765', '+6281345109876', '+6281456210987', '+6281567321098'
];

async function createHosts() {
  console.log('👥 Creating hosts for properties...');
  
  const properties = await db.property.findMany({
    select: { id: true, city: true }
  });

  // Check if hosts already exist
  const existingHosts = await db.host.findMany();
  
  if (existingHosts.length > 0) {
    console.log(`  Found ${existingHosts.length} existing hosts`);
    
    // Assign existing hosts to properties that don't have one
    let assigned = 0;
    for (const property of properties) {
      const currentProperty = await db.property.findUnique({
        where: { id: property.id },
        select: { hostId: true }
      });
      
      if (!currentProperty?.hostId) {
        const randomHost = existingHosts[Math.floor(Math.random() * existingHosts.length)];
        await db.property.update({
          where: { id: property.id },
          data: { hostId: randomHost.id }
        });
        assigned++;
      }
    }
    
    console.log(`  Assigned hosts to ${assigned} properties`);
    return;
  }

  // Create new hosts
  const timestamp = new Date().toISOString();
  const hostsToCreate = [];
  
  for (let i = 0; i < 20; i++) {
    const randomName = hostNames[i % hostNames.length];
    const randomBio = hostBios[Math.floor(Math.random() * hostBios.length)];
    const randomPhone = phoneNumbers[i % phoneNumbers.length];
    
    hostsToCreate.push({
      userId: null,
      fullName: randomName,
      profilePicture: `https://i.pravatar.cc/150?img=${i + 1}`,
      contactNumber: randomPhone,
      bio: randomBio,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  // Create hosts
  const createdHosts = [];
  for (const hostData of hostsToCreate) {
    const host = await db.host.create({ data: hostData });
    createdHosts.push(host);
  }
  
  console.log(`✅ Created ${createdHosts.length} hosts`);

  // Assign hosts to properties (2-3 properties per host)
  let propertyIndex = 0;
  for (const host of createdHosts) {
    const propertiesPerHost = Math.floor(Math.random() * 2) + 2; // 2-3 properties
    
    for (let i = 0; i < propertiesPerHost && propertyIndex < properties.length; i++) {
      await db.property.update({
        where: { id: properties[propertyIndex].id },
        data: { hostId: host.id }
      });
      propertyIndex++;
    }
  }
  
  console.log(`✅ Assigned hosts to ${propertyIndex} properties`);
}

createHosts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
