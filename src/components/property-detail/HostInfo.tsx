/**
 * Host Information Component
 * 
 * Displays host profile including bio, statistics, and contact info.
 * Shows total properties, reviews, and average rating.
 * 
 * @component
 */

"use client";

import Image from "next/image";
import { Award, Star, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Host } from "./types";

interface HostInfoProps {
  /** Host data to display */
  host: Host;
}

/**
 * HostInfo Component
 * 
 * Renders host profile with avatar, bio, statistics
 * (total reviews, rating, properties), and contact number.
 * 
 * @param props - Component props
 * @returns Host information section
 */
export function HostInfo({ host }: HostInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('propertyDetail.hostedBy', { name: host.fullName })}
      </h2>
      <div className="flex items-start gap-6">
        {/* Host Profile Picture */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            {host.profilePicture ? (
              <Image
                src={host.profilePicture}
                alt={host.fullName}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-600">
                {host.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Host Details */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {host.fullName}
            </h3>
            {host.bio && (
              <p className="text-gray-700 leading-relaxed">
                {host.bio}
              </p>
            )}
          </div>

          {/* Host Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFB400]" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {host.totalReviews}
                </p>
                <p className="text-xs text-gray-600">{t('propertyDetail.totalReviews')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FFB400] fill-[#FFB400]" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {host.averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-gray-600">{t('propertyDetail.averageRating')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FFB400]" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {host.totalProperties}
                </p>
                <p className="text-xs text-gray-600">{t('propertyDetail.properties')}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {host.contactNumber && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{t('propertyDetail.contact')}:</span>
                <span className="text-sm">{host.contactNumber}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
