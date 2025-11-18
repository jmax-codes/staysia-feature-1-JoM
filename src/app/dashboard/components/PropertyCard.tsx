/**
 * Dashboard Property Card Component
 * 
 * Displays property information with management actions.
 * Shows image, details, stats, and action buttons for edit, delete, and pricing.
 * 
 * @module dashboard/components/PropertyCard
 */

import { Star, MapPin, Users, Home, Bed, Bath, DollarSign, Edit, Trash2, DoorOpen, Loader2, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Property {
  id: number;
  name: string;
  city: string;
  area: string;
  type: string;
  price: number;
  rating: number;
  imageUrl: string;
  isGuestFavorite: boolean;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  isPublished: boolean;
}

interface PropertyCardProps {
  property: Property;
  isDeleting: boolean;
  formatPrice: (price: number) => string;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: number) => void;
  onManageRooms: (propertyId: number) => void;
  onManagePricing: (property: Property) => void;
  onTogglePublish: (propertyId: number, currentStatus: boolean) => void;
}

/**
 * Property card for dashboard
 * 
 * Renders comprehensive property information with management controls.
 * Includes image, metrics, and action buttons for all property operations.
 * 
 * @param props - Component props
 * @param props.property - Property data to display
 * @param props.isDeleting - Whether property is being deleted
 * @param props.formatPrice - Function to format price with currency
 * @param props.onEdit - Handler for edit action
 * @param props.onDelete - Handler for delete action
 * @param props.onManageRooms - Handler for room management
 * @param props.onManagePricing - Handler for pricing management
 * @param props.onTogglePublish - Handler for publish/unpublish toggle
 */
export function PropertyCard({
  property,
  isDeleting,
  formatPrice,
  onEdit,
  onDelete,
  onManageRooms,
  onManagePricing,
  onTogglePublish,
}: PropertyCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="w-full h-56 object-cover"
        />
        {property.isGuestFavorite && (
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Star className="h-4 w-4 text-[#FFB400] fill-current" />
            <span className="text-xs font-medium text-gray-900">
              {t('propertyDetail.guestFavorite')}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-[#283B73] text-white px-3 py-1 rounded-full text-sm font-medium">
          {property.type}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {property.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{property.area}, {property.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-900 ml-4">
            <Star className="h-4 w-4 text-[#FFB400] fill-current" />
            <span className="font-medium">{property.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-100">
          <div className="text-center">
            <Users className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600">{property.maxGuests} {t('dashboard.guests')}</p>
          </div>
          <div className="text-center">
            <Home className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600">{t('dashboard.bedroomsCount', { count: property.bedrooms })}</p>
          </div>
          <div className="text-center">
            <Bed className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600">{property.beds} {t('dashboard.beds')}</p>
          </div>
          <div className="text-center">
            <Bath className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600">{property.bathrooms} {t('dashboard.bath')}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <DollarSign className="h-5 w-5 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-gray-600">/ {t('dashboard.night')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(property)}
              className="p-2 text-gray-600 hover:text-[#283B73] hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit property"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(property.id)}
              disabled={isDeleting}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete property"
            >
              {isDeleting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => onManageRooms(property.id)}
            className="px-3 py-2 text-sm font-medium text-[#283B73] bg-[#283B73]/5 rounded-lg hover:bg-[#283B73]/10 transition-colors flex items-center justify-center gap-2"
          >
            <DoorOpen className="h-4 w-4" />
            {t('dashboard.rooms')}
          </button>
          <button
            onClick={() => onManagePricing(property)}
            className="px-3 py-2 text-sm font-medium text-[#FFB400] bg-[#FFB400]/5 rounded-lg hover:bg-[#FFB400]/10 transition-colors flex items-center justify-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            {t('dashboard.pricing')}
          </button>
          <button
            onClick={() => onTogglePublish(property.id, property.isPublished)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              property.isPublished
                ? "text-red-600 bg-red-50 hover:bg-red-100"
                : "text-green-600 bg-green-50 hover:bg-green-100"
            }`}
          >
            {property.isPublished ? t('dashboard.unpublish') : t('dashboard.publish')}
          </button>
        </div>

        <div className="mt-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              property.isPublished
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {property.isPublished ? t('dashboard.published') : t('dashboard.draft')}
          </span>
        </div>
      </div>
    </div>
  );
}
