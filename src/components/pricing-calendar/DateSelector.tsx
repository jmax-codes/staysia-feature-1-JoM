/**
 * Date Selector Component
 * 
 * Displays selected check-in and check-out dates in a
 * formatted card layout.
 * 
 * @component
 */

"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DateSelectorProps {
  /** Selected check-in date string */
  selectedCheckIn: string | null;
  /** Selected check-out date string */
  selectedCheckOut: string | null;
}

/**
 * DateSelector Component
 * 
 * Shows check-in and check-out dates in a grid layout.
 * Displays placeholder text when dates not selected.
 * 
 * @param props - Component props
 * @returns Date selector UI
 */
export function DateSelector({ selectedCheckIn, selectedCheckOut }: DateSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-gray-300 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700">{t('search.checkIn').toUpperCase()}</span>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {selectedCheckIn
              ? new Date(selectedCheckIn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : t('calendar.selectDates')}
          </p>
        </div>
        <div className="border border-gray-300 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700">{t('search.checkOut').toUpperCase()}</span>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {selectedCheckOut
              ? new Date(selectedCheckOut).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : t('calendar.selectDates')}
          </p>
        </div>
      </div>
    </div>
  );
}
