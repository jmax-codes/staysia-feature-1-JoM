/**
 * Rooms List Component
 * 
 * Displays available rooms with pricing, amenities, and booking
 * functionality. Each room shows size, bed configuration, and availability.
 * 
 * @component
 */

"use client";

import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import type { Room } from "./types";
import { formatBeds } from "./utils";

interface RoomsListProps {
  /** Array of room data */
  rooms: Room[];
  /** Callback when booking button clicked */
  onBooking: () => void;
}

/**
 * RoomsList Component
 * 
 * Renders list of available rooms with details and booking button.
 * Converts prices to selected currency and shows availability status.
 * Returns null if no rooms available.
 * 
 * @param props - Component props
 * @returns Rooms section or null
 */
export function RoomsList({ rooms, onBooking }: RoomsListProps) {
  const { t } = useTranslation();
  const { selectedCurrency, exchangeRate } = useCurrency();

  if (rooms.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    const converted = price * exchangeRate;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('propertyDetail.availableRooms')}
      </h2>
      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-[#FFB400] transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {room.name}
                </h3>
                <p className="text-sm text-gray-600">{room.type}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(room.pricePerNight)}
                </p>
                <p className="text-sm text-gray-600">{t('propertyDetail.perNight')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <span>{room.maxGuests} {t('propertyDetail.guests')}</span>
              <span>•</span>
              <span>{room.size} m²</span>
              <span>•</span>
              <span>{formatBeds(room.beds)}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {room.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {room.available ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      {t('propertyDetail.available')}
                    </span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      {t('propertyDetail.notAvailable')}
                    </span>
                  </>
                )}
              </div>
              <Button
                onClick={onBooking}
                disabled={!room.available}
                className="bg-[#FFB400] hover:bg-[#e5a200] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('propertyDetail.bookNow')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
