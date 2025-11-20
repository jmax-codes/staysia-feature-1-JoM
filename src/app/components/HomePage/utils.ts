/**
 * Homepage Utility Functions
 * 
 * Helper functions for data fetching and processing on the homepage.
 * 
 * @module app/components/HomePage/utils
 */

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
 * Ensure data is a valid array of properties
 * 
 * @param data - Raw data from API
 * @returns Valid property array
 */
export function ensureArray(data: any): Property[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.properties && Array.isArray(data.properties)) return data.properties;
  if (data.error) {
    console.error("API returned error:", data.error);
    return [];
  }
  return [];
}

/**
 * Generate cache key for search filters
 * 
 * @param filters - Search filter object
 * @returns Cache key string
 */
export function generateCacheKey(filters: any): string {
  return JSON.stringify({
    location: filters.location || "",
    category: filters.category || "all",
    adults: filters.adults || 0,
    children: filters.children || 0,
    pets: filters.pets || 0,
    rooms: filters.rooms || 0,
  });
}

/**
 * Build URL search parameters from filters
 * 
 * @param filters - Search filter object
 * @returns URLSearchParams object
 */
export function buildSearchParams(filters: any): URLSearchParams {
  const params = new URLSearchParams();
  
  if (filters.location) {
    params.append("city", filters.location);
  }
  
  if (filters.category && filters.category !== "all") {
    params.append("type", filters.category);
  }
  
  if (filters.adults || filters.children) {
    const totalGuests = (filters.adults || 0) + (filters.children || 0);
    params.append("adults", totalGuests.toString());
  }
  
  if (filters.pets && filters.pets > 0) {
    params.append("pets", "true");
  }
  
  if (filters.rooms) {
    params.append("rooms", filters.rooms.toString());
  }
  
  params.append("limit", "50");
  params.append("sortBy", "rating");

  return params;
}

/**
 * Fetch properties from API with filters
 * 
 * @param filters - Search filter object
 * @returns Array of properties
 */
export async function fetchProperties(filters: any): Promise<Property[]> {
  const params = buildSearchParams(filters);
  
  console.log("Fetching properties with params:", params.toString());
  const response = await fetch(`/api/properties?${params}`);
  
  if (!response.ok) {
    console.error("API error:", response.status);
    return [];
  }
  
  const data = await response.json();
  console.log("API response data:", data);
  return ensureArray(data);
}
