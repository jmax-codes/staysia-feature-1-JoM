"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SearchFilters {
  location?: string;
  category?: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  adults?: number;
  children?: number;
  pets?: number;
  rooms?: number;
}

interface Property {
  id: number;
  name: string;
  city: string;
  area: string;
  type: string;
  price: number;
  nights: number;
  rating: number;
  imageUrl: string;
  isGuestFavorite: boolean;
  reviewCount?: number;
}

interface SearchCache {
  [key: string]: {
    properties: Property[];
    timestamp: number;
  };
}

interface SearchContextType {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  getCachedSearch: (key: string) => Property[] | null;
  setCachedSearch: (key: string, properties: Property[]) => void;
  clearCache: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState<SearchCache>({});

  const getCachedSearch = useCallback((key: string): Property[] | null => {
    const cached = cache[key];
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      // Cache expired
      return null;
    }

    return cached.properties;
  }, [cache]);

  const setCachedSearch = useCallback((key: string, properties: Property[]) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        properties,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  return (
    <SearchContext.Provider
      value={{
        filters,
        setFilters,
        properties,
        setProperties,
        isLoading,
        setIsLoading,
        getCachedSearch,
        setCachedSearch,
        clearCache,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
