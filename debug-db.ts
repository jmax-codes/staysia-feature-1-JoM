import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  try {
    const count = await prisma.property.count();
    console.log(`Total properties in DB: ${count}`);

    const properties = await prisma.property.findMany({
      take: 5,
    });
    console.log('First 5 properties:', JSON.stringify(properties, null, 2));
  } catch (error) {
    console.error('Error connecting to DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
