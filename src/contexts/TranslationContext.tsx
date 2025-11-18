"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/store/useGlobalStore";
import "@/lib/i18n/config";

interface TranslationContextType {
  t: (key: string, options?: any) => string;
  language: string;
  changeLanguage: (lng: string) => void;
  isReady: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { language } = useGlobalStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Preload translations and mark as ready
    const preloadTranslations = async () => {
      if (language.code && i18n.language !== language.code) {
        await i18n.changeLanguage(language.code);
      }
      // Small delay to ensure all translations are loaded
      setTimeout(() => setIsReady(true), 100);
    };

    preloadTranslations();
  }, [language.code, i18n]);

  const changeLanguage = async (lng: string) => {
    setIsReady(false);
    await i18n.changeLanguage(lng);
    setTimeout(() => setIsReady(true), 100);
  };

  return (
    <TranslationContext.Provider value={{ t, language: i18n.language, changeLanguage, isReady }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslationContext must be used within a TranslationProvider");
  }
  return context;
}