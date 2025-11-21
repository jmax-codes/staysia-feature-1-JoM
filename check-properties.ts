import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProperties() {
  console.log('Checking properties...\n');
  
  const allProperties = await prisma.property.findMany({
    select: {
      id: true,
      name: true,
      isPublished: true,
    },
    take: 10
  });
  
  console.log(`Total properties (first 10):`, allProperties.length);
  allProperties.forEach(prop => {
    console.log(`- ${prop.name} (ID: ${prop.id}): isPublished = ${prop.isPublished}`);
  });
  
  const publishedCount = await prisma.property.count({
    where: { isPublished: true }
  });
  
  const unpublishedCount = await prisma.property.count({
    where: { isPublished: false }
  });
  
  console.log(`\nPublished properties: ${publishedCount}`);
  console.log(`Unpublished properties: ${unpublishedCount}`);
}

checkProperties()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
