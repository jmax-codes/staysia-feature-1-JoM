import { db } from '@/db';

async function main() {
    const sampleCurrencies = [
        {
            code: 'IDR',
            name: 'Indonesian rupiah',
            symbol: 'Rp',
            rate: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'USD',
            name: 'US Dollar',
            symbol: '$',
            rate: 0.000063,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
            rate: 0.000059,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'GBP',
            name: 'Pound sterling',
            symbol: '£',
            rate: 0.000050,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'JPY',
            name: 'Japanese yen',
            symbol: '¥',
            rate: 0.0097,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'AUD',
            name: 'Australian dollar',
            symbol: 'A$',
            rate: 0.000097,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'CAD',
            name: 'Canadian dollar',
            symbol: 'C$',
            rate: 0.000088,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'CHF',
            name: 'Swiss franc',
            symbol: 'Fr',
            rate: 0.000056,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'CNY',
            name: 'Chinese yuan',
            symbol: '¥',
            rate: 0.00045,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'INR',
            name: 'Indian rupee',
            symbol: '₹',
            rate: 0.0053,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'KRW',
            name: 'South Korean won',
            symbol: '₩',
            rate: 0.088,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'SGD',
            name: 'Singapore dollar',
            symbol: 'S$',
            rate: 0.000085,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'MYR',
            name: 'Malaysian ringgit',
            symbol: 'RM',
            rate: 0.00028,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'THB',
            name: 'Thai baht',
            symbol: '฿',
            rate: 0.0022,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'PHP',
            name: 'Philippine peso',
            symbol: '₱',
            rate: 0.0037,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'BRL',
            name: 'Brazilian real',
            symbol: 'R$',
            rate: 0.00036,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'MXN',
            name: 'Mexican peso',
            symbol: '$',
            rate: 0.0013,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'ARS',
            name: 'Argentine peso',
            symbol: '$',
            rate: 0.063,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'ZAR',
            name: 'South African rand',
            symbol: 'R',
            rate: 0.0011,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'NZD',
            name: 'New Zealand dollar',
            symbol: 'NZ$',
            rate: 0.00011,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'SEK',
            name: 'Swedish krona',
            symbol: 'kr',
            rate: 0.00069,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'NOK',
            name: 'Norwegian krone',
            symbol: 'kr',
            rate: 0.00070,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'DKK',
            name: 'Danish krone',
            symbol: 'kr',
            rate: 0.00088,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'PLN',
            name: 'Polish zloty',
            symbol: 'zł',
            rate: 0.00026,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            code: 'CZK',
            name: 'Czech koruna',
            symbol: 'Kč',
            rate: 0.0015,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    console.log('🌍 Seeding currencies...');
    
    // Delete all existing currencies first
    await db.currency.deleteMany({});
    
    // Insert new currencies
    await db.currency.createMany({
        data: sampleCurrencies,
    });
    
    console.log(`✅ Successfully seeded ${sampleCurrencies.length} currencies`);
}

main()
    .catch((error) => {
        console.error('❌ Seeder failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });