"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export function Step11Description() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step11.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step11.subtitle')}
      </p>

      <div className="space-y-6">
        {/* Bio */}
        <div>
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-2 block">
            {t('listingWizard.step11.yourBio')} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="bio"
            placeholder={t('listingWizard.step11.bioPlaceholder')}
            value={formData.bio}
            onChange={(e) => updateFormData({ bio: e.target.value })}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps guests get to know you as a host.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-2 block">
            {t('listingWizard.step11.phoneNumber')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder={t('listingWizard.step11.phoneNumberPlaceholder')}
            value={formData.phoneNumber}
            onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">
            Guests will use this to contact you about their booking.
          </p>
        </div>

        {/* Special Description */}
        <div>
          <Label htmlFor="specialDescription" className="text-sm font-medium text-gray-700 mb-2 block">
            {t('listingWizard.step11.propertyDescription')} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="specialDescription"
            placeholder={t('listingWizard.step11.propertyDescriptionPlaceholder')}
            value={formData.specialDescription}
            onChange={(e) => updateFormData({ specialDescription: e.target.value })}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 50 characters. Be descriptive and highlight what makes your property unique!
          </p>
        </div>

        {/* Character Count */}
        {formData.specialDescription && (
          <div className="text-right">
            <span className={`text-sm ${
              formData.specialDescription.length >= 50 
                ? "text-green-600" 
                : "text-orange-600"
            }`}>
              {formData.specialDescription.length} / 50 characters
            </span>
          </div>
        )}
      </div>
    </div>
  );
}