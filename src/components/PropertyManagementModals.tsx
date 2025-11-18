"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

// Edit Property Modal
interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  onSuccess: () => void;
}

export function EditPropertyModal({ isOpen, onClose, property, onSuccess }: EditPropertyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    area: "",
    type: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    maxGuests: 0,
    address: "",
    checkInTime: "",
    checkOutTime: "",
    petsAllowed: false,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || "",
        description: property.description || "",
        city: property.city || "",
        area: property.area || "",
        type: property.type || "",
        price: property.price || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        maxGuests: property.maxGuests || 0,
        address: property.address || "",
        checkInTime: property.checkInTime || "",
        checkOutTime: property.checkOutTime || "",
        petsAllowed: property.petsAllowed || false,
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/tenant/properties/${property.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update property");
      }

      toast.success("Property updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                required
              >
                <option value="">Select Type</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Hotel">Hotel</option>
                <option value="Condo">Condo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area *
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Guests *
              </label>
              <input
                type="number"
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Time
              </label>
              <input
                type="time"
                value={formData.checkInTime}
                onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Time
              </label>
              <input
                type="time"
                value={formData.checkOutTime}
                onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="petsAllowed"
              checked={formData.petsAllowed}
              onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.checked })}
              className="w-4 h-4 text-[#283B73] border-gray-300 rounded focus:ring-[#283B73]"
            />
            <label htmlFor="petsAllowed" className="text-sm font-medium text-gray-700">
              Pets Allowed
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#283B73] text-white font-medium rounded-lg hover:bg-[#1f2d57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Manage Rooms Modal
interface ManageRoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  onSuccess: () => void;
}

export function ManageRoomsModal({ isOpen, onClose, propertyId, onSuccess }: ManageRoomsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    if (isOpen && propertyId) {
      fetchRooms();
    }
  }, [isOpen, propertyId]);

  const fetchRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/tenant/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        name: "",
        type: "",
        pricePerNight: 0,
        maxGuests: 1,
        available: true,
      },
    ]);
  };

  const handleUpdateRoom = (index: number, field: string, value: any) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
  };

  const handleRemoveRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/tenant/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rooms }),
      });

      if (!response.ok) {
        throw new Error("Failed to update rooms");
      }

      toast.success("Rooms updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating rooms:", error);
      toast.error("Failed to update rooms");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Manage Rooms</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {isLoadingRooms ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#283B73]" />
            </div>
          ) : (
            <>
              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No rooms added yet</p>
                  <button
                    type="button"
                    onClick={handleAddRoom}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#283B73] text-white font-medium rounded-lg hover:bg-[#1f2d57] transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add First Room
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Room {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveRoom(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Room Name *
                          </label>
                          <input
                            type="text"
                            value={room.name}
                            onChange={(e) => handleUpdateRoom(index, "name", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Room Type *
                          </label>
                          <input
                            type="text"
                            value={room.type}
                            onChange={(e) => handleUpdateRoom(index, "type", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                            placeholder="e.g., Deluxe, Standard, Suite"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price per Night *
                          </label>
                          <input
                            type="number"
                            value={room.pricePerNight}
                            onChange={(e) => handleUpdateRoom(index, "pricePerNight", parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                            required
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Guests *
                          </label>
                          <input
                            type="number"
                            value={room.maxGuests}
                            onChange={(e) => handleUpdateRoom(index, "maxGuests", parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
                            required
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`available-${index}`}
                          checked={room.available}
                          onChange={(e) => handleUpdateRoom(index, "available", e.target.checked)}
                          className="w-4 h-4 text-[#283B73] border-gray-300 rounded focus:ring-[#283B73]"
                        />
                        <label htmlFor={`available-${index}`} className="text-sm font-medium text-gray-700">
                          Available for Booking
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddRoom}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 text-gray-700 font-medium rounded-lg hover:border-[#283B73] hover:text-[#283B73] transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add Another Room
                  </button>
                </div>
              )}
            </>
          )}

          {!isLoadingRooms && rooms.length > 0 && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-[#283B73] text-white font-medium rounded-lg hover:bg-[#1f2d57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Rooms"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Manage Pricing Modal
interface ManagePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  propertyName: string;
  basePrice: number;
  onSuccess: () => void;
}

export function ManagePricingModal({ isOpen, onClose, propertyId, propertyName, basePrice, onSuccess }: ManagePricingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pricingMode, setPricingMode] = useState<"bestDeal" | "peakSeason">("bestDeal");
  const [bestDealPrice, setBestDealPrice] = useState(0);
  const [peakSeasonData, setPeakSeasonData] = useState({
    startDate: "",
    endDate: "",
    increaseType: "percentage" as "percentage" | "nominal",
    increaseValue: 0,
  });

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
                      onChange={(e) => setPeakSeasonData({ ...peakSeasonData, increaseType: "percentage" })}
                      className="w-4 h-4 text-[#283B73] border-gray-300 focus:ring-[#283B73]"
                    />
                    <span className="text-sm text-gray-700">Percentage (%)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="nominal"
                      checked={peakSeasonData.increaseType === "nominal"}
                      onChange={(e) => setPeakSeasonData({ ...peakSeasonData, increaseType: "nominal" })}
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
                      ${(
                        peakSeasonData.increaseType === "percentage"
                          ? basePrice + (basePrice * peakSeasonData.increaseValue / 100)
                          : basePrice + peakSeasonData.increaseValue
                      ).toLocaleString()}
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
}
