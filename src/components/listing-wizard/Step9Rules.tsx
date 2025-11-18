"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { Textarea } from "@/components/ui/textarea";
import { CigaretteOff, Wind } from "lucide-react";
import { useTranslation } from "react-i18next";

const rulesOptions = [
  { id: "no_smoking", label: "noSmoking", icon: "🚭" },
  { id: "no_vaping", label: "No vaping", icon: "💨" },
  { id: "no_pets", label: "noPets", icon: "🚫🐕" },
  { id: "no_parties", label: "noParties", icon: "🎉" },
  { id: "quiet_hours", label: "quietHours", icon: "🤫" },
  { id: "no_visitors", label: "No unregistered visitors", icon: "🚷" },
];

export function Step9Rules() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();

  const toggleRule = (ruleId: string) => {
    const current = formData.propertyRules || [];
    const updated = current.includes(ruleId)
      ? current.filter((id) => id !== ruleId)
      : [...current, ruleId];
    updateFormData({ propertyRules: updated });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step9.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step9.subtitle')}
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {rulesOptions.map((rule) => (
            <button
              key={rule.id}
              onClick={() => toggleRule(rule.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.propertyRules?.includes(rule.id)
                  ? "border-[#283B73] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{rule.icon}</div>
              <div className="text-sm font-medium text-gray-900">
                {rule.label.startsWith('listingWizard') ? rule.label : (rule.label.includes('no') || rule.label.includes('quiet') ? t(`listingWizard.step9.${rule.label}`) : rule.label)}
              </div>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional rules (optional)
          </label>
          <Textarea
            placeholder="Add any other house rules..."
            value={formData.customRules}
            onChange={(e) => updateFormData({ customRules: e.target.value })}
            rows={4}
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
}