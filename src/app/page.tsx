/**
 * Homepage
 * 
 * Main landing page displaying property listings with dynamic sections.
 * Features search functionality, filters, and responsive property carousels.
 * 
 * @module app
 */

"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { PropertyCarousel } from "@/components/PropertyCarousel";
import { VerificationBanner } from "@/components/VerificationBanner";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { useSearch } from "@/contexts/SearchContext";
import { PageLoadingSkeleton, PropertyCarouselSkeleton } from "@/components/LoadingSkeletons";
import { useDynamicSections } from "./components/HomePage/DynamicSections";
import { fetchProperties, generateCacheKey } from "./components/HomePage/utils";

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

/**
 * Homepage component
 * 
 * Displays property listings with search and filter functionality.
 */
export default function Home() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const { getCachedSearch, setCachedSearch } = useSearch();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState<string>("");

  // Handle scroll on page load if hash is present
  useEffect(() => {
    if (window.location.hash === "#stays") {
      setTimeout(() => {
        const headerElement = document.querySelector("header");
        const navbarElement = document.querySelector("nav");
        if (headerElement && navbarElement) {
          const headerHeight = headerElement.offsetHeight;
          const navbarHeight = navbarElement.offsetHeight;
          const scrollPosition = headerHeight - navbarHeight;
          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchFilters]);

  /**
   * Fetch property data with caching
   */
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      const cacheKey = generateCacheKey(searchFilters);
      const cachedResults = getCachedSearch(cacheKey);
      
      if (cachedResults) {
        setProperties(Array.isArray(cachedResults) ? cachedResults : []);
        setIsLoading(false);
        setActiveLocation(searchFilters.location || "");
        return;
      }

      setActiveLocation(searchFilters.location || "");
      
      const results = await fetchProperties(searchFilters);
      
      setCachedSearch(cacheKey, results);
      setProperties(results);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle search filter changes
   */
  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const dynamicSections = useDynamicSections(properties, activeLocation);

  if (!isReady) {
    return <PageLoadingSkeleton />;
  }

  const propertyText = properties.length === 1 ? t('sections.property') : t('sections.properties');

  return (
    <div className="min-h-screen bg-[#FAFAFA] animate-fade-in">
      <Header onSearch={handleSearch} />
      <VerificationBanner />
      
      <main>
        {activeLocation && !isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {properties.length} {propertyText} {t('propertyDetail.in')} {activeLocation}
            </h2>
            {searchFilters.category && searchFilters.category !== "all" && (
              <p className="text-gray-600 mt-1">
                {t('search.showingCategory', { category: searchFilters.category })}
              </p>
            )}
          </div>
        )}

        {isLoading ? (
          <>
            <PropertyCarouselSkeleton />
            <PropertyCarouselSkeleton />
            <PropertyCarouselSkeleton />
          </>
        ) : (
          <>
            {dynamicSections.map((section, index) => (
              <PropertyCarousel
                key={`section-${index}`}
                title={section.title}
                properties={section.properties}
                type="property"
              />
            ))}

            {properties.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('sections.noResultsFound')}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t('sections.tryAdjustingFilters')}
                </p>
                {activeLocation && (
                  <p className="text-gray-500 text-sm">
                    {t('search.noPropertiesFoundIn', { location: activeLocation })}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}