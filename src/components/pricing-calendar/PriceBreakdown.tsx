"use client";

import { useTranslation } from "react-i18next";

interface PriceBreakdownProps {
  /** Base price per night */
  basePricePerNight: number;
  /** Best deal price (if available) */
  bestDealPrice: number;
  /** Peak season price (if available) */
  peakSeasonPrice: number;
  /** Whether best deal exists in calendar */
  hasBestDeal: boolean;
  /** Whether peak season exists in calendar */
  hasPeakSeason: boolean;
  /** Function to format price with currency */
  formatPrice: (price: number) => string;
}

/**
 * PriceBreakdown Component
 * 
 * Shows pricing tiers with colored indicators. Only displays
 * best deal and peak season if they exist in the calendar data.
 * 
 * @param props - Component props
 * @returns Price breakdown section
 */
export function PriceBreakdown({
  basePricePerNight,
  bestDealPrice,
  peakSeasonPrice,
  hasBestDeal,
  hasPeakSeason,
  formatPrice,
}: PriceBreakdownProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <p className="text-xs font-semibold text-gray-700 mb-3">
        PRICE BREAKDOWN
      </p>
      
      <div className="space-y-2 text-sm">
        {/* Base Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700">Base Price:</span>
          </div>
          <span className="font-semibold text-green-600">
            {formatPrice(basePricePerNight)}/{t('calendar.night')}
          </span>
        </div>
        
        {/* Best Deal */}
        {hasBestDeal && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-700">Best Deal:</span>
            </div>
            <span className="font-semibold text-blue-600">
              {formatPrice(bestDealPrice)}/{t('calendar.night')}
            </span>
          </div>
        )}
        
        {/* Peak Season */}
        {hasPeakSeason && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-700">Peak Season:</span>
            </div>
            <span className="font-semibold text-orange-600">
              {formatPrice(peakSeasonPrice)}/{t('calendar.night')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}