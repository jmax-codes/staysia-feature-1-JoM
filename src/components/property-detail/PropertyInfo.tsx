/**
 * Property Information Component
 * 
 * Displays basic property details including type, location,
 * capacity, and description.
 * 
 * @component
 */

"use client";

import { useTranslation } from "react-i18next";
import type { Property } from "./types";

interface PropertyInfoProps {
  /** Property data to display */
  property: Property;
}

/**
 * PropertyInfo Component
 * 
 * Shows property type, area, capacity (guests/bedrooms/bathrooms),
 * and full description text.
 * 
 * @param props - Component props
 * @returns Property information section
 */
export function PropertyInfo({ property }: PropertyInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {property.type} {t('propertyDetail.in')} {property.area}
      </h2>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
        <span>{property.maxGuests} {t('propertyDetail.guests')}</span>
        <span>•</span>
        <span>{property.bedrooms} {t('propertyDetail.bedrooms')}</span>
        <span>•</span>
        <span>{property.bathrooms} {t('propertyDetail.bathrooms')}</span>
      </div>
      <p className="text-gray-700 leading-relaxed">{property.description}</p>
    </div>
  );
}
