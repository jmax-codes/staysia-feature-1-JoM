/**
 * Total Price Display Component
 * 
 * Shows the calculated total price for selected date range
 * with loading state and night count.
 * 
 * @component
 */

"use client";

import { useTranslation } from "react-i18next";
import type { PricingCalculationResult } from "./types";

interface TotalPriceDisplayProps {
  /** Pricing calculation result */
  displayPricing: PricingCalculationResult | null;
  /** Whether pricing is being loaded */
  isLoadingPricing: boolean;
  /** Function to format price with currency */
  formatPrice: (price: number) => string;
}

/**
 * TotalPriceDisplay Component
 * 
 * Displays total booking price with night count in a highlighted card.
 * Shows loading skeleton while calculating prices.
 * Returns null if no dates selected.
 * 
 * @param props - Component props
 * @returns Total price display or null
 */
export function TotalPriceDisplay({ 
  displayPricing, 
  isLoadingPricing, 
  formatPrice 
}: TotalPriceDisplayProps) {
  const { t } = useTranslation();

  if (!displayPricing && !isLoadingPricing) {
    return null;
  }

  return (
    <div className="mb-6">
      {isLoadingPricing ? (
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      ) : displayPricing ? (
        <div className="bg-[#283B73] text-white rounded-xl px-6 py-4 flex items-center justify-between">
          <span className="text-base font-medium">
            {t('calendar.total')} ({displayPricing.nights} {displayPricing.nights === 1 ? t('calendar.night') : t('calendar.nights')})
          </span>
          <span className="text-2xl font-bold">
            {formatPrice(displayPricing.totalPrice)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
