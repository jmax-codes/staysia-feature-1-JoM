import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking Properties JSON...');
  const properties = await prisma.property.findMany({
    select: { id: true, name: true, city: true, hostId: true }
  });
  console.log(JSON.stringify(properties, null, 2));

  console.log('\n👤 Checking Hosts JSON...');
  const hosts = await prisma.host.findMany();
  console.log(JSON.stringify(hosts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
