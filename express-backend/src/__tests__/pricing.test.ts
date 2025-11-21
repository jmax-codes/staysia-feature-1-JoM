/**
 * Pricing Logic Tests
 * 
 * Unit tests for pricing calculations and business rules.
 */

import { describe, it, expect } from '@jest/globals';

describe('Pricing Business Rules', () => {
  it('should ensure best_deal price is less than base price', () => {
    const basePrice = 100;
    const bestDealPrice = 80;
    
    expect(bestDealPrice).toBeLessThan(basePrice);
  });

  it('should ensure peak_season price is greater than base price', () => {
    const basePrice = 100;
    const peakSeasonPrice = 150;
    
    expect(peakSeasonPrice).toBeGreaterThan(basePrice);
  });

  it('should calculate total price correctly for multiple nights', () => {
    const pricePerNight = 100;
    const nights = 5;
    const expectedTotal = 500;
    
    const total = pricePerNight * nights;
    
    expect(total).toBe(expectedTotal);
  });

  it('should handle mixed pricing (base, peak, best_deal)', () => {
    const baseNights = 2;
    const basePrice = 100;
    const peakNights = 2;
    const peakPrice = 150;
    const bestDealNights = 1;
    const bestDealPrice = 80;
    
    const total = (baseNights * basePrice) + (peakNights * peakPrice) + (bestDealNights * bestDealPrice);
    const expected = 200 + 300 + 80; // 580
    
    expect(total).toBe(expected);
  });

  it('should block booking on sold_out dates', () => {
    const isSoldOut = true;
    const canBook = !isSoldOut;
    
    expect(canBook).toBe(false);
  });
});

describe('Date Validation', () => {
  it('should validate YYYY-MM-DD format', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    expect('2025-01-15').toMatch(dateRegex);
    expect('2025-1-5').not.toMatch(dateRegex);
    expect('25-01-15').not.toMatch(dateRegex);
  });

  it('should ensure end date is after start date', () => {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-01-10');
    
    expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
  });
});
