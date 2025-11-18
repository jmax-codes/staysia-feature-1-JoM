import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding properties...');

  const properties = [
    // Jakarta - Kemang
    { name: 'Kemang Luxury Villa', city: 'Jakarta', area: 'Kemang', type: 'Villa', price: 1500000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: true, isPublished: true },
    { name: 'Modern Kemang Apartment', city: 'Jakarta', area: 'Kemang', type: 'Apartment', price: 800000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    { name: 'Cozy Kemang House', city: 'Jakarta', area: 'Kemang', type: 'House', price: 1200000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    
    // Jakarta - Senopati
    { name: 'Senopati Boutique Hotel', city: 'Jakarta', area: 'Senopati', type: 'Hotel', price: 900000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 1, bathrooms: 1, maxGuests: 2, petsAllowed: false, isPublished: true },
    { name: 'Stylish Senopati Loft', city: 'Jakarta', area: 'Senopati', type: 'Apartment', price: 1100000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Jakarta - Menteng
    { name: 'Heritage Menteng Villa', city: 'Jakarta', area: 'Menteng', type: 'Villa', price: 1800000, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 5, bathrooms: 4, maxGuests: 10, petsAllowed: true, isPublished: true },
    { name: 'Charming Menteng Guesthouse', city: 'Jakarta', area: 'Menteng', type: 'Guesthouse', price: 600000, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 1, maxGuests: 4, petsAllowed: true, isPublished: true },
    
    // Tangerang - BSD
    { name: 'BSD Modern Residence', city: 'Tangerang', area: 'BSD', type: 'House', price: 1000000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    { name: 'BSD Family Villa', city: 'Tangerang', area: 'BSD', type: 'Villa', price: 1300000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: true, isPublished: true },
    { name: 'Comfortable BSD Apartment', city: 'Tangerang', area: 'BSD', type: 'Apartment', price: 700000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 1, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Tangerang - Gading Serpong
    { name: 'Gading Serpong Luxury Suite', city: 'Tangerang', area: 'Gading Serpong', type: 'Apartment', price: 950000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    { name: 'Serpong Garden Villa', city: 'Tangerang', area: 'Gading Serpong', type: 'Villa', price: 1400000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: true, isPublished: true },
    
    // Tangerang - Alam Sutera
    { name: 'Alam Sutera Executive House', city: 'Tangerang', area: 'Alam Sutera', type: 'House', price: 1100000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    { name: 'Sutera Park Apartment', city: 'Tangerang', area: 'Alam Sutera', type: 'Apartment', price: 850000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Bali - Seminyak
    { name: 'Seminyak Beach Villa', city: 'Bali', area: 'Seminyak', type: 'Villa', price: 2000000, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 5, bathrooms: 4, maxGuests: 10, petsAllowed: true, isPublished: true },
    { name: 'Sunset Seminyak Apartment', city: 'Bali', area: 'Seminyak', type: 'Apartment', price: 1200000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    { name: 'Boutique Seminyak Hotel', city: 'Bali', area: 'Seminyak', type: 'Hotel', price: 1500000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 1, bathrooms: 1, maxGuests: 2, petsAllowed: false, isPublished: true },
    
    // Bali - Canggu
    { name: 'Canggu Surf Villa', city: 'Bali', area: 'Canggu', type: 'Villa', price: 1600000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: true, isPublished: true },
    { name: 'Tropical Canggu House', city: 'Bali', area: 'Canggu', type: 'House', price: 1300000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    { name: 'Canggu Beach Guesthouse', city: 'Bali', area: 'Canggu', type: 'Guesthouse', price: 800000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 1, maxGuests: 4, petsAllowed: true, isPublished: true },
    
    // Bali - Ubud
    { name: 'Ubud Rice Field Villa', city: 'Bali', area: 'Ubud', type: 'Villa', price: 1700000, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: false, isPublished: true },
    { name: 'Jungle View Ubud House', city: 'Bali', area: 'Ubud', type: 'House', price: 1200000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: false, isPublished: true },
    { name: 'Peaceful Ubud Guesthouse', city: 'Bali', area: 'Ubud', type: 'Guesthouse', price: 700000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 1, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Bali - Sanur
    { name: 'Sanur Beachfront Villa', city: 'Bali', area: 'Sanur', type: 'Villa', price: 1800000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 5, bathrooms: 4, maxGuests: 10, petsAllowed: true, isPublished: true },
    { name: 'Sanur Sunrise Apartment', city: 'Bali', area: 'Sanur', type: 'Apartment', price: 1000000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Surabaya - Pakuwon City
    { name: 'Pakuwon City Luxury Apartment', city: 'Surabaya', area: 'Pakuwon City', type: 'Apartment', price: 900000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    { name: 'Modern Pakuwon House', city: 'Surabaya', area: 'Pakuwon City', type: 'House', price: 1100000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    
    // Surabaya - Citraland
    { name: 'Citraland Family Villa', city: 'Surabaya', area: 'Citraland', type: 'Villa', price: 1300000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: true, isPublished: true },
    { name: 'Citraland Executive Apartment', city: 'Surabaya', area: 'Citraland', type: 'Apartment', price: 850000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Surabaya - Galaxy Mall
    { name: 'Galaxy Mall Residence', city: 'Surabaya', area: 'Galaxy Mall', type: 'Apartment', price: 800000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 1, maxGuests: 4, petsAllowed: false, isPublished: true },
    { name: 'Galaxy Premium Hotel', city: 'Surabaya', area: 'Galaxy Mall', type: 'Hotel', price: 950000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 1, bathrooms: 1, maxGuests: 2, petsAllowed: false, isPublished: true },
    
    // Bandung - Dago
    { name: 'Dago Mountain Villa', city: 'Bandung', area: 'Dago', type: 'Villa', price: 1400000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: true, isPublished: true },
    { name: 'Cozy Dago House', city: 'Bandung', area: 'Dago', type: 'House', price: 1000000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    { name: 'Dago City Apartment', city: 'Bandung', area: 'Dago', type: 'Apartment', price: 750000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 1, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Bandung - Setiabudhi
    { name: 'Setiabudhi Highland Villa', city: 'Bandung', area: 'Setiabudhi', type: 'Villa', price: 1500000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 5, bathrooms: 4, maxGuests: 10, petsAllowed: true, isPublished: true },
    { name: 'Stylish Setiabudhi Apartment', city: 'Bandung', area: 'Setiabudhi', type: 'Apartment', price: 900000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Bandung - Pasteur
    { name: 'Pasteur Family House', city: 'Bandung', area: 'Pasteur', type: 'House', price: 1100000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    { name: 'Pasteur Business Hotel', city: 'Bandung', area: 'Pasteur', type: 'Hotel', price: 850000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 1, bathrooms: 1, maxGuests: 2, petsAllowed: false, isPublished: true },
    
    // Additional Jakarta properties
    { name: 'Sudirman Executive Suite', city: 'Jakarta', area: 'Sudirman', type: 'Apartment', price: 1200000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    { name: 'Kuningan Business Apartment', city: 'Jakarta', area: 'Kuningan', type: 'Apartment', price: 1000000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 2, bathrooms: 2, maxGuests: 4, petsAllowed: false, isPublished: true },
    { name: 'Sudirman Premier Hotel', city: 'Jakarta', area: 'Sudirman', type: 'Hotel', price: 1300000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 1, bathrooms: 1, maxGuests: 2, petsAllowed: false, isPublished: true },
    
    // Additional Tangerang properties
    { name: 'Bintaro Modern House', city: 'Tangerang', area: 'Bintaro', type: 'House', price: 1050000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    { name: 'Serpong Green Villa', city: 'Tangerang', area: 'Serpong', type: 'Villa', price: 1350000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: true, isPublished: true },
    { name: 'Bintaro Lake Apartment', city: 'Tangerang', area: 'Bintaro', type: 'Apartment', price: 800000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 1, maxGuests: 4, petsAllowed: false, isPublished: true },
    
    // Additional Bali properties
    { name: 'Kuta Beach Hotel', city: 'Bali', area: 'Kuta', type: 'Hotel', price: 1100000, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 1, bathrooms: 1, maxGuests: 2, petsAllowed: false, isPublished: true },
    { name: 'Kuta Surf House', city: 'Bali', area: 'Kuta', type: 'House', price: 1250000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    
    // Additional Surabaya properties
    { name: 'Darmo Premium Villa', city: 'Surabaya', area: 'Darmo', type: 'Villa', price: 1400000, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 4, bathrooms: 3, maxGuests: 8, petsAllowed: true, isPublished: true },
    { name: 'Rungkut Family House', city: 'Surabaya', area: 'Rungkut', type: 'House', price: 950000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 3, bathrooms: 2, maxGuests: 6, petsAllowed: true, isPublished: true },
    
    // Additional Bandung properties
    { name: 'Buah Batur Mountain Villa', city: 'Bandung', area: 'Buah Batur', type: 'Villa', price: 1600000, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800', isGuestFavorite: true, country: 'Indonesia', bedrooms: 5, bathrooms: 4, maxGuests: 10, petsAllowed: true, isPublished: true },
    { name: 'Cihampelas Shopping District Hotel', city: 'Bandung', area: 'Cihampelas', type: 'Hotel', price: 800000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 1, bathrooms: 1, maxGuests: 2, petsAllowed: false, isPublished: true },
    { name: 'Cihampelas Urban Apartment', city: 'Bandung', area: 'Cihampelas', type: 'Apartment', price: 700000, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isGuestFavorite: false, country: 'Indonesia', bedrooms: 2, bathrooms: 1, maxGuests: 4, petsAllowed: false, isPublished: true },
  ];

  const timestamp = new Date().toISOString();

  for (const property of properties) {
    await prisma.property.create({
      data: {
        ...property,
        nights: 2,
        description: `Beautiful ${property.type} in ${property.area}, ${property.city}`,
        amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking'],
        images: [property.imageUrl],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });
  }

  console.log(`Seeded ${properties.length} properties successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
