import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const languages = [
  { code: "en-US", name: "English", region: "United States" },
  { code: "id-ID", name: "Bahasa Indonesia", region: "Indonesia" },
  { code: "da-DK", name: "Dansk", region: "Danmark" },
  { code: "de-DE", name: "Deutsch", region: "Deutschland" },
  { code: "es-ES", name: "Español", region: "España" },
  { code: "fr-FR", name: "Français", region: "France" },
  { code: "it-IT", name: "Italiano", region: "Italia" },
  { code: "nl-NL", name: "Nederlands", region: "Nederland" },
  { code: "no-NO", name: "Norsk", region: "Norge" },
  { code: "pl-PL", name: "Polski", region: "Polska" },
  { code: "pt-BR", name: "Português", region: "Brasil" },
  { code: "fi-FI", name: "Suomi", region: "Suomi" },
  { code: "sv-SE", name: "Svenska", region: "Sverige" },
  { code: "tr-TR", name: "Türkçe", region: "Türkiye" },
  { code: "cs-CZ", name: "Čeština", region: "Česká republika" },
  { code: "ru-RU", name: "Русский", region: "Россия" },
  { code: "ar-SA", name: "العربية", region: "السعودية" },
  { code: "ja-JP", name: "日本語", region: "日本" },
  { code: "zh-CN", name: "简体中文", region: "中国" },
  { code: "ko-KR", name: "한국어", region: "대한민국" }
];

async function main() {
  console.log('Seeding languages...');
  
  const now = new Date().toISOString();
  
  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: {
        ...language,
        updatedAt: now
      },
      create: {
        ...language,
        createdAt: now,
        updatedAt: now
      }
    });
  }
  
  console.log('✅ Successfully seeded 20 languages');
}

main()
  .catch((e) => {
    console.error('Error seeding languages:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });