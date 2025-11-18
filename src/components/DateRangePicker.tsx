"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  isWithinInterval,
  isBefore,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DateRangePickerProps {
  onSelect?: (checkIn: Date | null, checkOut: Date | null) => void;
  isOpen: boolean;
  onClose: () => void;
  checkIn?: Date | null;
  checkOut?: Date | null;
}

export function DateRangePicker({ onSelect, isOpen, onClose, checkIn: externalCheckIn, checkOut: externalCheckOut }: DateRangePickerProps) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const nextMonth = addMonths(currentMonth, 1);
  const today = startOfDay(new Date());

  // Sync internal state with external props (for reset functionality)
  useEffect(() => {
    setCheckIn(externalCheckIn ?? null);
    setCheckOut(externalCheckOut ?? null);
  }, [externalCheckIn, externalCheckOut]);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      setCheckIn(date);
      setCheckOut(null);
      onSelect?.(date, null);
    } else if (checkIn && !checkOut) {
      // Complete the selection
      if (isBefore(date, checkIn)) {
        setCheckIn(date);
        setCheckOut(checkIn);
        onSelect?.(date, checkIn);
      } else {
        setCheckOut(date);
        onSelect?.(checkIn, date);
      }
    }
  };

  useEffect(() => {
    if (checkIn && checkOut && onSelect) {
      onSelect(checkIn, checkOut);
    }
  }, [checkIn, checkOut, onSelect]);

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const firstDayOfWeek = monthStart.getDay();
    const emptyDays = Array(firstDayOfWeek).fill(null);

    const dayAbbreviations = [
      t('components.dateRangePicker.dayAbbreviations.sunday'),
      t('components.dateRangePicker.dayAbbreviations.monday'),
      t('components.dateRangePicker.dayAbbreviations.tuesday'),
      t('components.dateRangePicker.dayAbbreviations.wednesday'),
      t('components.dateRangePicker.dayAbbreviations.thursday'),
      t('components.dateRangePicker.dayAbbreviations.friday'),
      t('components.dateRangePicker.dayAbbreviations.saturday')
    ];

    return (
      <div className="flex-1 px-2 sm:px-4">
        <div className="text-center mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
            {format(monthDate, "MMMM yyyy")}
          </h3>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayAbbreviations.map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const isCheckInDate = checkIn && isSameDay(day, checkIn);
            const isCheckOutDate = checkOut && isSameDay(day, checkOut);
            const isInRange =
              checkIn &&
              checkOut &&
              isWithinInterval(day, { start: checkIn, end: checkOut });
            const isPast = isBefore(day, today);
            const isToday = isSameDay(day, today);

            return (
              <button
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                disabled={isPast}
                className={`
                  relative aspect-square flex items-center justify-center text-xs sm:text-sm font-medium
                  transition-all rounded-full
                  ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                  ${!isPast && !isCheckInDate && !isCheckOutDate && !isInRange ? "hover:border hover:border-[#283B73]" : ""}
                  ${isInRange && !isCheckInDate && !isCheckOutDate ? "bg-[#283B73]/20" : ""}
                  ${isCheckInDate || isCheckOutDate ? "bg-[#283B73] text-white z-10" : "text-gray-900"}
                  ${isToday && !isCheckInDate && !isCheckOutDate ? "border border-[#283B73]" : ""}
                `}
              >
                <span className="relative z-10">{format(day, "d")}</span>
                
                {/* Range background connectors */}
                {isInRange && !isCheckInDate && !isCheckOutDate && (
                  <>
                    <div className="absolute inset-y-0 left-0 right-0 bg-[#283B73]/20 -z-10" />
                  </>
                )}
                {isCheckInDate && checkOut && (
                  <div className="absolute inset-y-0 left-1/2 right-0 bg-[#283B73]/20 -z-10" />
                )}
                {isCheckOutDate && checkIn && (
                  <div className="absolute inset-y-0 left-0 right-1/2 bg-[#283B73]/20 -z-10" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-4 z-50 w-full sm:max-w-3xl">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-4 sm:p-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Responsive months: one on mobile, two on desktop */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {renderMonth(currentMonth)}
          <div className="hidden md:block md:flex-1">
            {renderMonth(nextMonth)}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}