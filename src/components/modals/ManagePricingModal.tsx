"use client";

import { useState } from "react";
import { X, Loader2, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

/**
 * Props for the Manage Pricing Modal component.
 */
interface ManagePricingModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** ID of the property to manage pricing for */
  propertyId: number;
  /** Name of the property */
  propertyName: string;
  /** Base price per night for the property */
  basePrice: number;
  /** Callback function called after successful pricing update */
  onSuccess: () => void;
}

/**
 * Pricing mode type - either best deal or peak season.
 */
type PricingMode = "bestDeal" | "peakSeason";

/**
 * Increase type for peak season pricing.
 */
type IncreaseType = "percentage" | "nominal";

/**
 * Modal component for managing property pricing.
 * Allows tenant users to set best deal prices (discounts) or peak season rates.
 * 
 * @component
 * @param props - Component props
 * @returns Rendered modal dialog for managing pricing
 * 
 * @example
 * ```tsx
 * <ManagePricingModal
 *   isOpen={showPricingModal}
 *   onClose={() => setShowPricingModal(false)}
 *   propertyId={property.id}
 *   propertyName={property.name}
 *   basePrice={property.price}
 *   onSuccess={refetchProperty}
 * />
 * ```
 */
export const ManagePricingModal = ({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  basePrice,
  onSuccess,
}: ManagePricingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pricingMode, setPricingMode] = useState<PricingMode>("bestDeal");
  const [bestDealPrice, setBestDealPrice] = useState(0);
  const [peakSeasonData, setPeakSeasonData] = useState({
    startDate: "",
    endDate: "",
    increaseType: "percentage" as IncreaseType,
    increaseValue: 0,
  });

  /**
   * Handles submission of best deal pricing.
   * Updates property base price with discounted rate.
   */
  const handleSubmitBestDeal = async () => {
    if (bestDealPrice >= basePrice) {
      toast.error("Best deal price must be lower than base price");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/tenant/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: bestDealPrice }),
      });

      if (!response.ok) {
        throw new Error("Failed to update best deal price");
      }

      toast.success("Best deal price updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles submission of peak season rates.
   * Creates a new peak season rate for the specified date range.
   */
  const handleSubmitPeakSeason = async () => {
    if (!peakSeasonData.startDate || !peakSeasonData.endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (peakSeasonData.increaseValue <= 0) {
      toast.error("Increase value must be greater than 0");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/peak-season-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          startDate: peakSeasonData.startDate,
          endDate: peakSeasonData.endDate,
          increaseType: peakSeasonData.increaseType,
          increaseValue: peakSeasonData.increaseValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create peak season rate");
      }

      toast.success("Peak season rate created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating peak season rate:", error);
      toast.error("Failed to create peak season rate");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calculates the peak season price based on increase type and value.
   * 
   * @returns Calculated peak season price
   */
  const calculatePeakPrice = (): number => {
    if (peakSeasonData.increaseType === "percentage") {
      return basePrice + (basePrice * peakSeasonData.increaseValue / 100);
    }
    return basePrice + peakSeasonData.increaseValue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Pricing</h2>
            <p className="text-sm text-gray-600 mt-1">{propertyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Base Price Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Base Price per Night</span>
              <span className="text-2xl font-bold text-gray-900">${basePrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Pricing Mode Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setPricingMode("bestDeal")}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                pricingMode === "bestDeal"
                  ? "text-[#283B73] border-b-2 border-[#283B73]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <DollarSign className="h-5 w-5 inline-block mr-2" />
              Best Deal
            </button>
            <button
              type="button"
              onClick={() => setPricingMode("peakSeason")}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                pricingMode === "peakSeason"
                  ? "text-[#283B73] border-b-2 border-[#283B73]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar className="h-5 w-5 inline-block mr-2" />
              Peak Season
            </button>
          </div>

          {/* Best Deal Form */}
          {pricingMode === "bestDeal" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  Set a special discounted price that's lower than your base price to attract more bookings.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Deal Price (Must be less than ${basePrice})
                </label>
                <input
                  type="number"
                  value={bestDealPrice}
                  onChange={(e) => setBestDealPrice(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                  min="0"
                  max={basePrice - 1}
                  placeholder="Enter discounted price"
                />
              </div>

              {bestDealPrice > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Discount Amount</span>
                    <span className="text-lg font-bold text-green-700">
                      ${(basePrice - bestDealPrice).toLocaleString()} 
                      ({(((basePrice - bestDealPrice) / basePrice) * 100).toFixed(1)}% off)
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitBestDeal}
                disabled={isLoading || bestDealPrice <= 0 || bestDealPrice >= basePrice}
                className="w-full px-6 py-3 bg-[#283B73] text-white font-medium rounded-lg hover:bg-[#1f2d57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Apply Best Deal Price"
                )}
              </button>
            </div>
          )}

          {/* Peak Season Form */}
          {pricingMode === "peakSeason" && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  Mark specific dates for higher rates during high-demand periods like holidays or events.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={peakSeasonData.startDate}
                    onChange={(e) => setPeakSeasonData({ ...peakSeasonData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={peakSeasonData.endDate}
                    onChange={(e) => setPeakSeasonData({ ...peakSeasonData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                    min={peakSeasonData.startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Increase Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="percentage"
                      checked={peakSeasonData.increaseType === "percentage"}
                      onChange={() => setPeakSeasonData({ ...peakSeasonData, increaseType: "percentage" })}
                      className="w-4 h-4 text-[#283B73] border-gray-300 focus:ring-[#283B73]"
                    />
                    <span className="text-sm text-gray-700">Percentage (%)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="nominal"
                      checked={peakSeasonData.increaseType === "nominal"}
                      onChange={() => setPeakSeasonData({ ...peakSeasonData, increaseType: "nominal" })}
                      className="w-4 h-4 text-[#283B73] border-gray-300 focus:ring-[#283B73]"
                    />
                    <span className="text-sm text-gray-700">Nominal ($)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Increase Value *
                </label>
                <input
                  type="number"
                  value={peakSeasonData.increaseValue}
                  onChange={(e) => setPeakSeasonData({ ...peakSeasonData, increaseValue: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                  min="0"
                  placeholder={peakSeasonData.increaseType === "percentage" ? "e.g., 20" : "e.g., 50"}
                />
              </div>

              {peakSeasonData.increaseValue > 0 && (
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Peak Season Price</span>
                    <span className="text-lg font-bold text-amber-700">
                      ${calculatePeakPrice().toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitPeakSeason}
                disabled={isLoading || !peakSeasonData.startDate || !peakSeasonData.endDate || peakSeasonData.increaseValue <= 0}
                className="w-full px-6 py-3 bg-[#283B73] text-white font-medium rounded-lg hover:bg-[#1f2d57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Peak Season Rate"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
