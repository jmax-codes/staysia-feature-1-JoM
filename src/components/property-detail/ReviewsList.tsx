/**
 * Reviews List Component
 * 
 * Displays property reviews with ratings, comments, and user info.
 * Shows overall rating and total review count.
 * 
 * @component
 */

"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Review } from "./types";

interface ReviewsListProps {
  /** Array of review data */
  reviews: Review[];
  /** Property's overall rating */
  overallRating: number;
}

/**
 * ReviewsList Component
 * 
 * Renders list of reviews with user avatars, ratings, timestamps,
 * and comment text. Returns null if no reviews available.
 * 
 * @param props - Component props
 * @returns Reviews section or null
 */
export function ReviewsList({ reviews, overallRating }: ReviewsListProps) {
  const { t } = useTranslation();

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        <Star className="w-6 h-6 inline fill-gray-900 text-gray-900 mr-2" />
        {overallRating.toFixed(2)} • {reviews.length} {reviews.length === 1 ? t('propertyDetail.review') : t('propertyDetail.reviews')}
      </h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                {review.userAvatar ? (
                  <Image
                    src={review.userAvatar}
                    alt={review.userName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-600">
                    {review.userName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                    <span className="text-sm font-semibold">{review.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric"
                  })}
                </p>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
