/**
 * Listing Submission Utilities
 * 
 * Handles the submission process for creating a new property listing.
 * Uploads photos, creates property with rooms, and configures pricing.
 * 
 * @module create-listing/utils/submission
 */

import { toast } from "sonner";
import { uploadMultipleFiles } from "@/lib/supabase";

/**
 * Photo with file and cover flag
 */
interface PhotoFile {
  file: File;
  isCover: boolean;
}

/**
 * Listing data structure from wizard store
 */
interface ListingData {
  propertyCategory: string;
  placeType: string;
  location: {
    coordinates: { lat: number; lng: number } | null;
  };
  address: {
    country: string;
    streetAddress: string;
    city: string;
    province: string;
    district?: string | null;
    buildingName?: string | null;
    unitFloor?: string | null;
    postalCode?: string | null;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms?: number;
    bedroomsHaveLocks?: boolean;
  };
  photos: PhotoFile[];
  description: {
    bio: string;
    phoneNumber: string;
    specialDescription: string;
  };
  pricing: {
    basePrice: number;
    bestDeal?: {
      price: number;
      dates: Array<{ from: Date; to: Date }>;
    } | null;
    peakSeason?: {
      price: number;
      dates: Array<{ from: Date; to: Date }>;
    } | null;
  };
  roomHighlights: Array<{
    inRoomAmenities: string[];
    bathroomFacilities: string[];
    additionalFeatures: string[];
    technologyComfort: string[];
    extraServices: string[];
  }>;
  amenities: string[];
  whoElse: string[];
  parking?: { type: string };
  rules: string[];
  safetyItems: string[];
  [key: string]: any;
}

/**
 * Submits new listing to API
 * 
 * Multi-step process:
 * 1. Uploads photos to Supabase Storage
 * 2. Creates property with rooms via API
 * 3. Configures pricing (best deal & peak season)
 * 
 * @param listingData - Complete listing data from wizard
 * @param userId - Current user ID
 * @param language - Language code
 * @param currency - Currency code
 * @param t - Translation function
 * @returns Property ID if successful, null if failed
 */
export async function submitListing(
  listingData: ListingData,
  userId: string,
  language: { code: string },
  currency: { code: string },
  t: (key: string, params?: any) => string
): Promise<number | null> {
  try {
    // 1. Upload photos
    toast.loading(t('toast.uploadingPhotos'), { id: "upload" });
    const photoFiles = listingData.photos.map(photo => photo.file);
    const uploadedUrls = await uploadMultipleFiles(photoFiles, "property-images");
    
    const photoUrls = listingData.photos.map((photo, index) => ({
      url: uploadedUrls[index],
      isCover: photo.isCover,
      displayOrder: index,
    }));
    toast.success(t('toast.photosUploadedSuccess'), { id: "upload" });

    const coverImage = photoUrls.find(p => p.isCover) || photoUrls[0];

    // 2. Create property
    toast.loading(t('toast.creatingProperty'), { id: "create" });
    const propertyData = {
      name: listingData.description.specialDescription.substring(0, 100),
      city: listingData.address.city,
      area: listingData.address.district || listingData.address.city,
      type: listingData.propertyCategory,
      propertyCategory: listingData.propertyCategory,
      placeType: listingData.placeType,
      price: listingData.pricing.basePrice,
      nights: 2,
      rating: 0,
      imageUrl: coverImage.url,
      isGuestFavorite: false,
      description: listingData.description.specialDescription,
      address: `${listingData.address.streetAddress}, ${listingData.address.district ? listingData.address.district + ', ' : ''}${listingData.address.city}, ${listingData.address.province}`,
      country: listingData.address.country,
      latitude: listingData.location.coordinates?.lat || null,
      longitude: listingData.location.coordinates?.lng || null,
      bedrooms: listingData.capacity.bedrooms,
      bathrooms: listingData.capacity.bathrooms || 1,
      maxGuests: listingData.capacity.guests,
      petsAllowed: false,
      checkInTime: "14:00",
      checkOutTime: "12:00",
      images: photoUrls,
      amenities: listingData.amenities,
      buildingName: listingData.address.buildingName || null,
      unitFloor: listingData.address.unitFloor || null,
      district: listingData.address.district || null,
      postalCode: listingData.address.postalCode || null,
      beds: listingData.capacity.beds,
      bedroomLocks: listingData.capacity.bedroomsHaveLocks || false,
      whoElse: listingData.whoElse,
      parkingType: listingData.parking?.type || "",
      propertyRules: listingData.rules,
      safetyItems: listingData.safetyItems,
      bio: listingData.description.bio,
      phoneNumber: listingData.description.phoneNumber,
      specialDescription: listingData.description.specialDescription,
      isPublished: true,
      languageCode: language.code,
      currencyCode: currency.code,
      rooms: listingData.roomHighlights.map((room, index) => ({
        name: `Room ${index + 1}`,
        type: listingData.placeType === "entire" ? "Entire Place" : "Private Room",
        pricePerNight: listingData.pricing.basePrice,
        maxGuests: listingData.capacity.guests,
        beds: { single: listingData.capacity.beds },
        size: null,
        amenities: [
          ...room.inRoomAmenities,
          ...room.bathroomFacilities,
          ...room.additionalFeatures,
          ...room.technologyComfort,
          ...room.extraServices,
        ],
        available: true,
        roomNumber: index + 1,
        inRoomAmenities: room.inRoomAmenities,
        bathroomFacilities: room.bathroomFacilities,
        additionalFeatures: room.additionalFeatures,
        technologyComfort: room.technologyComfort,
        extraServices: room.extraServices,
        hasLock: listingData.capacity.bedroomsHaveLocks || false,
      })),
    };

    const token = localStorage.getItem("bearer_token");
    const propertyRes = await fetch("/api/tenant/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });

    if (!propertyRes.ok) {
      const errorData = await propertyRes.json();
      throw new Error(errorData.error || t('toast.listingCreationError'));
    }

    const createdProperty = await propertyRes.json();
    const propertyId = createdProperty.id;
    toast.success(t('toast.propertyCreatedSuccess'), { id: "create" });

    // 3. Create pricing
    await createPricing(propertyId, listingData.pricing, token, t);

    return propertyId;
  } catch (error: any) {
    console.error("Error creating listing:", error);
    toast.error(error.message || t('toast.listingCreationError'));
    return null;
  }
}

/**
 * Creates pricing configuration for property
 * 
 * Submits best deal and peak season pricing if configured.
 * 
 * @param propertyId - Created property ID
 * @param pricing - Pricing configuration from wizard
 * @param token - Authentication token
 * @param t - Translation function
 */
async function createPricing(
  propertyId: number,
  pricing: ListingData['pricing'],
  token: string | null,
  t: (key: string) => string
): Promise<void> {
  const pricingData = [];
  
  if (pricing.bestDeal && pricing.bestDeal.dates.length > 0) {
    pricing.bestDeal.dates.forEach(dateRange => {
      pricingData.push({
        propertyId,
        startDate: dateRange.from.toISOString().split('T')[0],
        endDate: dateRange.to.toISOString().split('T')[0],
        pricePerNight: pricing.bestDeal!.price,
        type: "discount",
      });
    });
  }

  if (pricing.peakSeason && pricing.peakSeason.dates.length > 0) {
    pricing.peakSeason.dates.forEach(dateRange => {
      pricingData.push({
        propertyId,
        startDate: dateRange.from.toISOString().split('T')[0],
        endDate: dateRange.to.toISOString().split('T')[0],
        pricePerNight: pricing.peakSeason!.price,
        type: "peak",
      });
    });
  }

  if (pricingData.length > 0) {
    toast.loading(t('toast.settingUpPricing'), { id: "pricing" });
    await fetch("/api/property-pricing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pricing: pricingData }),
    });
    toast.success(t('toast.pricingConfiguredSuccess'), { id: "pricing" });
  }
}
