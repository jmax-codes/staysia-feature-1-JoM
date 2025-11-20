import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('👤 Checking Hosts...');
  const hosts = await prisma.host.findMany();
  console.table(hosts);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
