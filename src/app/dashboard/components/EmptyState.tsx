/**
 * Dashboard Empty State Component
 * 
 * Displays when user has no properties.
 * Provides call-to-action to create first listing.
 * 
 * @module dashboard/components/EmptyState
 */

import { Home, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  onAddProperty: () => void;
}

/**
 * Empty state for dashboard
 * 
 * Shows friendly message and CTA when no properties exist.
 * Encourages users to create their first listing.
 * 
 * @param props - Component props
 * @param props.onAddProperty - Handler for add property button click
 */
export function EmptyState({ onAddProperty }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Home className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t('dashboard.noProperties')}
      </h3>
      <p className="text-gray-600 mb-6">{t('dashboard.startAdding')}</p>
      <button
        onClick={onAddProperty}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#283B73] text-white font-medium rounded-lg hover:bg-[#1f2d57] transition-colors"
      >
        <Plus className="h-5 w-5" />
        {t('dashboard.addFirstProperty')}
      </button>
    </div>
  );
}
