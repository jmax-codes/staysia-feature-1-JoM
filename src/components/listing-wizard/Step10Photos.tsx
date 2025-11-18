"use client";

import { useListingWizard } from "@/store/listingWizardStore";
import { useState, useRef } from "react";
import { Upload, X, GripVertical, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function Step10Photos() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useListingWizard();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));
    updateFormData({ photos: [...formData.photos, ...newPhotos] });
  };

  const removePhoto = (id: string) => {
    updateFormData({
      photos: formData.photos.filter((photo) => photo.id !== id),
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPhotos = [...formData.photos];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(index, 0, draggedPhoto);

    updateFormData({ photos: newPhotos });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {t('listingWizard.step10.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('listingWizard.step10.subtitle')}
      </p>

      <div className="space-y-6">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#283B73] transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('listingWizard.step10.uploadPhotos')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('listingWizard.step10.dragDropPhotos')}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {t('listingWizard.step10.supportedFormats')}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Photo Grid */}
        {formData.photos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('listingWizard.step10.photoCount', { count: formData.photos.length })}
              </h3>
              {formData.photos.length < 5 && (
                <p className="text-sm text-orange-600">
                  You need at least {5 - formData.photos.length} more photo(s)
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="relative group cursor-move aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#283B73] transition-all"
                >
                  <Image
                    src={photo.url}
                    alt={`Property photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Order Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md">
                    {index + 1}
                  </div>

                  {/* Drag Handle */}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-[#FFB400] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {t('listingWizard.step10.coverPhoto')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-4 text-center">
              💡 Drag photos to reorder. The first photo will be your cover image.
            </p>
          </div>
        )}

        {formData.photos.length === 0 && (
          <div className="text-center py-8">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No photos uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}