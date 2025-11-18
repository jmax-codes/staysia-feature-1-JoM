"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GuestCounts {
  adults: number;
  children: number;
  rooms: number;
  pets: number;
}

interface GuestsSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestsChange?: (guests: GuestCounts) => void;
}

export function GuestsSelector({ isOpen, onClose, onGuestsChange }: GuestsSelectorProps) {
  const { t } = useTranslation();
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 0,
    children: 0,
    rooms: 0,
    pets: 0
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const updateGuest = (type: keyof GuestCounts, delta: number) => {
    setGuests((prev) => {
      const newGuests = {
        ...prev,
        [type]: Math.max(0, prev[type] + delta)
      };
      onGuestsChange?.(newGuests);
      return newGuests;
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-11 left-0 sm:left-auto sm:right-0 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full sm:w-[380px] max-w-[calc(100vw-2rem)] sm:max-w-none z-50 border border-gray-100">

      <div className="space-y-4 sm:space-y-6">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm sm:text-base font-semibold text-gray-900">{t('components.guestsSelector.adults')}</div>
            <div className="text-xs sm:text-sm text-gray-500">{t('components.guestsSelector.adultsDesc')}</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => updateGuest("adults", -1)}
              disabled={guests.adults === 0}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 sm:border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95">
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-10 sm:w-8 text-center font-medium text-gray-900">{guests.adults}</span>
            <button
              onClick={() => updateGuest("adults", 1)}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 sm:border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors active:scale-95">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {/* Children */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm sm:text-base font-semibold text-gray-900">{t('components.guestsSelector.children')}</div>
            <div className="text-xs sm:text-sm text-gray-500">{t('components.guestsSelector.childrenDesc')}</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => updateGuest("children", -1)}
              disabled={guests.children === 0}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 sm:border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95">
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-10 sm:w-8 text-center font-medium text-gray-900">{guests.children}</span>
            <button
              onClick={() => updateGuest("children", 1)}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 sm:border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors active:scale-95">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {/* Pets */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm sm:text-base font-semibold text-gray-900">{t('components.guestsSelector.pets')}</div>
            <div className="text-xs sm:text-sm text-gray-500 underline cursor-pointer">
              {t('components.guestsSelector.serviceAnimal')}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => updateGuest("pets", -1)}
              disabled={guests.pets === 0}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 sm:border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95">
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-10 sm:w-8 text-center font-medium text-gray-900">{guests.pets}</span>
            <button
              onClick={() => updateGuest("pets", 1)}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 sm:border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors active:scale-95">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {/* Rooms */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm sm:text-base font-semibold text-gray-900">{t('components.guestsSelector.rooms')}</div>
            <div className="text-xs sm:text-sm text-gray-500">{t('components.guestsSelector.roomsDesc')}</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => updateGuest("rooms", -1)}
              disabled={guests.rooms === 0}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 sm:border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95">
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-10 sm:w-8 text-center font-medium text-gray-900">{guests.rooms}</span>
            <button
              onClick={() => updateGuest("rooms", 1)}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 sm:border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors active:scale-95">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>);

}

interface GuestsInputProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onGuestsChange?: (guests: GuestCounts) => void;
}

export function GuestsInput({ isOpen, onOpenChange, onGuestsChange }: GuestsInputProps) {
  const { t } = useTranslation();
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    rooms: 0,
    pets: 0
  });

  const handleGuestsChange = (newGuests: GuestCounts) => {
    setGuests(newGuests);
    onGuestsChange?.(newGuests);
  };

  const formatGuestSummary = () => {
    const parts = [];
    if (guests.adults > 0) {
      const label = guests.adults > 1 ? t('components.guestsSelector.adultsPlural') : t('components.guestsSelector.adult');
      parts.push(`${guests.adults} ${label}`);
    }
    if (guests.children > 0) {
      const label = guests.children > 1 ? t('components.guestsSelector.childrenPlural') : t('components.guestsSelector.child');
      parts.push(`${guests.children} ${label}`);
    }
    if (guests.rooms > 0) {
      const label = guests.rooms > 1 ? t('components.guestsSelector.roomsPlural') : t('components.guestsSelector.room');
      parts.push(`${guests.rooms} ${label}`);
    }
    if (guests.pets > 0) {
      const label = guests.pets > 1 ? t('components.guestsSelector.petsPlural') : t('components.guestsSelector.pet');
      parts.push(`${guests.pets} ${label}`);
    }
    return parts.length > 0 ? parts.join(", ") : t('components.guestsSelector.addGuests');
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-400" />
        <button
          onClick={onOpenChange}
          className="flex-1 text-left text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none">
          {formatGuestSummary()}
        </button>
      </div>
      <GuestsSelector isOpen={isOpen} onClose={onOpenChange} onGuestsChange={handleGuestsChange} />
    </div>);

}