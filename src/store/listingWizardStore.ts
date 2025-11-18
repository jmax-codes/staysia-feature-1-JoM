import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RoomHighlight {
  roomNumber: number;
  inRoomAmenities: string[];
  customInRoomAmenities: string;
  bathroomFacilities: string[];
  customBathroomFacilities: string;
  additionalFeatures: string[];
  customAdditionalFeatures: string;
  technologyComfort: string[];
  customTechnologyComfort: string;
  extraServices: string[];
}

export interface PriceRange {
  startDate: Date;
  endDate: Date;
  price: number;
  type: 'best_deal' | 'peak_season';
}

export interface ListingFormData {
  // Step 1: Property Category
  propertyCategory: string;
  
  // Step 2: Place Type
  placeType: 'entire' | 'room' | '';
  
  // Step 3: Location (map search)
  locationSearch: string;
  latitude: number | null;
  longitude: number | null;
  
  // Step 4: Address Details
  country: string;
  buildingName: string;
  unitFloor: string;
  streetAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  
  // Step 5: Capacity
  guests: number;
  bedrooms: number;
  beds: number;
  bedroomLocks: boolean | null;
  
  // Step 6: Room Highlights (dynamic based on bedroom count)
  roomHighlights: RoomHighlight[];
  
  // Step 7: Who else might be there
  whoElse: string[];
  
  // Step 8: Property Amenities & Safety
  amenities: string[];
  customAmenities: string;
  parkingType: 'free' | 'paid' | '';
  safetyItems: string[];
  
  // Step 9: Property Rules
  propertyRules: string[];
  customRules: string;
  
  // Step 10: Photos
  photos: Array<{ id: string; url: string; file?: File }>;
  
  // Step 11: Description
  bio: string;
  phoneNumber: string;
  specialDescription: string;
  
  // Step 12: Pricing
  basePrice: number;
  bestDealRanges: PriceRange[];
  peakSeasonRanges: PriceRange[];
}

interface ListingWizardStore {
  currentStep: number;
  formData: ListingFormData;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<ListingFormData>) => void;
  resetForm: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialFormData: ListingFormData = {
  propertyCategory: '',
  placeType: '',
  locationSearch: '',
  latitude: null,
  longitude: null,
  country: '',
  buildingName: '',
  unitFloor: '',
  streetAddress: '',
  district: '',
  city: '',
  province: '',
  postalCode: '',
  guests: 1,
  bedrooms: 1,
  beds: 1,
  bedroomLocks: null,
  roomHighlights: [],
  whoElse: [],
  amenities: [],
  customAmenities: '',
  parkingType: '',
  safetyItems: [],
  propertyRules: [],
  customRules: '',
  photos: [],
  bio: '',
  phoneNumber: '',
  specialDescription: '',
  basePrice: 0,
  bestDealRanges: [],
  peakSeasonRanges: [],
};

export const useListingWizard = create<ListingWizardStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: initialFormData,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      
      resetForm: () =>
        set({
          currentStep: 1,
          formData: initialFormData,
        }),
      
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 12),
        })),
      
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),
    }),
    {
      name: 'listing-wizard-storage',
    }
  )
);
