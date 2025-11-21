/**
 * Pricing Calendar Types
 * 
 * TypeScript interfaces for pricing calendar components.
 * Defines data structures for pricing, rooms, and calendar state.
 * 
 * @module PricingCalendarTypes
 */

/**
 * Pricing data for a specific date
 */
export interface PricingData {
  id: number;
  date: string;
  price: number;
  status: string;
}

/**
 * Room information for selection
 */
export interface Room {
  id: number;
  name: string;
  pricePerNight: number;
  available?: boolean;
}

/**
 * Props for PricingCalendar component
 */
export interface PricingCalendarProps {
  /** Property ID */
  propertyId: number;
  /** Array of pricing data for calendar dates */
  pricingData: PricingData[];
  /** Base price for calculations */
  basePrice: number;
  /** Default number of nights */
  defaultNights: number;
  /** Card display price */
  cardPrice: number;
  /** Available rooms for selection */
  rooms?: Room[];
  /** Currently selected room ID (deprecated, use selectedRoomIds) */
  selectedRoomId?: number;
  /** Currently selected room IDs */
  selectedRoomIds?: number[];
  /** Callback when room selection changes */
  onRoomChange?: (roomId: number) => void;
  /** Best deal price (single price, not range) */
  bestDealPrice?: number | null;
  /** Peak season price (single price, not range) */
  peakSeasonPrice?: number | null;
}

/**
 * Pricing calculation result from API
 */
export interface PricingCalculationResult {
  totalPrice: number;
  nights: number;
  averagePricePerNight: number;
  breakdown: {
    baseNights: number;
    bestDealNights: number;
    peakSeasonNights: number;
    unavailableNights: number;
  };
  pricing: Array<{
    date: string;
    price: number;
    type: string;
  }>;
}

/**
 * Status color mapping for calendar dates
 */
export const STATUS_COLORS = {
  available: "bg-green-50 hover:bg-green-100 text-green-900 border-green-300",
  base: "bg-green-50 hover:bg-green-100 text-green-900 border-green-300",
  base_price: "bg-green-50 hover:bg-green-100 text-green-900 border-green-300",
  bestDeal: "bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-300",
  best_deal: "bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-300",
  peakSeason: "bg-orange-50 hover:bg-orange-100 text-orange-900 border-orange-300",
  peak_season: "bg-orange-50 hover:bg-orange-100 text-orange-900 border-orange-300",
  soldOut: "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300",
  sold_out: "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300",
} as const;


