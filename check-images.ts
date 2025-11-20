// Run with: npx tsx check-images.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImages() {
  const props = await prisma.property.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      imageUrl: true,
      images: true,
    },
  });

  console.log('=== Database Image Check ===\n');
  props.forEach((prop, index) => {
    console.log(`Property ${index + 1}: ${prop.name}`);
    console.log(`  ID: ${prop.id}`);
    console.log(`  imageUrl: ${prop.imageUrl}`);
    console.log(`  images count: ${prop.images.length}`);
    console.log(`  images: ${JSON.stringify(prop.images, null, 2)}`);
    console.log('---\n');
  });

  await prisma.$disconnect();
}

checkImages().catch(console.error);
