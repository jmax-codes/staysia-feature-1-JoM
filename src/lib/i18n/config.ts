import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// Dynamically load translation files based on language code
const loadResources = (language: string, namespace: string) => {
  return import(`./locales/${language}.json`);
};

// Get initial language from localStorage (persisted by zustand)
const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en-US';
  
  try {
    const stored = localStorage.getItem('staysia-global-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.language?.code || 'en-US';
    }
  } catch (error) {
    console.error('Error reading stored language:', error);
  }
  return 'en-US';
};

// Only initialize if we're on the client side
if (typeof window !== 'undefined') {
  const initialLanguage = getInitialLanguage();
  
  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(loadResources)
    )
    .init({
      lng: initialLanguage,
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;