/**
 * Property Detail Client Component
 * 
 * Main client component for property details page. Orchestrates
 * all subcomponents and handles booking flow with authentication.
 * 
 * @component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { VerificationBanner } from "@/components/VerificationBanner";
import { PricingCalendar } from "@/components/PricingCalendar";
import { ImageGallery } from "./ImageGallery";
import { VerificationDialog } from "./VerificationDialog";
import { PropertyInfo } from "./PropertyInfo";
import { HostInfo } from "./HostInfo";
import { AmenitiesList } from "./AmenitiesList";
import { RoomsList } from "./RoomsList";
import { ReviewsList } from "./ReviewsList";
import { PropertyRules } from "./PropertyRules";
import { LocationMap } from "./LocationMap";
import { getValidImages } from "./utils";
import type { PropertyData } from "./types";

interface PropertyDetailClientProps {
  /** Complete property data including host, rooms, reviews, pricing */
  data: PropertyData;
}

/**
 * PropertyDetailClient Component
 * 
 * Renders complete property detail page with image gallery, property info,
 * host details, amenities, rooms, reviews, and pricing calendar.
 * Handles authentication checks and email verification for bookings.
 * 
 * @param props - Component props
 * @returns Property detail page component
 */
export function PropertyDetailClient({ data }: PropertyDetailClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { property, host } = data;
  
  // Add null safety for arrays
  const rooms = data.rooms || [];
  const reviews = data.reviews || [];
  const pricing = data.pricing || [];
  const amenities = property.amenities || [];
  // Cast propertyRules to string[] if it exists, otherwise empty array
  const propertyRules = (property.propertyRules as unknown as string[]) || [];
  
  const { data: session } = useSession();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  // Support multiple room selection
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(new Set());

  // Get valid images with error handling
  const displayImages = getValidImages(property, failedImageUrls);

  /**
   * Handles image load errors by tracking failed URLs
   */
  const handleImageError = (imageUrl: string) => {
    console.error("Image failed to load:", imageUrl);
    setFailedImageUrls(prev => new Set(prev).add(imageUrl));
  };

  const handleToggleRoom = (roomId: number) => {
    setSelectedRoomIds(prev => {
      if (prev.includes(roomId)) {
        return prev.filter(id => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  /**
   * Handles booking action with authentication and verification checks
   */
  const handleBooking = () => {
    // Check if user is logged in
    if (!session?.user) {
      router.push(`/auth/login/user?redirect=/properties/${property.id}`);
      return;
    }

    // Check if user is verified
    if (!session.user.emailVerified) {
      setShowVerificationDialog(true);
      return;
    }

    // Proceed with booking
    toast.success(t('propertyDetail.proceedingToBooking'));
    // TODO: Implement actual booking flow
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] animate-fade-in">
      <VerificationBanner />
      
      {/* Email Verification Dialog */}
      <VerificationDialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
        userEmail={session?.user?.email}
      />

      {/* Main Content with proper spacing from navbar */}
      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 group-hover:border-gray-900 group-hover:shadow-sm transition-all duration-200">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{t('propertyDetail.back')}</span>
        </button>

        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {property.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
              <span className="font-semibold">{property.rating.toFixed(2)}</span>
              <span className="text-gray-600">({reviews.length} {reviews.length === 1 ? t('propertyDetail.review') : t('propertyDetail.reviews')})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery
          propertyName={property.name}
          images={displayImages}
          onImageError={handleImageError}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <PropertyInfo property={property} />

            {/* Host Information */}
            {host && <HostInfo host={host} />}

            {/* Property Rules - NEW SECTION */}
            <PropertyRules rules={propertyRules} />

            {/* Rooms Selection - NEW SECTION */}
            <RoomsList 
              rooms={rooms} 
              selectedRoomIds={selectedRoomIds}
              onToggleRoom={handleToggleRoom} 
            />

            {/* Amenities */}
            <AmenitiesList amenities={amenities} />
          </div>

          {/* Sidebar - Pricing Calendar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <PricingCalendar
                propertyId={property.id}
                pricingData={pricing}
                basePrice={property.price}
                defaultNights={property.nights}
                cardPrice={property.price}
                rooms={rooms.map(room => ({
                  id: room.id,
                  name: room.name,
                  pricePerNight: room.pricePerNight,
                  available: room.available
                }))}
                selectedRoomIds={selectedRoomIds}
                bestDealPrice={property.bestDealPrice}
                peakSeasonPrice={property.peakSeasonPrice}
              />
            </div>
          </div>
        </div>

        {/* Location Map - Full Width Below Grid */}
        <div className="mt-8">
          <LocationMap 
            address={`${property.address}, ${property.city}, ${property.country}`}
            latitude={property.latitude || undefined}
            longitude={property.longitude || undefined}
          />
        </div>

        {/* Reviews - At the Very Bottom */}
        <div className="mt-8">
          <ReviewsList reviews={reviews} overallRating={property.rating} />
        </div>
      </div>
    </div>
  );
}
