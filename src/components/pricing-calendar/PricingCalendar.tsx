/**
 * Pricing Calendar Component
 * 
 * Main component that orchestrates all pricing calendar functionality.
 * Handles room selection, date selection, pricing calculations, and booking.
 * 
 * @component
 */

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
  selectedRoomId,
  onRoomChange,
  bestDealPrice: propBestDealPrice,
  peakSeasonPrice: propPeakSeasonPrice
}: PricingCalendarProps) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(null);
  const { selectedCurrency, exchangeRate } = useCurrency();
  const [localSelectedRoomId, setLocalSelectedRoomId] = useState<number | null>(selectedRoomId || null);

  // Auto-select first available room on mount
  useEffect(() => {
    if (rooms.length > 0 && !localSelectedRoomId) {
      const firstAvailableRoom = rooms.find(r => r.available) || rooms[0];
      setLocalSelectedRoomId(firstAvailableRoom.id);
      if (onRoomChange) {
        onRoomChange(firstAvailableRoom.id);
      }
    }
  }, [rooms]);

  // Use room-specific pricing if room is selected
  const activeRoom = rooms.find(r => r.id === localSelectedRoomId);
  const basePricePerNight = activeRoom ? activeRoom.pricePerNight : Math.round(cardPrice / defaultNights);
  
  // Use single prices from property
  const bestDealPrice = propBestDealPrice || Math.round(basePricePerNight * 0.80);
  const peakSeasonPrice = propPeakSeasonPrice || Math.round(basePricePerNight * 1.40);

  // Create pricing map for quick lookup
  const pricingMap = useMemo(() => {
    const map = new Map<string, PricingData>();
    pricingData.forEach((p) => map.set(p.date, p));
    return map;
  }, [pricingData]);

  // Check if pricing types exist in calendar
  const availablePricingTypes = useMemo(() => {
    const hasBestDeal = pricingData.some(p => p.status === 'best_deal' && p.status !== 'sold_out');
    const hasPeakSeason = pricingData.some(p => p.status === 'peak_season' && p.status !== 'sold_out');
    
    return { hasBestDeal, hasPeakSeason };
  }, [pricingData]);

  // Use pricing calculation hook
  const { displayPricing, isLoadingPricing } = usePricingCalculation({
    propertyId,
    selectedRoomId: localSelectedRoomId,
    selectedCheckIn,
    selectedCheckOut,
    pricingMap,
    basePricePerNight,
    bestDealPrice,
    peakSeasonPrice,
  });

  const formatPrice = (price: number) => {
    return utilFormatPrice(price, exchangeRate, selectedCurrency);
  };

  const handleRoomSelection = (roomId: number) => {
    setLocalSelectedRoomId(roomId);
    if (onRoomChange) {
      onRoomChange(roomId);
    }
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
        roomId: localSelectedRoomId,
        roomName: activeRoom?.name,
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
      {/* Room Selection */}
      <RoomSelector
        rooms={rooms}
        selectedRoomId={localSelectedRoomId}
        onRoomSelect={handleRoomSelection}
        formatPrice={formatPrice}
      />

      {/* Price Per Night Display */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(basePricePerNight)}</span>
          <span className="text-gray-600">per night</span>
        </div>
        
        {!activeRoom && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{formatPrice(cardPrice)}</span> {t('calendar.forNights', { count: defaultNights })}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <PriceBreakdown
        basePricePerNight={basePricePerNight}
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

      {/* Total Price Display */}
      <TotalPriceDisplay
        displayPricing={displayPricing}
        isLoadingPricing={isLoadingPricing}
        formatPrice={formatPrice}
      />

      {/* Legend */}
      <CalendarLegend />

      {/* Calendar Grid */}
      <CalendarGrid
        currentMonth={currentMonth}
        pricingMap={pricingMap}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        basePricePerNight={basePricePerNight}
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
          disabled={!selectedCheckIn || !selectedCheckOut || !displayPricing}
        >
          {t('calendar.confirmSelection')}
        </Button>
      </div>
    </div>
  );
}