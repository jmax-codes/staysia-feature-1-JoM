"use client";

import { Skeleton } from "@/components/ui/skeleton";

// Header skeleton for search section
export function HeaderSkeleton() {
  return (
    <div className="relative min-h-[600px] lg:min-h-[700px] bg-gray-200 animate-pulse">
      <div className="relative z-10 px-4 sm:px-6 lg:px-12 pt-32 lg:pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto">
          {/* Title skeleton */}
          <div className="flex justify-center mb-12 lg:mb-16">
            <Skeleton className="h-12 w-96 lg:h-16 lg:w-[600px]" />
          </div>
          
          {/* Search bar skeleton */}
          <div className="max-w-5xl mx-auto">
            {/* Category tabs */}
            <div className="flex gap-2 mb-4 justify-start overflow-x-auto py-3 px-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
              ))}
            </div>
            
            {/* Search form */}
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Property card skeleton
export function PropertyCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px]">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md">
        {/* Image skeleton */}
        <Skeleton className="h-[200px] sm:h-[240px] w-full rounded-none" />
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-5 w-12 ml-2" />
          </div>
          
          <Skeleton className="h-4 w-20" />
          
          <div className="pt-3 border-t border-gray-100">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Property carousel skeleton
export function PropertyCarouselSkeleton() {
  return (
    <section className="py-8 lg:py-12">
      <div className="px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64 lg:h-10 lg:w-80" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Carousel */}
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Full page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] animate-fade-in">
      <HeaderSkeleton />
      <main>
        <PropertyCarouselSkeleton />
        <PropertyCarouselSkeleton />
        <PropertyCarouselSkeleton />
      </main>
    </div>
  );
}

// Property detail skeleton
export function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Back button skeleton */}
        <Skeleton className="h-8 w-24 mb-6 rounded-full" />
        
        {/* Title section */}
        <div className="mb-6">
          <Skeleton className="h-10 w-3/4 mb-3" />
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>

        {/* Image gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8 rounded-2xl overflow-hidden">
          <Skeleton className="h-[400px] lg:h-[500px] rounded-none" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[195px] lg:h-[245px] rounded-none" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
