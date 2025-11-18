import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Language {
  code: string;
  name: string;
  region: string;
}

export interface Region {
  code: string;
  name: string;
  continent: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

interface GlobalState {
  language: Language;
  region: Region;
  currency: Currency;
  selectedLocation: string | null;
  setLanguage: (language: Language) => void;
  setRegion: (region: Region) => void;
  setCurrency: (currency: Currency) => void;
  setSelectedLocation: (location: string | null) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      language: {
        code: 'en',
        name: 'English',
        region: 'United States',
      },
      region: {
        code: 'US',
        name: 'United States',
        continent: 'North America',
      },
      currency: {
        code: 'IDR',
        name: 'Indonesian rupiah',
        symbol: 'Rp',
        rate: 1,
      },
      selectedLocation: null,
      setLanguage: (language) => set({ language }),
      setRegion: (region) => set({ region }),
      setCurrency: (currency) => set({ currency }),
      setSelectedLocation: (location) => set({ selectedLocation: location }),
    }),
    {
      name: 'staysia-global-settings',
    }
  )
);
