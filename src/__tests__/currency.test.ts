/**
 * Currency Conversion Unit Tests
 * 
 * Tests for currency conversion, formatting, and exchange rate calculations.
 * 
 * @module __tests__/currency
 */

import { describe, it, expect } from 'vitest';

/**
 * Convert amount between currencies
 */
function convertCurrency(
  amount: number,
  fromRate: number,
  toRate: number
): number {
  return (amount / fromRate) * toRate;
}

/**
 * Format currency for display
 */
function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

/**
 * Round to 2 decimal places
 */
function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Validate currency code
 */
function isValidCurrencyCode(code: string): boolean {
  const validCodes = ['USD', 'EUR', 'GBP', 'JPY', 'IDR'];
  return validCodes.includes(code);
}

describe('Currency Conversion', () => {
  describe('convertCurrency', () => {
    it('should convert between currencies', () => {
      // USD to EUR (1 USD = 0.85 EUR)
      expect(convertCurrency(100, 1, 0.85)).toBe(85);
      
      // EUR to USD (1 EUR = 1.18 USD)
      expect(convertCurrency(100, 1, 1.18)).toBe(118);
    });

    it('should handle same currency conversion', () => {
      expect(convertCurrency(100, 1, 1)).toBe(100);
    });

    it('should handle complex exchange rates', () => {
      // IDR to USD (1 USD = 15000 IDR)
      const result = convertCurrency(150000, 15000, 1);
      expect(result).toBe(10);
    });

    it('should maintain precision', () => {
      const result = convertCurrency(123.45, 1, 0.85);
      expect(result).toBeCloseTo(104.9325, 4);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      const formatted = formatCurrency(1234.56, 'USD');
      expect(formatted).toContain('1,234.56');
      expect(formatted).toContain('$');
    });

    it('should format EUR correctly', () => {
      const formatted = formatCurrency(1234.56, 'EUR');
      expect(formatted).toContain('1,234.56');
      expect(formatted).toContain('€');
    });

    it('should handle zero amount', () => {
      const formatted = formatCurrency(0, 'USD');
      expect(formatted).toContain('0');
    });
  });

  describe('roundCurrency', () => {
    it('should round to 2 decimal places', () => {
      expect(roundCurrency(10.123)).toBe(10.12);
      expect(roundCurrency(10.567)).toBe(10.57);
    });

    it('should handle exact decimal places', () => {
      expect(roundCurrency(10.50)).toBe(10.50);
    });

    it('should handle integers', () => {
      expect(roundCurrency(10)).toBe(10);
    });
  });

  describe('isValidCurrencyCode', () => {
    it('should accept valid currency codes', () => {
      expect(isValidCurrencyCode('USD')).toBe(true);
      expect(isValidCurrencyCode('EUR')).toBe(true);
      expect(isValidCurrencyCode('IDR')).toBe(true);
    });

    it('should reject invalid currency codes', () => {
      expect(isValidCurrencyCode('XXX')).toBe(false);
      expect(isValidCurrencyCode('usd')).toBe(false);
      expect(isValidCurrencyCode('')).toBe(false);
    });
  });
});
