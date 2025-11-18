"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { useTranslation } from "react-i18next";

export function Step2PlaceType() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();

  const placeTypes = [
    {
      id: "entire" as const,
      title: t('listingWizard.step2.entirePlace'),
      description: t('listingWizard.step2.entirePlaceDesc'),
      icon: "🏡",
    },
    {
      id: "room" as const,
      title: t('listingWizard.step2.room'),
      description: t('listingWizard.step2.roomDesc'),
      icon: "🚪",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step2.title')}
      </h2>
      <p className="text-gray-600 mb-8">{t('listingWizard.step2.subtitle')}</p>

      <div className="space-y-4">
        {placeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => updateFormData({ placeType: type.id })}
            className={`w-full p-6 rounded-xl border-2 transition-all hover:border-[#283B73] hover:shadow-md text-left flex items-start gap-4 ${
              formData.placeType === type.id
                ? "border-[#283B73] bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="text-4xl mt-1">{type.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{type.title}</h3>
              <p className="text-gray-600">{type.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}