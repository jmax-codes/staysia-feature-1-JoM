"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { RoomSelector } from "./RoomSelector";
import { PriceBreakdown } from "./PriceBreakdown";
import { DateSelector } from "./DateSelector";
import { TotalPriceDisplay } from "./TotalPriceDisplay";
import { CalendarLegend } from "./CalendarLegend";
import { CalendarGrid } from "./CalendarGrid";
import { usePricingCalculation } from "./usePricingCalculation";
import { formatPrice as utilFormatPrice } from "./utils";
import type { PricingCalendarProps, PricingData } from "./types";

/**
 * PricingCalendar Component
 * 
 * Complete pricing calendar with room selection, date picker,
 * price breakdown, and booking confirmation. Automatically
 * calculates total price based on selected dates and room.
 * 
 * @param props - Component props
 * @returns Pricing calendar component
 * 
 * @sideEffects Auto-selects first available room on mount
 * @sideEffects Fetches pricing data from API when dates change
 * @sideEffects Logs booking confirmation to console
 */
export function PricingCalendar({ 
  propertyId, 
  pricingData, 
  basePrice,
  defaultNights,
  cardPrice,
  rooms = [],
  selectedRoomIds = [],
  onRoomChange,
  bestDealPrice: propBestDealPrice,
  peakSeasonPrice: propPeakSeasonPrice
}: PricingCalendarProps) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(null);
  const { selectedCurrency, exchangeRate } = useCurrency();

  // Calculate combined base price from selected rooms
  const selectedRooms = rooms.filter(r => selectedRoomIds.includes(r.id));
  const hasSelectedRooms = selectedRooms.length > 0;
  
  // Calculate total room price per night (sum of all selected rooms)
  // If no rooms selected, we use 0 for the calculation (total will be hidden anyway)
  // For display of "per night" at the top, we show the property base price if no rooms selected
  const totalRoomPricePerNight = hasSelectedRooms
    ? selectedRooms.reduce((sum, room) => sum + room.pricePerNight, 0)
    : 0;

  // Display price: If rooms selected, show their sum. If not, show property base price.
  // FIX: Do NOT divide cardPrice by defaultNights. cardPrice is per night.
  const displayBasePrice = hasSelectedRooms ? totalRoomPricePerNight : cardPrice;
  
  // Use single prices from property for the calendar display
  // FIX: Use cardPrice (Property Price) for calculating defaults, not displayBasePrice (which might be Room Price)
  const bestDealPrice = propBestDealPrice || Math.round(cardPrice * 0.80);
  const peakSeasonPrice = propPeakSeasonPrice || Math.round(cardPrice * 1.40);

  // Create pricing map for quick lookup
  const pricingMap = useMemo(() => {
    const map = new Map<string, PricingData>();
    pricingData.forEach((p) => map.set(p.date, p));
    return map;
  }, [pricingData]);

  // Check if pricing types exist in calendar
  const availablePricingTypes = useMemo(() => {
    const hasBestDeal = pricingData.some(p => (p.status === 'best_deal' || p.status === 'bestDeal') && p.status !== 'sold_out');
    const hasPeakSeason = pricingData.some(p => (p.status === 'peak_season' || p.status === 'peakSeason') && p.status !== 'sold_out');
    
    return { hasBestDeal, hasPeakSeason };
  }, [pricingData]);

  // Use pricing calculation hook
  // We pass totalRoomPricePerNight as the "basePricePerNight" argument
  // The hook adds this to the calendar price for each night
  const { displayPricing, isLoadingPricing } = usePricingCalculation({
    propertyId,
    selectedRoomId: null, // Not used anymore
    selectedCheckIn,
    selectedCheckOut,
    pricingMap,
    basePricePerNight: totalRoomPricePerNight, 
    bestDealPrice,
    peakSeasonPrice,
  });

  const formatPrice = (price: number) => {
    return utilFormatPrice(price, exchangeRate, selectedCurrency);
  };

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    const pricing = pricingMap.get(dateString);
    if (pricing?.status === "sold_out") return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(dateString);
      setSelectedCheckOut(null);
    } else {
      if (new Date(dateString) > new Date(selectedCheckIn)) {
        setSelectedCheckOut(dateString);
      } else {
        setSelectedCheckIn(dateString);
        setSelectedCheckOut(null);
      }
    }
  };

  const handleClearDates = () => {
    setSelectedCheckIn(null);
    setSelectedCheckOut(null);
  };

  const handleConfirmSelection = () => {
    if (selectedCheckIn && selectedCheckOut && displayPricing) {
      console.log("Booking confirmed:", {
        roomIds: selectedRoomIds,
        checkIn: selectedCheckIn,
        checkOut: selectedCheckOut,
        nights: displayPricing.nights,
        totalPrice: displayPricing.totalPrice,
      });
    }
  };

  const handlePrevMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Price Per Night Display */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(displayBasePrice)}</span>
          <span className="text-gray-600">per night</span>
        </div>
        
        {!hasSelectedRooms && (
          <div className="text-sm text-gray-600">
            {/* FIX: Multiply cardPrice by defaultNights for total, since cardPrice is per night */}
            <span className="font-medium">{formatPrice(cardPrice * defaultNights)}</span> {t('calendar.forNights', { count: defaultNights })}
          </div>
        )}
        {hasSelectedRooms && (
          <div className="text-sm text-gray-600">
             {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <PriceBreakdown
        basePricePerNight={cardPrice} // FIX: Always pass Property Price (cardPrice) to breakdown
        bestDealPrice={bestDealPrice}
        peakSeasonPrice={peakSeasonPrice}
        hasBestDeal={availablePricingTypes.hasBestDeal}
        hasPeakSeason={availablePricingTypes.hasPeakSeason}
        formatPrice={formatPrice}
      />

      {/* Date Selector */}
      <DateSelector
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
      />

      {/* Total Price Display - Only show if rooms selected */}
      {hasSelectedRooms && (
        <TotalPriceDisplay
          displayPricing={displayPricing}
          isLoadingPricing={isLoadingPricing}
          formatPrice={formatPrice}
        />
      )}
      {!hasSelectedRooms && selectedCheckIn && selectedCheckOut && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
          Select a room to see total price
        </div>
      )}

      {/* Legend */}
      <CalendarLegend />

      {/* Calendar Grid */}
      <CalendarGrid
        currentMonth={currentMonth}
        pricingMap={pricingMap}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        basePricePerNight={cardPrice} // FIX: Pass Property Price to Grid as fallback/base
        bestDealPrice={bestDealPrice}
        peakSeasonPrice={peakSeasonPrice}
        exchangeRate={exchangeRate}
        onDateClick={handleDateClick}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleClearDates}
          variant="outline"
          className="flex-1"
          disabled={!selectedCheckIn && !selectedCheckOut}
        >
          {t('calendar.clearDates')}
        </Button>
        <Button
          onClick={handleConfirmSelection}
          className="flex-1 bg-[#283B73] hover:bg-[#1e2d5a] text-white"
          disabled={!selectedCheckIn || !selectedCheckOut || !displayPricing || !hasSelectedRooms}
        >
          {t('calendar.confirmSelection')}
        </Button>
      </div>
    </div>
  );
}