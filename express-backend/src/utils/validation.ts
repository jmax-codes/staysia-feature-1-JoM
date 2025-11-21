/**
 * API Validation Utilities
 * 
 * Shared validation helpers for API routes.
 * Validates dates, numbers, and business rules.
 */

/**
 * Validation error with code
 */
export interface ValidationError {
  error: string;
  code: string;
}

/**
 * Date format regex (YYYY-MM-DD)
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDateFormat(dateString: string): boolean {
  if (!DATE_REGEX.test(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate positive integer
 */
export function validatePositiveInteger(value: any): boolean {
  return (
    typeof value === 'number' &&
    value > 0 &&
    Number.isInteger(value)
  );
}

/**
 * Validate price against base price for pricing type
 */
export function validatePriceAgainstBase(
  price: number,
  basePrice: number,
  priceType: string
): { valid: boolean; error?: string } {
  if (priceType === 'best_deal' && price >= basePrice) {
    return {
      valid: false,
      error: `best_deal price (${price}) must be less than base price (${basePrice})`
    };
  }
  
  if (priceType === 'peak_season' && price <= basePrice) {
    return {
      valid: false,
      error: `peak_season price (${price}) must be greater than base price (${basePrice})`
    };
  }
  
  return { valid: true };
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): boolean {
  return new Date(startDate) <= new Date(endDate);
}

/**
 * Valid pricing statuses/types
 */
export const VALID_PRICE_TYPES = [
  'available',
  'sold_out',
  'peak_season',
  'best_deal'
] as const;

/**
 * Validate pricing status/type
 */
export function validatePriceType(status: string): boolean {
  return VALID_PRICE_TYPES.includes(status.toLowerCase() as any);
}

/**
 * Validate percentage (0-100)
 */
export function validatePercentage(value: number): boolean {
  return (
    typeof value === 'number' &&
    value >= 0 &&
    value <= 100
  );
}
