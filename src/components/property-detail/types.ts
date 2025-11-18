/**
 * Property Detail Types
 * 
 * Shared TypeScript interfaces for property detail components.
 * 
 * @module PropertyDetailTypes
 */

/**
 * Property data structure
 */
export interface Property {
  id: number;
  name: string;
  city: string;
  area: string;
  type: string;
  description: string;
  address: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  petsAllowed: boolean;
  checkInTime: string;
  checkOutTime: string;
  price: number;
  nights: number;
  rating: number;
  imageUrl: string;
  images: string[] | null;
  amenities: string[] | null;
  bestDealPrice: number | null;
  peakSeasonPrice: number | null;
}

/**
 * Host information structure
 */
export interface Host {
  id: number;
  fullName: string;
  profilePicture: string | null;
  contactNumber: string | null;
  bio: string | null;
  totalProperties: number;
  totalReviews: number;
  averageRating: number;
}

/**
 * Room data structure
 */
export interface Room {
  id: number;
  name: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
  beds: Record<string, number>;
  size: number;
  amenities: string[];
  available: boolean;
}

/**
 * Review data structure
 */
export interface Review {
  id: number;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  value: number;
  createdAt: string;
}

/**
 * Pricing data structure
 */
export interface PricingData {
  id: number;
  date: string;
  price: number;
  status: string;
}

/**
 * Complete property data with all related information
 */
export interface PropertyData {
  property: Property;
  host: Host | null;
  rooms: Room[] | null;
  reviews: Review[] | null;
  pricing: PricingData[] | null;
}
