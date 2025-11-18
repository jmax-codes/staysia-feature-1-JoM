"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { useTranslation } from "react-i18next";

const categories = [
  { id: "house", label: "house", icon: "🏠" },
  { id: "villa", label: "villa", icon: "🏡" },
  { id: "apartment", label: "apartment", icon: "🏢" },
  { id: "hotel", label: "hotel", icon: "🏨" },
  { id: "condo", label: "condo", icon: "🏘️" },
  { id: "penthouse", label: "penthouse", icon: "🏙️" },
];

export function Step1Category() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();

  const handleSelect = (categoryId: string) => {
    updateFormData({ propertyCategory: categoryId });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step1.title')}
      </h2>
      <p className="text-gray-600 mb-8">{t('listingWizard.step1.subtitle')}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleSelect(category.id)}
            className={`p-6 rounded-xl border-2 transition-all hover:border-[#283B73] hover:shadow-md ${
              formData.propertyCategory === category.id
                ? "border-[#283B73] bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="text-5xl mb-3">{category.icon}</div>
            <div className="font-semibold text-gray-900">{t(`listingWizard.step1.${category.label}`)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}