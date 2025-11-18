"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Props for the Manage Rooms Modal component.
 */
interface ManageRoomsModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** ID of the property to manage rooms for */
  propertyId: number;
  /** Callback function called after successful rooms update */
  onSuccess: () => void;
}

/**
 * Room data structure for room management.
 */
interface Room {
  id?: number;
  name: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
  available: boolean;
}

/**
 * Modal component for managing property rooms.
 * Allows tenant users to add, edit, and remove rooms for their property.
 * 
 * @component
 * @param props - Component props
 * @returns Rendered modal dialog for managing rooms
 * 
 * @example
 * ```tsx
 * <ManageRoomsModal
 *   isOpen={showRoomsModal}
 *   onClose={() => setShowRoomsModal(false)}
 *   propertyId={property.id}
 *   onSuccess={refetchProperty}
 * />
 * ```
 */
export const ManageRoomsModal = ({ isOpen, onClose, propertyId, onSuccess }: ManageRoomsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    if (isOpen && propertyId) {
      fetchRooms();
    }
  }, [isOpen, propertyId]);

  /**
   * Fetches existing rooms for the property from the API.
   */
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

  /**
   * Adds a new empty room to the list.
   */
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

  /**
   * Updates a specific field of a room.
   * 
   * @param index - Index of the room in the array
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handleUpdateRoom = (index: number, field: string, value: any) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
  };

  /**
   * Removes a room from the list.
   * 
   * @param index - Index of the room to remove
   */
  const handleRemoveRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  /**
   * Handles form submission to update all rooms.
   * Sends PUT request to API with updated rooms data.
   * 
   * @param e - Form submit event
   */
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
            aria-label="Close modal"
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
                          aria-label="Remove room"
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
};
