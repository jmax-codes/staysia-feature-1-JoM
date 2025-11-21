/**
 * Database Cleanup Script
 * Delete user without account record so they can sign up again properly
 */

import { db } from './src/db';

async function cleanupUser() {
  try {
    const email = 'jonathan.maxwell315@gmail.com';
    
    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    if (!user) {
      console.log('❌ User not found - nothing to clean up');
      return;
    }

    console.log('✅ User found:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  ID:', user.id);

    // Check for account records
    const accounts = await db.account.findMany({
      where: { userId: user.id }
    });

    console.log(`\nAccount records: ${accounts.length}`);

    if (accounts.length === 0) {
      console.log('\n⚠️  User has no account records (no password)');
      console.log('Deleting user to allow fresh signup...');
      
      await db.user.delete({
        where: { email }
      });
      
      console.log('✅ User deleted successfully!');
      console.log('The user can now sign up again with a proper password.');
    } else {
      console.log('\n✅ User has account records - no cleanup needed');
      console.log('This user should be able to log in.');
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await db.$disconnect();
  }
}

cleanupUser();
