/**
 * Calendar Grid Component
 * 
 * Renders the interactive calendar grid with date selection,
 * pricing display, and availability status.
 * 
 * @component
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PricingData } from "./types";
import { STATUS_COLORS } from "./types";
import { getDaysInMonth, isPastDate, isDateInRange, formatShortPrice } from "./utils";

interface CalendarGridProps {
  /** Current month being displayed */
  currentMonth: Date;
  /** Map of date strings to pricing data */
  pricingMap: Map<string, PricingData>;
  /** Selected check-in date */
  selectedCheckIn: string | null;
  /** Selected check-out date */
  selectedCheckOut: string | null;
  /** Base price per night */
  basePricePerNight: number;
  /** Best deal price */
  bestDealPrice: number;
  /** Peak season price */
  peakSeasonPrice: number;
  /** Exchange rate for currency conversion */
  exchangeRate: number;
  /** Callback when date is clicked */
  onDateClick: (day: number) => void;
  /** Callback to go to previous month */
  onPrevMonth: () => void;
  /** Callback to go to next month */
  onNextMonth: () => void;
}

/**
 * CalendarGrid Component
 * 
 * Displays interactive monthly calendar with pricing and availability.
 * Supports date range selection and shows pricing for each date.
 * 
 * @param props - Component props
 * @returns Calendar grid UI
 */
export function CalendarGrid({
  currentMonth,
  pricingMap,
  selectedCheckIn,
  selectedCheckOut,
  basePricePerNight,
  bestDealPrice,
  peakSeasonPrice,
  exchangeRate,
  onDateClick,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="mb-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-gray-900">{monthName}</h3>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square"></div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const pricing = pricingMap.get(dateString);
          
          // Determine status - default to base_price if no data
          let status = pricing?.status || "base_price";
          
          // Use single prices for calendar display
          let displayPrice = basePricePerNight;
          if (pricing) {
            if (pricing.status === "best_deal") {
              displayPrice = bestDealPrice;
            } else if (pricing.status === "peak_season") {
              displayPrice = peakSeasonPrice;
            }
          }
          
          const isPast = isPastDate(dateString);
          const isCheckIn = selectedCheckIn === dateString;
          const isCheckOut = selectedCheckOut === dateString;
          const isInRange = isDateInRange(dateString, selectedCheckIn, selectedCheckOut);

          return (
            <button
              key={day}
              onClick={() => onDateClick(day)}
              disabled={status === "sold_out" || isPast}
              className={`aspect-square border rounded-lg p-1 flex flex-col items-center justify-center text-center transition-all ${
                isPast
                  ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                  : STATUS_COLORS[status as keyof typeof STATUS_COLORS]
              } ${
                isCheckIn || isCheckOut
                  ? "ring-2 ring-[#283B73] ring-offset-2"
                  : isInRange
                  ? "bg-[#283B73]/10 border-[#283B73]"
                  : ""
              }`}
            >
              <span className="text-sm font-semibold">{day}</span>
              <span className="text-[10px] leading-tight">
                {status === "sold_out" || isPast ? "✕" : formatShortPrice(displayPrice, exchangeRate)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
