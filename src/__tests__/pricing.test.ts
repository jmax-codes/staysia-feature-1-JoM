/**
 * Pricing Calculation Unit Tests
 * 
 * Tests for pricing logic, calculations, and seasonal rates.
 * 
 * @module __tests__/pricing
 */

import { describe, it, expect } from 'vitest';

/**
 * Calculate total price with seasonal rates
 */
function calculatePricing(
  basePrice: number,
  nights: number,
  peakSeasonMultiplier: number = 1.0
): number {
  return basePrice * nights * peakSeasonMultiplier;
}

/**
 * Calculate price with discounts
 */
function calculateWithDiscount(
  basePrice: number,
  discountPercent: number
): number {
  return basePrice * (1 - discountPercent / 100);
}

/**
 * Validate price range
 */
function isValidPrice(price: number): boolean {
  return price > 0 && price < 1000000 && Number.isFinite(price);
}

describe('Pricing Calculations', () => {
  describe('calculatePricing', () => {
    it('should calculate basic pricing correctly', () => {
      expect(calculatePricing(100, 3)).toBe(300);
      expect(calculatePricing(250, 2)).toBe(500);
    });

    it('should apply peak season multiplier', () => {
      expect(calculatePricing(100, 3, 1.5)).toBe(450);
      expect(calculatePricing(200, 2, 1.25)).toBe(500);
    });

    it('should handle zero nights', () => {
      expect(calculatePricing(100, 0)).toBe(0);
    });

    it('should handle decimal multipliers', () => {
      expect(calculatePricing(100, 3, 1.15)).toBe(345);
    });
  });

  describe('calculateWithDiscount', () => {
    it('should apply discount correctly', () => {
      expect(calculateWithDiscount(100, 10)).toBe(90);
      expect(calculateWithDiscount(200, 25)).toBe(150);
    });

    it('should handle zero discount', () => {
      expect(calculateWithDiscount(100, 0)).toBe(100);
    });

    it('should handle 100% discount', () => {
      expect(calculateWithDiscount(100, 100)).toBe(0);
    });
  });

  describe('isValidPrice', () => {
    it('should validate positive prices', () => {
      expect(isValidPrice(100)).toBe(true);
      expect(isValidPrice(1000)).toBe(true);
    });

    it('should reject negative prices', () => {
      expect(isValidPrice(-1)).toBe(false);
      expect(isValidPrice(-100)).toBe(false);
    });

    it('should reject zero price', () => {
      expect(isValidPrice(0)).toBe(false);
    });

    it('should reject extremely high prices', () => {
      expect(isValidPrice(2000000)).toBe(false);
    });

    it('should reject invalid numbers', () => {
      expect(isValidPrice(NaN)).toBe(false);
      expect(isValidPrice(Infinity)).toBe(false);
    });
  });
});
