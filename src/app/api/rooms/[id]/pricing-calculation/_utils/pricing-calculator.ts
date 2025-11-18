/**
 * Pricing Calculator for Room Availability
 * 
 * Calculates nightly prices considering availability, best deals, and peak seasons.
 * 
 * @module api/rooms/[id]/pricing-calculation/utils/pricing-calculator
 */

import { db } from '@/db';

export interface PricingDetail {
  date: string;
  price: number;
  type: 'base' | 'best_deal' | 'peak_season' | 'unavailable';
}

export interface PricingBreakdown {
  baseNights: number;
  bestDealNights: number;
  peakSeasonNights: number;
  unavailableNights: number;
  unavailableDates: string[];
}

/**
 * Calculate pricing for date range
 * 
 * Determines price for each night considering availability, best deals, and peak seasons.
 * 
 * @param roomId - Room ID
 * @param propertyId - Property ID
 * @param basePricePerNight - Base price per night
 * @param dateRange - Array of dates to calculate
 * @param startDate - Start date for queries
 * @param endDate - End date for queries
 * @returns Pricing details and breakdown
 */
export async function calculatePricing(
  roomId: number,
  propertyId: number,
  basePricePerNight: number,
  dateRange: string[],
  startDate: string,
  endDate: string
) {
  // Fetch all data in parallel
  const [availabilityRecords, peakRates, pricingRecords] = await Promise.all([
    db.roomAvailability.findMany({
      where: {
        roomId,
        date: { gte: startDate, lte: endDate }
      }
    }),
    db.peakSeasonRate.findMany({
      where: {
        isActive: true,
        startDate: { lte: endDate },
        endDate: { gte: startDate }
      }
    }),
    db.propertyPricing.findMany({
      where: {
        roomId,
        date: { gte: startDate, lte: endDate }
      }
    })
  ]);

  // Create lookup maps
  const availabilityMap = new Map<string, boolean>();
  availabilityRecords.forEach(record => {
    availabilityMap.set(record.date, record.isAvailable);
  });

  const bestDealMap = new Map<string, number>();
  pricingRecords.forEach(record => {
    if (record.priceType === 'best_deal' && record.price < basePricePerNight) {
      bestDealMap.set(record.date, record.price);
    }
  });

  const relevantPeakRates = peakRates.filter(rate => 
    rate.roomId === roomId || (rate.propertyId === propertyId && rate.roomId === null)
  );

  // Calculate pricing for each date
  const pricingDetails: PricingDetail[] = [];
  const breakdown: PricingBreakdown = {
    baseNights: 0,
    bestDealNights: 0,
    peakSeasonNights: 0,
    unavailableNights: 0,
    unavailableDates: []
  };

  for (const date of dateRange) {
    // Check availability
    if (availabilityMap.get(date) === false) {
      pricingDetails.push({ date, price: 0, type: 'unavailable' });
      breakdown.unavailableNights++;
      breakdown.unavailableDates.push(date);
      continue;
    }

    // Check best deal
    const bestDealPrice = bestDealMap.get(date);
    if (bestDealPrice !== undefined) {
      pricingDetails.push({ date, price: bestDealPrice, type: 'best_deal' });
      breakdown.bestDealNights++;
      continue;
    }

    // Check peak season
    let peakPrice: number | null = null;
    for (const rate of relevantPeakRates) {
      const rateStart = new Date(rate.startDate);
      const rateEnd = new Date(rate.endDate);
      const currentDate = new Date(date);

      if (currentDate >= rateStart && currentDate <= rateEnd) {
        if (rate.priceIncrease) {
          peakPrice = basePricePerNight + rate.priceIncrease;
        } else if (rate.percentageIncrease) {
          peakPrice = Math.round(basePricePerNight * (1 + rate.percentageIncrease / 100));
        }

        if (rate.roomId === roomId) break;
      }
    }

    if (peakPrice !== null) {
      pricingDetails.push({ date, price: peakPrice, type: 'peak_season' });
      breakdown.peakSeasonNights++;
      continue;
    }

    // Default to base price
    pricingDetails.push({ date, price: basePricePerNight, type: 'base' });
    breakdown.baseNights++;
  }

  return { pricingDetails, breakdown };
}
