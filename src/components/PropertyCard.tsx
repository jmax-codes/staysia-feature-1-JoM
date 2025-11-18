"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { PropertyCardSkeleton } from "./LoadingSkeletons";

interface PropertyCardProps {
  id: number;
  name: string;
  city: string;
  area: string;
  type: string;
  price: number;
  nights: number;
  rating: number;
  imageUrl: string;
  isGuestFavorite: boolean;
  reviewCount?: number;
  layout?: "carousel" | "grid";
}

export function PropertyCard({
  id,
  name,
  city,
  area,
  type,
  price,
  nights,
  rating,
  imageUrl,
  isGuestFavorite,
  reviewCount = 0,
  layout = "carousel",
}: PropertyCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { selectedCurrency, exchangeRate } = useCurrency();

  useEffect(() => {
    const likedProperties = JSON.parse(localStorage.getItem("likedProperties") || "[]");
    setIsFavorite(likedProperties.includes(id));
  }, [id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const likedProperties = JSON.parse(localStorage.getItem("likedProperties") || "[]");
      
      let updatedLikes: number[];
      if (isFavorite) {
        updatedLikes = likedProperties.filter((propId: number) => propId !== id);
      } else {
        updatedLikes = [...likedProperties, id];
      }
      
      localStorage.setItem("likedProperties", JSON.stringify(updatedLikes));
      setIsFavorite(!isFavorite);
      window.dispatchEvent(new CustomEvent("wishlistsUpdated"));
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to property detail page
    router.push(`/properties/${id}`);
  };

  const convertedPrice = price * exchangeRate;
  
  const formattedPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: selectedCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedPrice);

  const priceLabel = t('propertyCard.forNights', { count: nights });

  const getValidImageUrl = () => {
    if (!imageUrl || imageError) {
      return "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop";
    }
    return imageUrl;
  };

  if (!isReady) {
    return <PropertyCardSkeleton />;
  }

  const containerClass = layout === "grid" 
    ? "w-full" 
    : "flex-shrink-0 w-[280px] sm:w-[320px]";

  return (
    <div
      className={`group relative ${containerClass} cursor-pointer animate-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/properties/${id}`);
        }
      }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
        {/* Image Container */}
        <div className="relative h-[220px] sm:h-[260px] overflow-hidden bg-gray-200">
          <Image
            src={getValidImageUrl()}
            alt={name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            onError={() => setImageError(true)}
            unoptimized
          />
          
          {/* Guest Favorite Badge */}
          {isGuestFavorite && (
            <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full shadow-lg pointer-events-none">
              <span className="text-xs font-semibold text-gray-700">
                {t('propertyCard.guestFavorite')}
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 hover:bg-white shadow-lg transition-all hover:scale-110 z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1.5">
                {type} {t('propertyDetail.in')} {city}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1 mb-1">{area}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{name}</p>
            </div>
            <div className="flex items-center gap-1 ml-3 flex-shrink-0">
              <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">
                {rating.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Review count */}
          {reviewCount > 0 && (
            <p className="text-xs text-gray-500 mb-3">
              {reviewCount} {reviewCount === 1 ? t('propertyCard.review') : t('propertyCard.reviews')}
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900">
                {formattedPrice}
              </span>
              <span className="text-sm text-gray-600">
                {priceLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}