/**
 * Rooms List Component
 * 
 * Displays available rooms with pricing, amenities, and booking
 * functionality. Each room shows size, bed configuration, and availability.
 * 
 * @component
 */

"use client";

import { Check, X, Users, Maximize, BedDouble, Bath, Wifi, Wind } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import type { Room } from "./types";
import { formatBeds } from "./utils";

interface RoomsListProps {
  /** Array of room data */
  rooms: Room[];
  /** Currently selected room IDs */
  selectedRoomIds: number[];
  /** Callback when room selection toggles */
  onToggleRoom: (roomId: number) => void;
}

/**
 * RoomsList Component
 * 
 * Renders list of available rooms with details and selection capability.
 * Allows multiple rooms to be selected.
 * 
 * @param props - Component props
 * @returns Rooms section or null
 */
export function RoomsList({ rooms, selectedRoomIds, onToggleRoom }: RoomsListProps) {
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {t('propertyDetail.availableRooms') || "Choose Your Room"}
      </h2>
      <div className="space-y-4">
        {rooms.map((room) => {
          const isSelected = selectedRoomIds.includes(room.id);
          // Fallback image if none provided in room data (though schema doesn't have room images yet, using placeholder or property image would be ideal, but for now we use a placeholder pattern or just the design structure)
          // The reference image shows a room image. Since our Room model doesn't have an image field yet, we'll simulate it or use a placeholder.
          // For this implementation, I'll use a placeholder from Unsplash that matches the room type.
          const roomImage = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=60"; 

          return (
            <div
              key={room.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col md:flex-row ${
                isSelected 
                  ? 'border-green-500 ring-1 ring-green-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Left Content */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                  {isSelected && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Selected Room
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-6">{room.type}</p>

                {/* Room Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Guest</p>
                      <p className="font-semibold text-gray-900">{room.maxGuests}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <Maximize className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="font-semibold text-gray-900">{room.size} m²</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bed</p>
                      <p className="font-semibold text-gray-900">{Object.values(room.beds as Record<string, number> || {}).reduce((a, b) => a + b, 0)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600">
                      <Bath className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bathroom</p>
                      <p className="font-semibold text-gray-900">1</p>
                    </div>
                  </div>
                </div>

                {/* Amenities Tags */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {room.amenities && (room.amenities as string[]).slice(0, 6).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600">
                      {amenity.toLowerCase().includes('wifi') ? <Wifi className="w-4 h-4 text-blue-500" /> :
                       amenity.toLowerCase().includes('bath') ? <Bath className="w-4 h-4 text-cyan-500" /> :
                       amenity.toLowerCase().includes('air') ? <Wind className="w-4 h-4 text-blue-400" /> :
                       <Check className="w-4 h-4 text-gray-400" />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                  {(room.amenities as string[]).length > 6 && (
                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-500">
                      +{room.amenities.length - 6} more
                    </div>
                  )}
                </div>
              </div>

              {/* Right Content - Image & Action */}
              <div className="w-full md:w-80 flex flex-col">
                <div className="relative h-48 md:h-full min-h-[200px]">
                  <img 
                    src={roomImage} 
                    alt={room.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +5 photos
                  </div>
                </div>
                <div className={`p-4 ${isSelected ? 'bg-green-50' : 'bg-blue-50'}`}>
                  <Button
                    onClick={() => onToggleRoom(room.id)}
                    disabled={!room.available}
                    className={`w-full h-auto py-3 flex flex-col items-center justify-center gap-1 ${
                      isSelected 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span className="text-sm font-medium">{isSelected ? 'Selected' : 'Select'}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold">{formatPrice(room.pricePerNight)}</span>
                      <span className="text-xs opacity-90">/night</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
