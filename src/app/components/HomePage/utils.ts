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
  
  // Handle Express API format: {data: [...], meta: {...}}
  if (data.data && Array.isArray(data.data)) return data.data;
  
  // Handle flat array
  if (Array.isArray(data)) return data;
  
  // Handle legacy format
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
    checkIn: filters.checkIn ? filters.checkIn.toISOString().split('T')[0] : "",
    checkOut: filters.checkOut ? filters.checkOut.toISOString().split('T')[0] : "",
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
  
  // Location filter (replaces city)
  if (filters.location) {
    params.append("location", filters.location);
  }
  
  // Category filter (replaces type)
  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  
  // Date range filters (ISO format YYYY-MM-DD)
  if (filters.checkIn) {
    const checkInDate = filters.checkIn instanceof Date 
      ? filters.checkIn 
      : new Date(filters.checkIn);
    params.append("checkIn", checkInDate.toISOString().split('T')[0]);
  }
  
  if (filters.checkOut) {
    const checkOutDate = filters.checkOut instanceof Date 
      ? filters.checkOut 
      : new Date(filters.checkOut);
    params.append("checkOut", checkOutDate.toISOString().split('T')[0]);
  }
  
  // Guest count filters
  if (filters.adults && filters.adults > 0) {
    params.append("adults", filters.adults.toString());
  }
  
  if (filters.children && filters.children > 0) {
    params.append("children", filters.children.toString());
  }
  
  // Pets filter
  if (filters.pets && filters.pets > 0) {
    params.append("pets", filters.pets.toString());
  }
  
  // Rooms filter (for future use)
  if (filters.rooms && filters.rooms > 0) {
    params.append("rooms", filters.rooms.toString());
  }
  
  // Pagination and sorting
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
  
  // Use Express backend API
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  
  console.log("Fetching properties with params:", params.toString());
  const response = await fetch(`${API_BASE_URL}/api/properties?${params}`);
  
  if (!response.ok) {
    console.error("API error:", response.status);
    return [];
  }
  
  const data = await response.json();
  console.log("API response data:", data);
  return ensureArray(data);
}
