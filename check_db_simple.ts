// Run with: npx tsx check_db_simple.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- PROPERTIES ---');
  const properties = await prisma.property.findMany({
    select: { id: true, name: true, city: true, hostId: true }
  });
  properties.forEach(p => console.log(`Prop: ${p.id} | ${p.name} | ${p.city} | Host: ${p.hostId}`));

  console.log('--- HOSTS ---');
  const hosts = await prisma.host.findMany();
  hosts.forEach(h => console.log(`Host: ${h.id} | ${h.fullName}`));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
