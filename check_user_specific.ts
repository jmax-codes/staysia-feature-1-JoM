import { db } from './src/db';

async function checkUser() {
  const email = 'jonathan.maxwekk315@gmail.com';
  console.log(`Checking user with email: ${email}`);

  const user = await db.user.findUnique({
    where: { email },
    include: {
      hosts: true,
      sessions: true,
    }
  });

  if (!user) {
    console.log('User not found.');
  } else {
    console.log('User found:');
    console.log(`ID: ${user.id}`);
    console.log(`Role: ${user.role}`);
    console.log(`Host Record: ${user.hosts.length > 0 ? 'Yes' : 'No'}`);
    if (user.hosts.length > 0) {
      console.log('Host Details:', user.hosts[0]);
    }
    console.log(`Active Sessions: ${user.sessions.length}`);
  }
}

checkUser().catch(console.error);
