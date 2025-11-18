/**
 * Dynamic Property Sections Component
 * 
 * Generates dynamic property sections based on search filters and location.
 * Creates contextual property groupings for better user experience.
 * 
 * @module app/components/HomePage
 */

import { useTranslation } from "react-i18next";

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

/**
 * Generate dynamic property sections based on active filters
 * 
 * @param properties - Array of properties to group
 * @param activeLocation - Currently selected location filter
 * @returns Array of property sections with titles
 */
export function useDynamicSections(properties: Property[], activeLocation: string) {
  const { t } = useTranslation();

  const createDynamicSections = (): Array<{ title: string; properties: Property[] }> => {
    if (properties.length === 0) return [];

    const sections: Array<{ title: string; properties: Property[] }> = [];

    // Location-specific sections (group by area)
    if (activeLocation) {
      const areaGroups = properties.reduce((acc, property) => {
        const key = property.area || t('sections.otherAreas');
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(property);
        return acc;
      }, {} as Record<string, Property[]>);

      const sortedAreas = Object.entries(areaGroups)
        .sort(([, a], [, b]) => b.length - a.length);

      sortedAreas.forEach(([area, areaProperties]) => {
        const propertyType = areaProperties[0]?.type || t('sections.property');
        sections.push({
          title: t('sections.propertyTypesIn', { type: propertyType, area, location: activeLocation }),
          properties: areaProperties,
        });
      });

      return sections;
    }

    // Global sections (group by city)
    const cityGroups = properties.reduce((acc, property) => {
      if (!acc[property.city]) {
        acc[property.city] = [];
      }
      acc[property.city].push(property);
      return acc;
    }, {} as Record<string, Property[]>);

    const sortedCities = Object.entries(cityGroups)
      .sort(([, a], [, b]) => b.length - a.length);

    // Section 1: Top city
    if (sortedCities.length > 0) {
      const [topCity, topCityProperties] = sortedCities[0];
      sections.push({
        title: t('sections.staysIn', { city: topCity }),
        properties: topCityProperties.slice(0, 12),
      });
    }

    // Section 2: Second city or property type
    if (sortedCities.length > 1) {
      const [secondCity, secondCityProperties] = sortedCities[1];
      sections.push({
        title: t('sections.availableHomesIn', { city: secondCity }),
        properties: secondCityProperties.slice(0, 12),
      });
    } else {
      const typeGroups = properties.reduce((acc, property) => {
        if (!acc[property.type]) {
          acc[property.type] = [];
        }
        acc[property.type].push(property);
        return acc;
      }, {} as Record<string, Property[]>);

      const sortedTypes = Object.entries(typeGroups)
        .sort(([, a], [, b]) => b.length - a.length);

      if (sortedTypes.length > 0) {
        const [topType, topTypeProperties] = sortedTypes[0];
        sections.push({
          title: t('sections.propertyTypesIn', { type: topType, area: '', location: '' }).replace(' in , ', 's'),
          properties: topTypeProperties.slice(0, 12),
        });
      }
    }

    // Section 3: Third city or guest favorites
    if (sortedCities.length > 2) {
      const [thirdCity, thirdCityProperties] = sortedCities[2];
      sections.push({
        title: t('sections.placesToStayIn', { city: thirdCity }),
        properties: thirdCityProperties.slice(0, 12),
      });
    } else {
      const favorites = properties
        .filter(p => p.isGuestFavorite || p.rating >= 4.5)
        .slice(0, 12);
      
      if (favorites.length > 0) {
        sections.push({
          title: t('sections.guestFavorites'),
          properties: favorites,
        });
      }
    }

    return sections.slice(0, 3);
  };

  return createDynamicSections();
}
