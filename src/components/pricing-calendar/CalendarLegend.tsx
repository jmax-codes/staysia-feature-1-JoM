/**
 * Calendar Legend Component
 * 
 * Displays color legend explaining calendar date statuses
 * (base price, best deal, peak season, sold out).
 * 
 * @component
 */

"use client";

import { useTranslation } from "react-i18next";

/**
 * CalendarLegend Component
 * 
 * Shows a 2-column grid of calendar status indicators with
 * color dots and labels.
 * 
 * @returns Calendar legend UI
 */
export function CalendarLegend() {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-700 mb-2">
        {t('calendar.checkAvailability')}
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">{t('calendar.basePrice')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">{t('calendar.bestDeal')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-600">{t('calendar.peakSeason')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-gray-600">{t('calendar.soldOut')}</span>
        </div>
      </div>
    </div>
  );
}
