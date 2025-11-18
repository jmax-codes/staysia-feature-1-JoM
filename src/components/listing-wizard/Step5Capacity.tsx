"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { Minus, Plus, Users, Bed, DoorClosed, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function Step5Capacity() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();

  const handleIncrement = (field: "guests" | "bedrooms" | "beds") => {
    updateFormData({ [field]: formData[field] + 1 });
  };

  const handleDecrement = (field: "guests" | "bedrooms" | "beds") => {
    if (formData[field] > 1) {
      updateFormData({ [field]: formData[field] - 1 });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step5.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step5.subtitle')}
      </p>

      <div className="space-y-6">
        {/* Guests */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-600" />
            <span className="text-lg font-medium text-gray-900">{t('listingWizard.step5.guests')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleDecrement("guests")}
              disabled={formData.guests <= 1}
              className="rounded-full border-2"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center text-lg font-semibold">
              {formData.guests}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleIncrement("guests")}
              className="rounded-full border-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <DoorClosed className="w-6 h-6 text-gray-600" />
            <span className="text-lg font-medium text-gray-900">{t('listingWizard.step5.bedrooms')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleDecrement("bedrooms")}
              disabled={formData.bedrooms <= 1}
              className="rounded-full border-2"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center text-lg font-semibold">
              {formData.bedrooms}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleIncrement("bedrooms")}
              className="rounded-full border-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Beds */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Bed className="w-6 h-6 text-gray-600" />
            <span className="text-lg font-medium text-gray-900">{t('listingWizard.step5.beds')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleDecrement("beds")}
              disabled={formData.beds <= 1}
              className="rounded-full border-2"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center text-lg font-semibold">
              {formData.beds}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleIncrement("beds")}
              className="rounded-full border-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bedroom Locks */}
        <div className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {t('listingWizard.step5.bedroomsHaveLocks')}
          </h3>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={formData.bedroomLocks === true ? "default" : "outline"}
              onClick={() => updateFormData({ bedroomLocks: true })}
              className={`flex-1 py-6 ${
                formData.bedroomLocks === true
                  ? "bg-[#283B73] hover:bg-[#1e2d5a]"
                  : ""
              }`}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={formData.bedroomLocks === false ? "default" : "outline"}
              onClick={() => updateFormData({ bedroomLocks: false })}
              className={`flex-1 py-6 ${
                formData.bedroomLocks === false
                  ? "bg-[#283B73] hover:bg-[#1e2d5a]"
                  : ""
              }`}
            >
              No
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}