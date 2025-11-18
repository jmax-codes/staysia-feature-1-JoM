"use client";

import { useState } from "react";
import { Calendar, Search, Home, Castle, Building2, Hotel, Building, X } from "lucide-react";
import { Button } from "./ui/button";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { DateRangePicker } from "./DateRangePicker";
import { GuestsInput } from "./GuestsSelector";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { Skeleton } from "./ui/skeleton";

interface SearchFilters {
  location?: string;
  category?: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  adults?: number;
  children?: number;
  pets?: number;
  rooms?: number;
}

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
}

interface LocationSuggestion {
  formatted: string;
  city?: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [activeTab, setActiveTab] = useState("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [guestsData, setGuestsData] = useState({ adults: 0, children: 0, rooms: 0, pets: 0 });

  const categories = [
    { id: "all", label: t('search.categories.all'), icon: null, color: null },
    { id: "house", label: t('search.categories.house'), icon: Home, color: "#FF6B6B" },
    { id: "villa", label: t('search.categories.villa'), icon: Castle, color: "#4ECDC4" },
    { id: "apartment", label: t('search.categories.apartment'), icon: Building2, color: "#95E1D3" },
    { id: "hotel", label: t('search.categories.hotel'), icon: Hotel, color: "#F38181" },
    { id: "condo", label: t('search.categories.condo'), icon: Building, color: "#AA96DA" },
    { id: "penthouse", label: t('search.categories.penthouse'), icon: Building2, color: "#FCBAD3" }
  ];

  const handleDateSelect = (checkInDate: Date | null, checkOutDate: Date | null) => {
    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
  };

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
    // Trigger search with cleared dates
    const filters: SearchFilters = {
      location: location || undefined,
      category: activeTab !== "all" ? activeTab : undefined,
      checkIn: null,
      checkOut: null,
      adults: guestsData.adults || undefined,
      children: guestsData.children || undefined,
      pets: guestsData.pets || undefined,
      rooms: guestsData.rooms || undefined
    };
    onSearch?.(filters);
  };

  const formatDateRange = () => {
    if (checkIn && checkOut) {
      return `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d, yyyy")}`;
    } else if (checkIn) {
      return format(checkIn, "MMM d, yyyy");
    }
    return "";
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
    if (!isCalendarOpen) {
      setIsGuestsOpen(false);
    }
  };

  const handleGuestsToggle = () => {
    setIsGuestsOpen(!isGuestsOpen);
    if (!isGuestsOpen) {
      setIsCalendarOpen(false);
    }
  };

  const handleSearch = () => {
    const filters: SearchFilters = {
      location: location || undefined,
      category: activeTab !== "all" ? activeTab : undefined,
      checkIn,
      checkOut,
      adults: guestsData.adults || undefined,
      children: guestsData.children || undefined,
      pets: guestsData.pets || undefined,
      rooms: guestsData.rooms || undefined
    };

    onSearch?.(filters);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setSelectedLocation(suggestion);
    setLocation(suggestion.city || suggestion.formatted);
  };

  const handleGuestsChange = (data: {adults: number;children: number;rooms: number;pets: number;}) => {
    setGuestsData(data);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveTab(categoryId);
    // Trigger search automatically when category changes
    const filters: SearchFilters = {
      location: location || undefined,
      category: categoryId !== "all" ? categoryId : undefined,
      checkIn,
      checkOut,
      adults: guestsData.adults || undefined,
      children: guestsData.children || undefined,
      pets: guestsData.pets || undefined,
      rooms: guestsData.rooms || undefined
    };
    onSearch?.(filters);
  };

  // Show skeleton loaders while translations load
  if (!isReady) {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Category tabs skeleton */}
        <div className="flex gap-2 mb-4 justify-start overflow-x-auto py-3 px-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
          ))}
        </div>
        
        {/* Search form skeleton */}
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 justify-start overflow-x-auto scrollbar-hide py-3 px-1">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === category.id
                  ? "bg-white text-[#283B73] shadow-lg scale-105"
                  : "text-white hover:bg-white/10 hover:scale-105"
              }`}
            >
              {Icon && <Icon className="w-4 h-4" style={{ color: category.color }} />}
              <span className="text-sm sm:text-base">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_auto] gap-3 md:gap-0 md:divide-x">
          {/* Location */}
          <div className="px-4 py-3">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t('search.location')}
            </label>
            <LocationAutocomplete 
              onLocationChange={handleLocationChange}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Dates */}
          <div className="px-4 py-3 relative">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t('search.when')}
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <button
                onClick={handleCalendarToggle}
                className="flex-1 text-left text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              >
                {formatDateRange() || t('search.when')}
              </button>
              {(checkIn || checkOut) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDates();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Clear dates"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Guests */}
          <div className="px-4 py-3">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t('search.guests')}
            </label>
            <GuestsInput
              isOpen={isGuestsOpen}
              onOpenChange={handleGuestsToggle}
              onGuestsChange={handleGuestsChange}
            />
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-center px-2">
            <Button
              onClick={handleSearch}
              className="bg-[#FFB400] hover:bg-[#e5a200] text-white rounded-xl w-full md:w-auto px-8 py-6 md:py-3 font-semibold transition-colors"
            >
              <Search className="w-5 h-5 mr-0 md:mr-0" />
              <span className="md:hidden ml-2">{t('search.search')}</span>
            </Button>
          </div>
        </div>

        {/* Date Range Picker */}
        <DateRangePicker
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          onSelect={handleDateSelect}
          checkIn={checkIn}
          checkOut={checkOut}
        />
      </div>
    </div>
  );
}