"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";

interface LocationSuggestion {
  formatted: string;
  city?: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
}

interface LocationAutocompleteProps {
  onLocationChange?: (location: string) => void;
  onLocationSelect?: (location: LocationSuggestion) => void;
}

export function LocationAutocomplete({ onLocationChange, onLocationSelect }: LocationAutocompleteProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 300);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with Indonesia priority
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue.trim() || debouncedValue.length < 2) {
        setSuggestions([]);
        setError(null);
        setIsLoading(false);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Step 1: Search with Indonesia priority (countrycodes=id)
        const indonesiaUrl = `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(debouncedValue)}` +
          `&format=json` +
          `&addressdetails=1` +
          `&limit=8` +
          `&countrycodes=id` + // Prioritize Indonesia
          `&featuretype=city` +
          `&accept-language=en`;
        
        const indonesiaResponse = await fetch(indonesiaUrl, {
          headers: {
            'User-Agent': 'Staysia-PropertyRental/1.0'
          }
        });

        let indonesianResults: any[] = [];
        if (indonesiaResponse.ok) {
          indonesianResults = await indonesiaResponse.json();
        }

        // Step 2: If no Indonesian results, fallback to global search
        let globalResults: any[] = [];
        if (indonesianResults.length === 0) {
          const globalUrl = `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(debouncedValue)}` +
            `&format=json` +
            `&addressdetails=1` +
            `&limit=8` +
            `&featuretype=city` +
            `&accept-language=en`;
          
          const globalResponse = await fetch(globalUrl, {
            headers: {
              'User-Agent': 'Staysia-PropertyRental/1.0'
            }
          });

          if (globalResponse.ok) {
            globalResults = await globalResponse.json();
          }
        }

        // Combine results (Indonesian first, then global)
        const allResults = [...indonesianResults, ...globalResults];
        
        if (allResults.length === 0) {
          setSuggestions([]);
          setError(null);
          setShowSuggestions(true);
        } else {
          // Format and deduplicate suggestions
          const formattedSuggestions: LocationSuggestion[] = allResults
            .map((item: any) => {
              const address = item.address || {};
              const city = address.city || address.town || address.village || address.municipality || address.county;
              const state = address.state || address.region;
              const country = address.country;

              // Create a formatted display name
              const parts = [city, state, country].filter(Boolean);
              const formatted = parts.join(", ");

              return {
                formatted: formatted || item.display_name,
                city: city || item.display_name.split(",")[0],
                state: state,
                country: country,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
              };
            })
            // Remove duplicates based on city name
            .filter((suggestion: LocationSuggestion, index: number, self: LocationSuggestion[]) => 
              index === self.findIndex((s) => s.city === suggestion.city && s.country === suggestion.country)
            )
            // Limit to 8 results
            .slice(0, 8);

          setSuggestions(formattedSuggestions);
          setError(null);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Error fetching location suggestions:", err);
        setSuggestions([]);
        setError(null);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onLocationChange?.(value);
    setShowSuggestions(true);
    setError(null);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const cityName = suggestion.city || suggestion.formatted;
    setInputValue(cityName);
    onLocationChange?.(cityName);
    onLocationSelect?.(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setError(null);
  };

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0 || error) {
              setShowSuggestions(true);
            }
          }}
          placeholder={t('search.searchDestinations')}
          className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
        {isLoading && (
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.lat}-${suggestion.lon}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-[#FFB400] mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.city || suggestion.formatted}
                </p>
                {(suggestion.state || suggestion.country) && (
                  <p className="text-xs text-gray-500 truncate">
                    {[suggestion.state, suggestion.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {showSuggestions && !isLoading && debouncedValue.length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999]">
          <div className="px-4 py-6 text-center">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {t('components.locationAutocomplete.noSuggestionsFound')}
            </p>
            <p className="text-xs text-gray-500">
              {t('components.locationAutocomplete.tryNearbyCity')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}