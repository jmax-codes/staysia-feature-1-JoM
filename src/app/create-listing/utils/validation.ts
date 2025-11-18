/**
 * Listing Wizard Validation Utilities
 * 
 * Provides step-by-step validation for the listing creation wizard.
 * Each step has specific validation rules to ensure data completeness.
 * 
 * @module create-listing/utils/validation
 */

import { toast } from "sonner";

/**
 * Listing wizard store structure (subset for validation)
 */
interface ListingStore {
  propertyCategory: string | null;
  placeType: string | null;
  location: {
    address: string | null;
    coordinates: { lat: number; lng: number } | null;
  };
  address: {
    country: string | null;
    streetAddress: string | null;
    city: string | null;
    province: string | null;
    [key: string]: any;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    [key: string]: any;
  };
  photos: any[];
  description: {
    bio: string | null;
    phoneNumber: string | null;
    specialDescription: string | null;
    [key: string]: any;
  };
  pricing: {
    basePrice: number | null;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Validates a specific wizard step
 * 
 * Checks required fields and data integrity for each step.
 * Displays error toast messages for validation failures.
 * 
 * @param step - Step number to validate (1-12)
 * @param store - Current listing wizard store state
 * @param t - Translation function
 * @returns True if validation passes, false otherwise
 */
export function validateStep(step: number, store: ListingStore, t: (key: string) => string): boolean {
  switch (step) {
    case 1:
      if (!store.propertyCategory) {
        toast.error(t('toast.selectPropertyCategory'));
        return false;
      }
      return true;

    case 2:
      if (!store.placeType) {
        toast.error(t('toast.selectPlaceType'));
        return false;
      }
      return true;

    case 3:
      if (!store.location.address || !store.location.coordinates) {
        toast.error(t('toast.selectLocation'));
        return false;
      }
      return true;

    case 4:
      if (!store.address.country || !store.address.streetAddress || 
          !store.address.city || !store.address.province) {
        toast.error(t('toast.fillAllAddressFields'));
        return false;
      }
      return true;

    case 5:
      if (store.capacity.guests < 1 || store.capacity.bedrooms < 1 || store.capacity.beds < 1) {
        toast.error(t('toast.setMinimumCapacity'));
        return false;
      }
      return true;

    case 6:
      // Optional - room highlights can be empty
      return true;

    case 7:
      // Optional - who else can be empty
      return true;

    case 8:
      // Optional - amenities can be empty
      return true;

    case 9:
      // Optional - rules can be empty
      return true;

    case 10:
      if (store.photos.length < 5) {
        toast.error(t('toast.uploadMinimumPhotos'));
        return false;
      }
      return true;

    case 11:
      if (!store.description.bio || !store.description.phoneNumber || 
          !store.description.specialDescription) {
        toast.error(t('toast.fillAllDescriptionFields'));
        return false;
      }
      return true;

    case 12:
      if (!store.pricing.basePrice || store.pricing.basePrice <= 0) {
        toast.error(t('toast.setValidBasePrice'));
        return false;
      }
      return true;

    default:
      return true;
  }
}
