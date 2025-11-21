"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";

interface CurrencyContextType {
  selectedCurrency: string;
  exchangeRate: number;
  setSelectedCurrency: (currency: string) => void;
  isLoadingRate: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { currency, setCurrency } = useGlobalStore();
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  // Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currency.code === 'IDR') {
        // Base currency, no need to fetch
        setCurrency({
          ...currency,
          rate: 1
        });
        return;
      }

      setIsLoadingRate(true);
      try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${API_BASE_URL}/api/exchange-rates?currency=${currency.code}`);
        if (response.ok) {
          const data = await response.json();
          setCurrency({
            ...currency,
            rate: data.rate || 1
          });
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        // Keep existing rate if fetch fails
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchExchangeRate();
  }, [currency.code]);

  const setSelectedCurrency = async (currencyCode: string) => {
    // Fetch currency details from database API
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/api/currencies`);
      if (response.ok) {
        const currencies = await response.json();
        const newCurrency = currencies.find((c: any) => c.code === currencyCode);
        if (newCurrency) {
          // Fetch real-time exchange rate
          setIsLoadingRate(true);
          const rateResponse = await fetch(`${API_BASE_URL}/api/exchange-rates?currency=${currencyCode}`);
          if (rateResponse.ok) {
            const rateData = await rateResponse.json();
            setCurrency({
              ...newCurrency,
              rate: rateData.rate || 1
            });
          } else {
            setCurrency(newCurrency);
          }
          setIsLoadingRate(false);
        }
      }
    } catch (error) {
      console.error("Error fetching currency:", error);
      setIsLoadingRate(false);
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      selectedCurrency: currency.code, 
      exchangeRate: currency.rate, 
      setSelectedCurrency,
      isLoadingRate
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}