import { db } from '@/db';
import { languages } from '@/db/schema';

async function main() {
    const sampleLanguages = [
        {
            code: 'en-US',
            name: 'English',
            region: 'United States',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'id-ID',
            name: 'Bahasa Indonesia',
            region: 'Indonesia',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'es-ES',
            name: 'Español',
            region: 'España',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'fr-FR',
            name: 'Français',
            region: 'France',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'de-DE',
            name: 'Deutsch',
            region: 'Deutschland',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'ja-JP',
            name: '日本語',
            region: '日本',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'ko-KR',
            name: '한국어',
            region: '대한민국',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'zh-CN',
            name: '简体中文',
            region: '中国',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'pt-BR',
            name: 'Português',
            region: 'Brasil',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'it-IT',
            name: 'Italiano',
            region: 'Italia',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'nl-NL',
            name: 'Nederlands',
            region: 'Nederland',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'ru-RU',
            name: 'Русский',
            region: 'Россия',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'ar-SA',
            name: 'العربية',
            region: 'السعودية',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'tr-TR',
            name: 'Türkçe',
            region: 'Türkiye',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'pl-PL',
            name: 'Polski',
            region: 'Polska',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'sv-SE',
            name: 'Svenska',
            region: 'Sverige',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'no-NO',
            name: 'Norsk',
            region: 'Norge',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'da-DK',
            name: 'Dansk',
            region: 'Danmark',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'fi-FI',
            name: 'Suomi',
            region: 'Suomi',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            code: 'cs-CZ',
            name: 'Čeština',
            region: 'Česká republika',
            isActive: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
    ];

    await db.insert(languages).values(sampleLanguages);
    
    console.log('✅ Languages seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});