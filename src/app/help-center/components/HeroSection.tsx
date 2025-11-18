/**
 * Help Center Hero Section
 * 
 * Displays page title and search functionality.
 * 
 * @module app/help-center/components
 */

import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  debouncedQuery: string;
  resultsCount: number;
}

/**
 * Hero section with title and search bar
 */
export const HeroSection = ({ 
  searchQuery, 
  onSearchChange, 
  debouncedQuery, 
  resultsCount 
}: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('helpCenter.title')}
        </h1>
        <p className="text-white/80 text-lg mb-8">
          {t('helpCenter.subtitle')}
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('helpCenter.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-[#FFB400] outline-none text-gray-900 bg-white"
          />
          {searchQuery && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <button
                onClick={() => onSearchChange("")}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Search Results Info */}
        {debouncedQuery && (
          <div className="mt-4 text-white/70 text-sm">
            {resultsCount === 0 ? (
              <span>{t('helpCenter.noResults', { query: debouncedQuery })}</span>
            ) : (
              <span>
                {t('helpCenter.resultsFound', { count: resultsCount, query: debouncedQuery })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
