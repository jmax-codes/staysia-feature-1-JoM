"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { Button } from "./ui/button";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { PropertyCarouselSkeleton } from "./LoadingSkeletons";

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
}

interface PropertyCarouselProps {
  title: string;
  properties: Property[];
  type?: "property" | "car";
}

export function PropertyCarousel({ title, properties, type = "property" }: PropertyCarouselProps) {
  const { isReady } = useTranslationContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (!isReady) {
    return <PropertyCarouselSkeleton />;
  }

  return (
    <section className="py-8 lg:py-12 animate-fade-in">
      <div className="px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => scroll("left")}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-2 hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => scroll("right")}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-2 hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              {...property} 
              reviewCount={property.reviewCount || 0}
              layout="carousel"
            />
          ))}
        </div>
      </div>
    </section>
  );
}