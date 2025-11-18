/**
 * API Validation Utilities
 * 
 * Shared validation helpers for API routes.
 * Validates dates, numbers, and business rules.
 * 
 * @module APIValidationUtils
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
 * 
 * Checks if date string matches ISO format and is a valid date.
 * 
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 * 
 * @example
 * ```typescript
 * validateDateFormat('2024-01-15') // true
 * validateDateFormat('2024-1-15')  // false
 * validateDateFormat('invalid')    // false
 * ```
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
 * 
 * Checks if value is a positive integer greater than zero.
 * 
 * @param value - Value to validate
 * @returns True if valid positive integer
 * 
 * @example
 * ```typescript
 * validatePositiveInteger(5)     // true
 * validatePositiveInteger(0)     // false
 * validatePositiveInteger(-1)    // false
 * validatePositiveInteger(5.5)   // false
 * ```
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
 * 
 * Ensures best_deal prices are below base and
 * peak_season prices are above base.
 * 
 * @param price - Price to validate
 * @param basePrice - Base price to compare against
 * @param priceType - Type of pricing (best_deal, peak_season, etc.)
 * @returns Validation result with error if invalid
 * 
 * @example
 * ```typescript
 * validatePriceAgainstBase(80, 100, 'best_deal')
 * // { valid: true }
 * 
 * validatePriceAgainstBase(120, 100, 'best_deal')
 * // { valid: false, error: 'best_deal price must be less than base price' }
 * ```
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
 * 
 * Ensures start date is before or equal to end date.
 * 
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @returns True if valid range
 * 
 * @example
 * ```typescript
 * validateDateRange('2024-01-01', '2024-01-31') // true
 * validateDateRange('2024-01-31', '2024-01-01') // false
 * ```
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
 * 
 * Checks if status is one of the valid pricing types.
 * 
 * @param status - Status to validate
 * @returns True if valid status
 */
export function validatePriceType(status: string): boolean {
  return VALID_PRICE_TYPES.includes(status.toLowerCase() as any);
}

/**
 * Validate percentage (0-100)
 * 
 * Checks if value is a number between 0 and 100 inclusive.
 * 
 * @param value - Value to validate
 * @returns True if valid percentage
 * 
 * @example
 * ```typescript
 * validatePercentage(50)   // true
 * validatePercentage(0)    // true
 * validatePercentage(100)  // true
 * validatePercentage(101)  // false
 * validatePercentage(-1)   // false
 * ```
 */
export function validatePercentage(value: number): boolean {
  return (
    typeof value === 'number' &&
    value >= 0 &&
    value <= 100
  );
}
