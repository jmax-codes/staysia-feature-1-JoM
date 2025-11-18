/**
 * Image Gallery Component
 * 
 * Displays property photos in a grid layout with a modal for viewing
 * all photos. Includes image error handling and fallback images.
 * 
 * @component
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { Grid3x3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageGalleryProps {
  /** Property name for alt text */
  propertyName: string;
  /** Array of image URLs to display */
  images: string[];
  /** Callback when image fails to load */
  onImageError: (imageUrl: string) => void;
}

/**
 * ImageGallery Component
 * 
 * Renders a responsive photo gallery with grid layout and modal viewer.
 * First image displays large, followed by 4 smaller images in a grid.
 * Shows "View All Photos" button if more than 5 photos available.
 * 
 * @param props - Component props
 * @returns Image gallery component
 */
export function ImageGallery({ propertyName, images, onImageError }: ImageGalleryProps) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  
  // Always show at least 5 photos in grid (or all if less than 5)
  const gridImages = images.slice(0, Math.max(5, images.length));
  const hasMorePhotos = images.length > 5;

  return (
    <>
      {/* Photo Gallery Dialog */}
      <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t('propertyDetail.allPhotos', { count: images.length })}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative h-[300px] cursor-pointer rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                onClick={() => {
                  setSelectedImage(idx);
                  setShowAllPhotos(false);
                }}
              >
                <Image
                  src={img}
                  alt={`${propertyName} photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => onImageError(img)}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Image Gallery Grid */}
      <div className="relative mb-8">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-2xl overflow-hidden">
            <div className="relative h-[400px] lg:h-[500px] bg-gray-200">
              <Image
                src={gridImages[0]}
                alt={propertyName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={() => onImageError(gridImages[0])}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {gridImages.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-[195px] lg:h-[245px] cursor-pointer hover:opacity-80 transition-opacity bg-gray-200"
                  onClick={() => setSelectedImage(idx + 1)}
                >
                  <Image
                    src={img}
                    alt={`${propertyName} ${idx + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    onError={() => onImageError(img)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-[400px] lg:h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center">
            <p className="text-gray-500">{t('propertyDetail.noImagesAvailable')}</p>
          </div>
        )}
        
        {/* View More Button - Only show if more than 5 photos */}
        {hasMorePhotos && (
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 font-medium transition-all hover:shadow-xl"
          >
            <Grid3x3 className="w-5 h-5" />
            {t('propertyDetail.viewAllPhotos', { count: images.length })}
          </button>
        )}
      </div>
    </>
  );
}
