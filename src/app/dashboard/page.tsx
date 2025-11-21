/**
 * Dashboard Page
 * 
 * Property management dashboard for hosts.
 * Displays portfolio statistics, property list, and management actions.
 * 
 * @module app/dashboard
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EditPropertyModal, ManageRoomsModal, ManagePricingModal } from "@/components/PropertyManagementModals";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { StatsCards } from "./components/StatsCards";
import { PropertyCard } from "./components/PropertyCard";
import { EmptyState } from "./components/EmptyState";

interface Property {
  id: number;
  name: string;
  city: string;
  area: string;
  type: string;
  price: number;
  rating: number;
  imageUrl: string;
  isGuestFavorite: boolean;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  isPublished: boolean;
  createdAt: string;
}

/**
 * Dashboard page component
 * 
 * Main tenant dashboard for property management.
 * Requires tenant authentication.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const { selectedCurrency, exchangeRate } = useCurrency();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  // Modal states
  const [editModal, setEditModal] = useState<{ isOpen: boolean; property: any }>({ 
    isOpen: false, 
    property: null 
  });
  const [roomsModal, setRoomsModal] = useState<{ isOpen: boolean; propertyId: number | null }>({ 
    isOpen: false, 
    propertyId: null 
  });
  const [pricingModal, setPricingModal] = useState<{ isOpen: boolean; property: any }>({ 
    isOpen: false, 
    property: null 
  });

  // Redirect if not tenant
  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "tenant")) {
      // toast.error("Access denied. Please become a host first.");
      // router.push("/");
    }
  }, [session, isPending, router]);

  // Fetch properties
  useEffect(() => {
    if (session?.user?.id) {
      fetchProperties();
    }
  }, [session]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/user/properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch properties");

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (propertyId: number) => {
    if (!confirm(t('dashboard.deleteConfirm'))) return;

    setIsDeleting(propertyId);
    try {
      const token = localStorage.getItem("bearer_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/tenant/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete property");

      toast.success("Property deleted successfully");
      setProperties(properties.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleTogglePublish = async (propertyId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/tenant/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update publish status");

      toast.success(currentStatus ? "Property unpublished" : "Property published");
      fetchProperties();
    } catch (error) {
      console.error("Error updating publish status:", error);
      toast.error("Failed to update publish status");
    }
  };

  const formatPrice = (price: number) => {
    const converted = price * exchangeRate;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  if (isPending || isLoading || !isReady) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#283B73]" />
      </div>
    );
  }

  // Calculate stats
  const totalProperties = properties.length;
  const publishedProperties = properties.filter(p => p.isPublished).length;
  const guestFavorites = properties.filter(p => p.isGuestFavorite).length;
  const averageRating = properties.length > 0
    ? (properties.reduce((sum, p) => sum + p.rating, 0) / properties.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
              <p className="text-gray-600 mt-1">{t('dashboard.manageProperties')}</p>
            </div>
            <button
              onClick={() => router.push("/create-listing")}
              className="flex items-center gap-2 px-6 py-3 bg-[#FFB400] text-white font-medium rounded-lg hover:bg-[#e6a200] transition-colors"
            >
              <Plus className="h-5 w-5" />
              {t('dashboard.addProperty')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards
          totalProperties={totalProperties}
          publishedProperties={publishedProperties}
          guestFavorites={guestFavorites}
          averageRating={averageRating}
        />

        {/* Properties List */}
        {properties.length === 0 ? (
          <EmptyState onAddProperty={() => router.push("/create-listing")} />
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.yourProperties')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isDeleting={isDeleting === property.id}
                  formatPrice={formatPrice}
                  onEdit={(p) => setEditModal({ isOpen: true, property: p })}
                  onDelete={handleDelete}
                  onManageRooms={(id) => setRoomsModal({ isOpen: true, propertyId: id })}
                  onManagePricing={(p) => setPricingModal({ isOpen: true, property: p })}
                  onTogglePublish={handleTogglePublish}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditPropertyModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, property: null })}
        property={editModal.property}
        onSuccess={fetchProperties}
      />

      <ManageRoomsModal
        isOpen={roomsModal.isOpen}
        onClose={() => setRoomsModal({ isOpen: false, propertyId: null })}
        propertyId={roomsModal.propertyId || 0}
        onSuccess={fetchProperties}
      />

      <ManagePricingModal
        isOpen={pricingModal.isOpen}
        onClose={() => setPricingModal({ isOpen: false, property: null })}
        propertyId={pricingModal.property?.id || 0}
        propertyName={pricingModal.property?.name || ""}
        basePrice={pricingModal.property?.price || 0}
        onSuccess={fetchProperties}
      />
    </div>
  );
}