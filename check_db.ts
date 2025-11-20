import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking Properties...');
  const properties = await prisma.property.findMany({
    select: { id: true, name: true, city: true, hostId: true }
  });
  console.table(properties);

  console.log('\n👤 Checking Hosts...');
  const hosts = await prisma.host.findMany();
  console.table(hosts);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
