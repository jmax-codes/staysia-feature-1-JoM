/**
 * Room Selector Component
 * 
 * Displays available rooms for selection with pricing and highlights
 * the currently selected room.
 * 
 * @component
 */

"use client";

import { useTranslation } from "react-i18next";
import type { Room } from "./types";

interface RoomSelectorProps {
  /** Available rooms */
  rooms: Room[];
  /** Currently selected room ID */
  selectedRoomId: number | null;
  /** Callback when room is selected */
  onRoomSelect: (roomId: number) => void;
  /** Function to format price with currency */
  formatPrice: (price: number) => string;
}

/**
 * RoomSelector Component
 * 
 * Renders a list of selectable rooms with radio-style selection.
 * Shows room name, price per night, and selection indicator.
 * Returns null if no rooms available.
 * 
 * @param props - Component props
 * @returns Room selector UI or null
 */
export function RoomSelector({ 
  rooms, 
  selectedRoomId, 
  onRoomSelect, 
  formatPrice 
}: RoomSelectorProps) {
  const { t } = useTranslation();

  if (rooms.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <p className="text-xs font-semibold text-gray-700 mb-3">
        {t('calendar.selectRoom')}
      </p>
      <div className="space-y-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedRoomId === room.id
                ? "border-[#283B73] bg-[#283B73]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{room.name}</p>
                <p className="text-sm text-gray-600">
                  {formatPrice(room.pricePerNight)}/{t('calendar.night')}
                </p>
              </div>
              {selectedRoomId === room.id && (
                <div className="w-5 h-5 rounded-full bg-[#283B73] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
