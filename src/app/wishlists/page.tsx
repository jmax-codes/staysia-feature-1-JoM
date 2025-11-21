"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { PropertyCarouselSkeleton } from "@/components/LoadingSkeletons";

interface Property {
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
  isFavorite?: boolean;
}

export default function WishlistsPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLikedProperties = async () => {
    setIsLoading(true);
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/properties/favorites`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setLikedProperties([]);
          return;
        }
        throw new Error("Failed to fetch favorites");
      }

      const liked = await response.json();
      setLikedProperties(liked);
    } catch (error) {
      console.error("Error fetching liked properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedProperties();
    
    const handleWishlistUpdate = () => {
      fetchLikedProperties();
    };
    
    window.addEventListener("wishlistsUpdated", handleWishlistUpdate);
    
    return () => {
      window.removeEventListener("wishlistsUpdated", handleWishlistUpdate);
    };
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <main className="pt-32 pb-16">
          <PropertyCarouselSkeleton />
        </main>
      </div>
    );
  }

  const propertyText = likedProperties.length === 1 ? t('sections.property') : t('sections.properties');

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header with better spacing */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-3">
              <Heart className="w-10 h-10 text-[#FFB400] fill-[#FFB400]" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {t('wishlists.title')}
              </h1>
            </div>
            <p className="text-gray-600 text-lg ml-14">
              {t('wishlists.likedProperties', { count: likedProperties.length, property: propertyText })}
            </p>
          </div>

          {/* Properties Grid with improved spacing */}
          {isLoading ? (
            <div className="space-y-8">
              <PropertyCarouselSkeleton />
            </div>
          ) : likedProperties.length === 0 ? (
            <div className="text-center py-24">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('wishlists.noWishlists')}
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {t('wishlists.startExploring')}
              </p>
              <a
                href="/"
                className="inline-block px-8 py-4 bg-[#283B73] text-white rounded-full font-semibold hover:bg-[#1e2d5a] transition-all hover:shadow-lg"
              >
                {t('wishlists.exploreProperties')}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {likedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  name={property.name}
                  city={property.city}
                  area={property.area}
                  type={property.type}
                  price={property.price}
                  nights={property.nights}
                  rating={property.rating}
                  imageUrl={property.imageUrl}
                  isGuestFavorite={property.isGuestFavorite}
                  reviewCount={property.reviewCount}
                  layout="grid"
                  isFavorite={true} // Always favorite in wishlist page
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}