"use client";

import { useListingWizard, RoomHighlight } from "@/store/listingWizardStore";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

const inRoomOptions = [
  { id: "king_bed", label: "kingBed", icon: "🛏️" },
  { id: "sofa", label: "sofa", icon: "🛋️" },
  { id: "tv", label: "tv", icon: "📺" },
  { id: "desk", label: "desk", icon: "🪑" },
  { id: "wardrobe", label: "wardrobe", icon: "👔" },
  { id: "ac", label: "ac", icon: "❄️" },
  { id: "minibar", label: "minibar", icon: "🍷" },
  { id: "kettle", label: "kettle", icon: "☕" },
];

const bathroomOptions = [
  { id: "shower", label: "shower", icon: "🚿" },
  { id: "hot_water", label: "hotWater", icon: "💧" },
  { id: "toiletries", label: "toiletries", icon: "🧴" },
  { id: "hairdryer", label: "hairdryer", icon: "💨" },
  { id: "towels", label: "towels", icon: "🧺" },
];

const featuresOptions = [
  { id: "balcony", label: "balcony", icon: "🌅" },
  { id: "view", label: "view", icon: "🏞️" },
  { id: "windows", label: "windows", icon: "🪟" },
];

const technologyOptions = [
  { id: "wifi", label: "wifi", icon: "📶" },
  { id: "outlets", label: "outlets", icon: "🔌" },
  { id: "smart_tv", label: "smartTv", icon: "📱" },
  { id: "speaker", label: "speaker", icon: "🔊" },
];

const servicesOptions = [
  { id: "room_service", label: "roomService", icon: "🍽️" },
  { id: "housekeeping", label: "housekeeping", icon: "🧹" },
  { id: "laundry", label: "laundry", icon: "🧺" },
];

export function Step6RoomHighlights() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();
  const [currentRoom, setCurrentRoom] = useState(1);

  // Initialize room highlights when bedrooms count changes
  useEffect(() => {
    const roomCount = formData.bedrooms;
    const currentHighlights = formData.roomHighlights || [];
    
    if (currentHighlights.length !== roomCount) {
      const newHighlights: RoomHighlight[] = [];
      for (let i = 0; i < roomCount; i++) {
        newHighlights.push(
          currentHighlights[i] || {
            roomNumber: i + 1,
            inRoomAmenities: [],
            customInRoomAmenities: "",
            bathroomFacilities: [],
            customBathroomFacilities: "",
            additionalFeatures: [],
            customAdditionalFeatures: "",
            technologyComfort: [],
            customTechnologyComfort: "",
            extraServices: [],
          }
        );
      }
      updateFormData({ roomHighlights: newHighlights });
    }
  }, [formData.bedrooms]);

  const currentRoomData = formData.roomHighlights?.[currentRoom - 1] || {
    roomNumber: currentRoom,
    inRoomAmenities: [],
    customInRoomAmenities: "",
    bathroomFacilities: [],
    customBathroomFacilities: "",
    additionalFeatures: [],
    customAdditionalFeatures: "",
    technologyComfort: [],
    customTechnologyComfort: "",
    extraServices: [],
  };

  const updateRoomData = (updates: Partial<RoomHighlight>) => {
    const newHighlights = [...(formData.roomHighlights || [])];
    newHighlights[currentRoom - 1] = { ...currentRoomData, ...updates };
    updateFormData({ roomHighlights: newHighlights });
  };

  const toggleOption = (category: keyof RoomHighlight, optionId: string) => {
    const currentArray = currentRoomData[category] as string[];
    const newArray = currentArray.includes(optionId)
      ? currentArray.filter((id) => id !== optionId)
      : [...currentArray, optionId];
    updateRoomData({ [category]: newArray });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('listingWizard.step6.title')}</h2>
      <p className="text-gray-600 mb-6">
        {t('listingWizard.step6.subtitle')}
      </p>

      {/* Room Selector */}
      {formData.bedrooms > 1 && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {Array.from({ length: formData.bedrooms }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentRoom(index + 1)}
              className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                currentRoom === index + 1
                  ? "bg-[#283B73] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t('listingWizard.step6.room', { number: index + 1 })}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-8">
        {/* In-Room Amenities */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🛏️ {t('listingWizard.step6.inRoomAmenities')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            {inRoomOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption("inRoomAmenities", option.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  currentRoomData.inRoomAmenities.includes(option.id)
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium text-gray-900">{t(`listingWizard.step6.amenityOptions.${option.label}`)}</div>
              </button>
            ))}
          </div>
          <Input
            placeholder={t('listingWizard.step6.placeholders.otherAmenities')}
            value={currentRoomData.customInRoomAmenities}
            onChange={(e) =>
              updateRoomData({ customInRoomAmenities: e.target.value })
            }
            className="mt-2"
          />
        </div>

        {/* Bathroom Facilities */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🚿 {t('listingWizard.step6.bathroomFacilities')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            {bathroomOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption("bathroomFacilities", option.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  currentRoomData.bathroomFacilities.includes(option.id)
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium text-gray-900">{t(`listingWizard.step6.amenityOptions.${option.label}`)}</div>
              </button>
            ))}
          </div>
          <Input
            placeholder={t('listingWizard.step6.placeholders.otherBathroom')}
            value={currentRoomData.customBathroomFacilities}
            onChange={(e) =>
              updateRoomData({ customBathroomFacilities: e.target.value })
            }
            className="mt-2"
          />
        </div>

        {/* Additional Features */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🌅 {t('listingWizard.step6.additionalFeatures')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            {featuresOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption("additionalFeatures", option.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  currentRoomData.additionalFeatures.includes(option.id)
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium text-gray-900">{t(`listingWizard.step6.amenityOptions.${option.label}`)}</div>
              </button>
            ))}
          </div>
          <Input
            placeholder={t('listingWizard.step6.placeholders.otherFeatures')}
            value={currentRoomData.customAdditionalFeatures}
            onChange={(e) =>
              updateRoomData({ customAdditionalFeatures: e.target.value })
            }
            className="mt-2"
          />
        </div>

        {/* Technology & Comfort */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💻 {t('listingWizard.step6.technologyComfort')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            {technologyOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption("technologyComfort", option.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  currentRoomData.technologyComfort.includes(option.id)
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium text-gray-900">{t(`listingWizard.step6.amenityOptions.${option.label}`)}</div>
              </button>
            ))}
          </div>
          <Input
            placeholder={t('listingWizard.step6.placeholders.otherTechnology')}
            value={currentRoomData.customTechnologyComfort}
            onChange={(e) =>
              updateRoomData({ customTechnologyComfort: e.target.value })
            }
            className="mt-2"
          />
        </div>

        {/* Extra Services */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🧺 {t('listingWizard.step6.extraServices')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {servicesOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption("extraServices", option.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  currentRoomData.extraServices.includes(option.id)
                    ? "border-[#283B73] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium text-gray-900">{t(`listingWizard.step6.amenityOptions.${option.label}`)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}