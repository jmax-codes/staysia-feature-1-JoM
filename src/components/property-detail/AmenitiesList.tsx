/**
 * Amenities List Component
 * 
 * Displays property amenities in a responsive grid layout
 * with check icons.
 * 
 * @component
 */

"use client";

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AmenitiesListProps {
  /** Array of amenity names */
  amenities: string[];
}

/**
 * AmenitiesList Component
 * 
 * Renders amenities in a 2-column grid with checkmark icons.
 * Returns null if no amenities provided.
 * 
 * @param props - Component props
 * @returns Amenities section or null
 */
export function AmenitiesList({ amenities }: AmenitiesListProps) {
  const { t } = useTranslation();

  if (amenities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {t('propertyDetail.whatThisPlaceOffers')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
