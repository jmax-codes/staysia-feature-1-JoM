/**
 * Pricing Calendar Utilities
 * 
 * Utility functions for date manipulation, price formatting,
 * and calendar calculations.
 * 
 * @module PricingCalendarUtils
 */

/**
 * Formats price with currency conversion
 * 
 * @param price - Price amount to format
 * @param exchangeRate - Exchange rate multiplier
 * @param currency - Currency code (e.g., 'USD', 'IDR')
 * @returns Formatted price string
 * 
 * @example
 * ```ts
 * formatPrice(100000, 1.2, 'USD') // "$120,000"
 * ```
 */
export function formatPrice(
  price: number,
  exchangeRate: number,
  currency: string
): string {
  const converted = price * exchangeRate;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);
}

/**
 * Formats price in shortened form (K, M notation)
 * 
 * @param price - Price amount to format
 * @param exchangeRate - Exchange rate multiplier
 * @returns Shortened price string
 * 
 * @example
 * ```ts
 * formatShortPrice(1500000, 1) // "1M"
 * formatShortPrice(50000, 1) // "50k"
 * ```
 */
export function formatShortPrice(price: number, exchangeRate: number): string {
  const converted = price * exchangeRate;
  if (converted >= 1000000) {
    return Math.round(converted / 1000000) + "M";
  } else if (converted >= 1000) {
    return Math.round(converted / 1000) + "k";
  }
  return converted.toString();
}

/**
 * Gets days in month with calendar metadata
 * 
 * @param date - Date object for target month
 * @returns Object with days count, starting day, year, and month
 */
export function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  return { daysInMonth, startingDayOfWeek, year, month };
}

/**
 * Checks if date is in the past
 * 
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns True if date is before today
 */
export function isPastDate(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateString);
  return checkDate < today;
}

/**
 * Checks if date is in selected range (between check-in and check-out)
 * 
 * @param dateString - Date to check
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns True if date is in range
 */
export function isDateInRange(
  dateString: string,
  checkIn: string | null,
  checkOut: string | null
): boolean {
  if (!checkIn || !checkOut) return false;
  const date = new Date(dateString);
  return date > new Date(checkIn) && date < new Date(checkOut);
}
