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
  const [apiPricingData, setApiPricingData] = useState<PricingCalculationResult | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);

  // Fetch pricing when dates or room changes
  useEffect(() => {
    if (selectedCheckIn && selectedCheckOut) {
      if (selectedRoomId) {
        fetchRoomPricing(selectedRoomId, selectedCheckIn, selectedCheckOut);
      } else {
        fetchPropertyPricing(selectedCheckIn, selectedCheckOut);
      }
    } else {
      setApiPricingData(null);
    }
  }, [selectedRoomId, selectedCheckIn, selectedCheckOut]);

  /**
   * Fetches room-specific pricing from API
   */
  const fetchRoomPricing = async (roomId: number, startDate: string, endDate: string) => {
    setIsLoadingPricing(true);
    try {
      const response = await fetch(
        `/api/rooms/${roomId}/pricing-calculation?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setApiPricingData(data);
      } else {
        console.error("Failed to fetch room pricing");
        setApiPricingData(null);
      }
    } catch (error) {
      console.error("Error fetching room pricing:", error);
      setApiPricingData(null);
    } finally {
      setIsLoadingPricing(false);
    }
  };

  /**
   * Fetches property-level pricing from API
   */
  const fetchPropertyPricing = async (startDate: string, endDate: string) => {
    setIsLoadingPricing(true);
    try {
      const response = await fetch(
        `/api/properties/${propertyId}/pricing-calculation?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setApiPricingData(data);
      } else {
        console.error("Failed to fetch property pricing");
        setApiPricingData(null);
      }
    } catch (error) {
      console.error("Error fetching property pricing:", error);
      setApiPricingData(null);
    } finally {
      setIsLoadingPricing(false);
    }
  };

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
    
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const dayPricing = pricingMap.get(dateString);
      
      if (dayPricing?.status === 'sold_out') {
        unavailableNights++;
        continue;
      }
      
      let dayPrice = basePricePerNight;
      let dayType = 'base';
      
      if (dayPricing) {
        if (dayPricing.status === 'best_deal') {
          dayPrice = bestDealPrice;
          dayType = 'best_deal';
          bestDealNights++;
        } else if (dayPricing.status === 'peak_season') {
          dayPrice = peakSeasonPrice;
          dayType = 'peak_season';
          peakSeasonNights++;
        } else {
          baseNights++;
        }
      } else {
        baseNights++;
      }
      
      totalPrice += dayPrice;
      pricing.push({ date: dateString, price: dayPrice, type: dayType });
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

  // Use API data if available, otherwise use client-side calculation
  const displayPricing = apiPricingData || clientSideCalculation;

  return {
    displayPricing,
    isLoadingPricing,
  };
}
