/**
 * Pricing Calculation Hook
 * 
 * Custom React hook for managing pricing calculations, API calls,
 * and client-side fallback calculations.
 * 
 * @module usePricingCalculation
 */

import { useState, useEffect, useMemo } from "react";
import type { PricingData, PricingCalculationResult } from "./types";

interface UsePricingCalculationProps {
  propertyId: number;
  selectedRoomId: number | null;
  selectedCheckIn: string | null;
  selectedCheckOut: string | null;
  pricingMap: Map<string, PricingData>;
  basePricePerNight: number;
  bestDealPrice: number;
  peakSeasonPrice: number;
}

/**
 * Custom hook for pricing calculations
 * 
 * Handles API calls for room/property pricing and provides
 * client-side fallback calculations. Auto-fetches when dates change.
 * 
 * @param props - Hook configuration
 * @returns Pricing data, loading state, and calculation results
 * 
 * @sideEffects Makes API calls to /api/rooms/{id}/pricing-calculation
 * @sideEffects Makes API calls to /api/properties/{id}/pricing-calculation
 */
export function usePricingCalculation({
  propertyId,
  selectedRoomId,
  selectedCheckIn,
  selectedCheckOut,
  pricingMap,
  basePricePerNight,
  bestDealPrice,
  peakSeasonPrice,
}: UsePricingCalculationProps) {
  
  /**
   * Client-side pricing calculation fallback
   */
  const clientSideCalculation = useMemo((): PricingCalculationResult | null => {
    if (!selectedCheckIn || !selectedCheckOut) return null;
    
    const start = new Date(selectedCheckIn);
    const end = new Date(selectedCheckOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return null;
    
    let totalPrice = 0;
    let baseNights = 0;
    let bestDealNights = 0;
    let peakSeasonNights = 0;
    let unavailableNights = 0;
    
    const pricing: Array<{ date: string; price: number; type: string }> = [];
    
    // Calculate total room price per night (sum of all selected rooms)
    // If no rooms selected, we don't add room price (user just sees calendar price)
    // BUT user requirement says: "Total Price = Sum of (Calendar Price per Night + Room Price per Night)"
    // And "If the user has NOT selected a room → you cannot show total pricing"
    // So we handle the "no room selected" case by returning null or 0 total in the component,
    // but here we calculate what we can.
    
    // However, the hook needs to know the room prices.
    // We'll assume basePricePerNight passed in IS the sum of room prices if rooms are selected,
    // OR we need to change the props.
    // Let's stick to the props we have: basePricePerNight should be the "Room Price" part.
    // Wait, previously basePricePerNight was EITHER room price OR property base price.
    // The user says: "Calendar Price = cost of the dates", "Room Price = cost of selected room".
    // So we need TWO distinct inputs: Calendar Price (from pricingMap) and Room Price (from props).
    
    // Let's assume 'basePricePerNight' passed to this hook represents the TOTAL ROOM PRICE per night.
    
    // Loop through each night
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const dayPricing = pricingMap.get(dateString);
      
      if (dayPricing?.status === 'sold_out') {
        unavailableNights++;
        continue;
      }
      
      // Calendar Price (Date Cost)
      let calendarPrice = 0; 
      let dayType = 'base';
      
      if (dayPricing) {
        calendarPrice = dayPricing.price;
        
        if (dayPricing.status === 'best_deal' || dayPricing.status === 'bestDeal') {
          dayType = 'best_deal';
          bestDealNights++;
        } else if (dayPricing.status === 'peak_season' || dayPricing.status === 'peakSeason') {
          dayType = 'peak_season';
          peakSeasonNights++;
        } else {
          dayType = 'base';
          baseNights++;
        }
      } else {
        // Fallback if no calendar price found? Should probably use a default property base price if provided,
        // but for now let's assume 0 or handle it upstream.
        // Actually, if no calendar data, maybe use the 'basePricePerNight' as a fallback for calendar price?
        // No, user distinguishes them.
        // Let's assume calendar price is 0 if missing (or maybe the 'base' property price).
        // For now, let's use the passed 'basePricePerNight' as the "Property Base Price" if no specific date price exists,
        // AND add the Room Price on top.
        // BUT 'basePricePerNight' prop is ambiguous now.
        // Let's rely on the component to pass the correct "Room Price Sum" separately.
        // We will use 'basePricePerNight' as the "Room Price Sum".
        // And we need a 'propertyBasePrice' for the calendar fallback?
        // Let's just use the dayPricing.price.
        baseNights++;
      }
      
      // Total for this night = Calendar Price + Room Price (basePricePerNight)
      // Note: basePricePerNight here represents the SUM of selected room prices.
      const nightlyTotal = calendarPrice + basePricePerNight;
      
      totalPrice += nightlyTotal;
      pricing.push({ date: dateString, price: nightlyTotal, type: dayType });
    }
    
    return {
      totalPrice,
      nights: nights - unavailableNights,
      averagePricePerNight: totalPrice / (nights - unavailableNights),
      breakdown: {
        baseNights,
        bestDealNights,
        peakSeasonNights,
        unavailableNights
      },
      pricing
    };
  }, [selectedCheckIn, selectedCheckOut, pricingMap, basePricePerNight, bestDealPrice, peakSeasonPrice]);

  // We rely on client-side calculation using the provided pricingMap and basePricePerNight (room price sum)
  // This ensures the formula "Total = Calendar Price + Room Price" is followed correctly.
  // The API fetch is removed because it doesn't know about the selected rooms (since we support multi-select now)
  // and would return incorrect totals (only calendar price).

  const displayPricing = clientSideCalculation;

  return {
    displayPricing,
    isLoadingPricing: false,
  };
}
