/**
 * Dashboard Stats Cards Component
 * 
 * Displays key metrics for property management dashboard.
 * Shows total properties, published count, guest favorites, and average rating.
 * 
 * @module dashboard/components/StatsCards
 */

import { Home, Star, TrendingUp, DoorOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatsCardsProps {
  totalProperties: number;
  publishedProperties: number;
  guestFavorites: number;
  averageRating: string;
}

/**
 * Dashboard statistics cards
 * 
 * Renders a grid of metric cards with icons and values.
 * Provides quick overview of property portfolio performance.
 * 
 * @param props - Component props
 * @param props.totalProperties - Total number of properties
 * @param props.publishedProperties - Number of published properties
 * @param props.guestFavorites - Number of guest favorite properties
 * @param props.averageRating - Average rating across all properties
 */
export function StatsCards({
  totalProperties,
  publishedProperties,
  guestFavorites,
  averageRating,
}: StatsCardsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t('dashboard.totalProperties'),
      value: totalProperties,
      icon: Home,
      bgColor: "bg-[#283B73]",
      iconColor: "text-[#283B73]",
    },
    {
      label: t('dashboard.published'),
      value: publishedProperties,
      icon: DoorOpen,
      bgColor: "bg-green-500",
      iconColor: "text-green-500",
    },
    {
      label: t('dashboard.guestFavorites'),
      value: guestFavorites,
      icon: Star,
      bgColor: "bg-[#FFB400]",
      iconColor: "text-[#FFB400]",
    },
    {
      label: t('dashboard.averageRating'),
      value: averageRating,
      icon: TrendingUp,
      bgColor: "bg-purple-500",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <div
              className={`w-12 h-12 ${stat.bgColor} bg-opacity-10 rounded-lg flex items-center justify-center`}
            >
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
