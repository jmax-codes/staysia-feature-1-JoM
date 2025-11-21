/**
 * Database Query Script
 * Check user record and password hash for jonathan.maxwell315@gmail.com
 */

import { db } from './src/db';

async function checkUser() {
  try {
    const user = await db.user.findUnique({
      where: {
        email: 'jonathan.maxwell315@gmail.com'
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ User found:');
    console.log(JSON.stringify(user, null, 2));

    // Check for account table (better-auth stores passwords here)
    const accounts = await db.account.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        accountId: true,
        providerId: true,
        userId: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (accounts.length > 0) {
      console.log(`\n✅ Found ${accounts.length} account record(s):`);
      accounts.forEach((account, index) => {
        console.log(`\nAccount ${index + 1}:`);
        console.log('  Account ID:', account.accountId);
        console.log('  Provider ID:', account.providerId);
        console.log('  Has password:', !!account.password);
        if (account.password) {
          console.log('  Password hash (first 50 chars):', account.password.substring(0, 50));
        }
      });
    } else {
      console.log('\n❌ No account records found for this user');
      console.log('   This means the user was created but no password was set!');
    }

  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await db.$disconnect();
  }
}

checkUser();
