"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export function Step4ConfirmAddress() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();

  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step4.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step4.subtitle')}
      </p>

      <div className="space-y-5">
        <div>
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">
            {t('listingWizard.step4.country')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
            placeholder="Indonesia"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="buildingName" className="text-sm font-medium text-gray-700">
            {t('listingWizard.step4.buildingName')} {t('listingWizard.step4.buildingNameOptional')}
          </Label>
          <Input
            id="buildingName"
            value={formData.buildingName}
            onChange={(e) => handleChange("buildingName", e.target.value)}
            placeholder="Apartment Tower A"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="unitFloor" className="text-sm font-medium text-gray-700">
            {t('listingWizard.step4.unitFloor')} {t('listingWizard.step4.unitFloorOptional')}
          </Label>
          <Input
            id="unitFloor"
            value={formData.unitFloor}
            onChange={(e) => handleChange("unitFloor", e.target.value)}
            placeholder="Unit 2B, Floor 12"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">
            {t('listingWizard.step4.streetAddress')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="streetAddress"
            value={formData.streetAddress}
            onChange={(e) => handleChange("streetAddress", e.target.value)}
            placeholder="Jl. Sudirman No. 123"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="district" className="text-sm font-medium text-gray-700">
            {t('listingWizard.step4.district')} {t('listingWizard.step4.districtOptional')}
          </Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => handleChange("district", e.target.value)}
            placeholder="Menteng"
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              {t('listingWizard.step4.city')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Jakarta"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="province" className="text-sm font-medium text-gray-700">
              {t('listingWizard.step4.province')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="province"
              value={formData.province}
              onChange={(e) => handleChange("province", e.target.value)}
              placeholder="DKI Jakarta"
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
            {t('listingWizard.step4.postalCode')} {t('listingWizard.step4.postalCodeOptional')}
          </Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            placeholder="12345"
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  );
}