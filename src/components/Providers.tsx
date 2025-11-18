"use client";

import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TranslationProvider } from "@/contexts/TranslationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
    </TranslationProvider>
  );
}