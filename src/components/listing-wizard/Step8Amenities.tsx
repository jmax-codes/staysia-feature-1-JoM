"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { Input } from "@/components/ui/input";
import { Wifi, Tv, UtensilsCrossed, Waves, CarFront, Snowflake, Droplets, Laptop, ShieldAlert, Package, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

const amenitiesOptions = [
  { id: "wifi", label: "wifi", icon: "📶" },
  { id: "tv", label: "tv", icon: "📺" },
  { id: "kitchen", label: "kitchen", icon: "🍳" },
  { id: "washer", label: "washingMachine", icon: "🧺" },
  { id: "ac", label: "airConditioning", icon: "❄️" },
  { id: "hot_shower", label: "hotShower", icon: "🚿" },
  { id: "workspace", label: "dedicatedWorkspace", icon: "💻" },
];

const safetyOptions = [
  { id: "smoke_alarm", label: "smokeAlarm", icon: "🚨" },
  { id: "first_aid", label: "firstAid", icon: "🩹" },
  { id: "fire_extinguisher", label: "fireExtinguisher", icon: "🧯" },
];

export function Step8Amenities() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();

  const toggleAmenity = (amenityId: string) => {
    const current = formData.amenities || [];
    const updated = current.includes(amenityId)
      ? current.filter((id) => id !== amenityId)
      : [...current, amenityId];
    updateFormData({ amenities: updated });
  };

  const toggleSafety = (safetyId: string) => {
    const current = formData.safetyItems || [];
    const updated = current.includes(safetyId)
      ? current.filter((id) => id !== safetyId)
      : [...current, safetyId];
    updateFormData({ safetyItems: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step8.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step8.subtitle')}
      </p>

      <div className="space-y-8">
        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('listingWizard.step8.generalAmenities')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {amenitiesOptions.map((amenity) => (
              <button
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.amenities?.includes(amenity.id)
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{amenity.icon}</div>
                <div className="text-sm font-medium text-gray-900">
                  {t(`listingWizard.step8.${amenity.label}`)}
                </div>
              </button>
            ))}
          </div>

          {/* Parking Options */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('listingWizard.step8.parking')}</h4>
            <div className="flex gap-3">
              <button
                onClick={() => updateFormData({ parkingType: "free" })}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.parkingType === "free"
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">🅿️</div>
                <div className="text-sm font-medium text-gray-900">{t('listingWizard.step8.freeParking')}</div>
              </button>
              <button
                onClick={() => updateFormData({ parkingType: "paid" })}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.parkingType === "paid"
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="text-sm font-medium text-gray-900">{t('listingWizard.step8.paidParking')}</div>
              </button>
            </div>
          </div>

          <Input
            placeholder={t('listingWizard.step8.placeholders.otherAmenities')}
            value={formData.customAmenities}
            onChange={(e) => updateFormData({ customAmenities: e.target.value })}
          />
        </div>

        {/* Safety Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('listingWizard.step8.safetyItems')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {safetyOptions.map((safety) => (
              <button
                key={safety.id}
                onClick={() => toggleSafety(safety.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.safetyItems?.includes(safety.id)
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{safety.icon}</div>
                <div className="text-sm font-medium text-gray-900">{t(`listingWizard.step8.safetyOptions.${safety.label}`)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}