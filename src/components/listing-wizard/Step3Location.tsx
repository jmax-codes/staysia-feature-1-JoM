"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

// Dynamically import map to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export function Step3Location() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();
  const [searchQuery, setSearchQuery] = useState(formData.locationSearch);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchLocation = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    updateFormData({
      locationSearch: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    });
    setSearchQuery(result.display_name);
    setShowResults(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step3.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step3.subtitle')}
      </p>

      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              placeholder={t('listingWizard.step3.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#283B73] focus:outline-none text-gray-900"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 last:border-0"
                >
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-900">{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Display */}
        {formData.latitude && formData.longitude && (
          <div className="h-96 rounded-xl overflow-hidden border-2 border-gray-200">
            <MapContainer
              center={[formData.latitude, formData.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[formData.latitude, formData.longitude]} />
            </MapContainer>
          </div>
        )}

        {!formData.latitude && (
          <div className="h-96 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('listingWizard.step3.mapPlaceholder')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}