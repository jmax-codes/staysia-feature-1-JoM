"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { User, Users, UserCircle, Bed } from "lucide-react";
import { useTranslation } from "react-i18next";

const whoElseOptions = [
  { id: "me", label: "aloneAtProperty", icon: "👤" },
  { id: "family", label: "familyPresent", icon: "👨‍👩‍👧‍👦" },
  { id: "guests", label: "otherGuestsPresent", icon: "👥" },
  { id: "pets", label: "petsPresent", icon: "🐕" },
];

export function Step7WhoElse() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();

  const toggleOption = (optionId: string) => {
    const current = formData.whoElse || [];
    const updated = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    updateFormData({ whoElse: updated });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step7.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step7.subtitle')}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {whoElseOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`p-6 rounded-xl border-2 transition-all hover:border-[#283B73] hover:shadow-md ${
              formData.whoElse?.includes(option.id)
                ? "border-[#283B73] bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="text-4xl mb-3">{option.icon}</div>
            <div className="font-semibold text-gray-900">{t(`listingWizard.step7.${option.label}`)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}