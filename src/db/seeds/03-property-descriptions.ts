import { db } from '@/db';

const descriptions = [
  "Experience luxury living in this beautifully designed property featuring modern amenities and stunning views. The spacious interiors are complemented by high-end finishes and thoughtful details throughout. Located in a prime area with easy access to shopping, dining, and entertainment. Perfect for families or groups seeking comfort and convenience. Our dedicated team ensures your stay is memorable and hassle-free.",
  "Discover your perfect getaway in this charming property nestled in a vibrant neighborhood. The open-concept layout creates a warm and inviting atmosphere, ideal for relaxation and entertainment. Enjoy nearby attractions including beaches, restaurants, and cultural landmarks. Modern amenities combined with local charm make this an exceptional choice. We take pride in providing exceptional hospitality and attention to detail.",
  "Immerse yourself in comfort at this stunning property featuring contemporary design and premium furnishings. Floor-to-ceiling windows flood the space with natural light while offering breathtaking views. The fully equipped kitchen and spacious living areas make it perfect for extended stays. Located minutes from major attractions and transportation hubs. Your satisfaction is our top priority, and we're here to ensure an unforgettable experience.",
  "Welcome to this exquisite property where elegance meets functionality. Thoughtfully designed spaces provide the perfect balance of privacy and communal areas. The property features top-of-the-line appliances, comfortable bedding, and high-speed internet. Situated in a safe and accessible location with plenty of local amenities nearby. We're committed to making your stay as comfortable and enjoyable as possible.",
  "Retreat to this exceptional property offering a blend of modern luxury and traditional charm. The spacious layout includes multiple living areas, perfect for both relaxation and productivity. Premium amenities ensure all your needs are met, from cooking to entertainment. The surrounding area offers a rich cultural experience with authentic local cuisine and attractions. Our experienced team is always available to assist with recommendations and arrangements.",
];

async function seedPropertyDescriptions() {
  console.log('📝 Updating property descriptions...');
  
  const properties = await db.property.findMany({
    select: { id: true, city: true, area: true, type: true }
  });

  let updated = 0;
  
  for (const property of properties) {
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    const locationSpecific = `Located in the heart of ${property.area}, ${property.city}, this ${property.type.toLowerCase()} offers an unparalleled experience. `;
    
    await db.property.update({
      where: { id: property.id },
      data: {
        description: locationSpecific + randomDesc,
        updatedAt: new Date().toISOString(),
      }
    });
    
    updated++;
  }
  
  console.log(`✅ Updated ${updated} property descriptions`);
}

seedPropertyDescriptions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
