"use client";

import { useListingWizard, PriceRange } from "@/store/listingWizardStore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export function Step12Pricing() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();
  const [showBestDeal, setShowBestDeal] = useState(false);
  const [showPeakSeason, setShowPeakSeason] = useState(false);
  const [bestDealRange, setBestDealRange] = useState<{ start: Date | null; end: Date | null; price: string }>({
    start: null,
    end: null,
    price: "",
  });
  const [peakSeasonRange, setPeakSeasonRange] = useState<{ start: Date | null; end: Date | null; price: string }>({
    start: null,
    end: null,
    price: "",
  });

  const addBestDealRange = () => {
    if (bestDealRange.start && bestDealRange.end && bestDealRange.price) {
      const newRange: PriceRange = {
        startDate: bestDealRange.start,
        endDate: bestDealRange.end,
        price: parseFloat(bestDealRange.price),
        type: "best_deal",
      };
      updateFormData({
        bestDealRanges: [...(formData.bestDealRanges || []), newRange],
      });
      setBestDealRange({ start: null, end: null, price: "" });
    }
  };

  const addPeakSeasonRange = () => {
    if (peakSeasonRange.start && peakSeasonRange.end && peakSeasonRange.price) {
      const newRange: PriceRange = {
        startDate: peakSeasonRange.start,
        endDate: peakSeasonRange.end,
        price: parseFloat(peakSeasonRange.price),
        type: "peak_season",
      };
      updateFormData({
        peakSeasonRanges: [...(formData.peakSeasonRanges || []), newRange],
      });
      setPeakSeasonRange({ start: null, end: null, price: "" });
    }
  };

  const removeBestDealRange = (index: number) => {
    const updated = [...(formData.bestDealRanges || [])];
    updated.splice(index, 1);
    updateFormData({ bestDealRanges: updated });
  };

  const removePeakSeasonRange = (index: number) => {
    const updated = [...(formData.peakSeasonRanges || [])];
    updated.splice(index, 1);
    updateFormData({ peakSeasonRanges: updated });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('listingWizard.step12.title')}</h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step12.subtitle')}
      </p>

      <div className="space-y-8">
        {/* Base Price */}
        <div>
          <Label htmlFor="basePrice" className="text-lg font-semibold text-gray-900 mb-3 block">
            {t('listingWizard.step12.basePrice')} <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
              IDR
            </span>
            <Input
              id="basePrice"
              type="number"
              placeholder="0"
              value={formData.basePrice || ""}
              onChange={(e) => updateFormData({ basePrice: parseFloat(e.target.value) || 0 })}
              className="pl-16 py-6 text-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              / night
            </span>
          </div>
        </div>

        {/* Best Deal Section */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('listingWizard.step12.bestDeal')} {t('listingWizard.step12.bestDealOptional')}
              </h3>
              <p className="text-sm text-gray-600">{t('listingWizard.step12.bestDealDesc')}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowBestDeal(!showBestDeal)}
            >
              {showBestDeal ? "Cancel" : "+ Add Best Deal"}
            </Button>
          </div>

          {showBestDeal && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">{t('listingWizard.step12.from')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bestDealRange.start ? format(bestDealRange.start, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={bestDealRange.start || undefined}
                        onSelect={(date) => setBestDealRange({ ...bestDealRange, start: date || null })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">{t('listingWizard.step12.to')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bestDealRange.end ? format(bestDealRange.end, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={bestDealRange.end || undefined}
                        onSelect={(date) => setBestDealRange({ ...bestDealRange, end: date || null })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label className="text-sm mb-2 block">{t('listingWizard.step12.bestDealPrice')}</Label>
                <Input
                  type="number"
                  placeholder="Lower than base price"
                  value={bestDealRange.price}
                  onChange={(e) => setBestDealRange({ ...bestDealRange, price: e.target.value })}
                />
              </div>
              <Button onClick={addBestDealRange} className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('listingWizard.step12.addDateRange')}
              </Button>
            </div>
          )}

          {/* Best Deal Ranges List */}
          {formData.bestDealRanges && formData.bestDealRanges.length > 0 && (
            <div className="space-y-2">
              {formData.bestDealRanges.map((range, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      {format(range.startDate, "MMM dd, yyyy")} - {format(range.endDate, "MMM dd, yyyy")}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm font-semibold text-blue-600">
                      IDR {range.price.toLocaleString()}/night
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBestDealRange(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Peak Season Section */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('listingWizard.step12.peakSeason')} {t('listingWizard.step12.peakSeasonOptional')}
              </h3>
              <p className="text-sm text-gray-600">{t('listingWizard.step12.peakSeasonDesc')}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPeakSeason(!showPeakSeason)}
            >
              {showPeakSeason ? "Cancel" : "+ Add Peak Season"}
            </Button>
          </div>

          {showPeakSeason && (
            <div className="bg-orange-50 p-4 rounded-lg space-y-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">{t('listingWizard.step12.from')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {peakSeasonRange.start ? format(peakSeasonRange.start, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={peakSeasonRange.start || undefined}
                        onSelect={(date) => setPeakSeasonRange({ ...peakSeasonRange, start: date || null })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">{t('listingWizard.step12.to')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {peakSeasonRange.end ? format(peakSeasonRange.end, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={peakSeasonRange.end || undefined}
                        onSelect={(date) => setPeakSeasonRange({ ...peakSeasonRange, end: date || null })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label className="text-sm mb-2 block">{t('listingWizard.step12.peakSeasonPrice')}</Label>
                <Input
                  type="number"
                  placeholder="Higher than base price"
                  value={peakSeasonRange.price}
                  onChange={(e) => setPeakSeasonRange({ ...peakSeasonRange, price: e.target.value })}
                />
              </div>
              <Button onClick={addPeakSeasonRange} className="w-full bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('listingWizard.step12.addDateRange')}
              </Button>
            </div>
          )}

          {/* Peak Season Ranges List */}
          {formData.peakSeasonRanges && formData.peakSeasonRanges.length > 0 && (
            <div className="space-y-2">
              {formData.peakSeasonRanges.map((range, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      {format(range.startDate, "MMM dd, yyyy")} - {format(range.endDate, "MMM dd, yyyy")}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm font-semibold text-orange-600">
                      IDR {range.price.toLocaleString()}/night
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePeakSeasonRange(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}