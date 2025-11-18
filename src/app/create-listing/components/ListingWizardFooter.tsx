/**
 * Listing Wizard Footer Component
 * 
 * Provides navigation controls for the listing wizard.
 * Includes back, next, save & exit, and submit buttons.
 * 
 * @module create-listing/components/ListingWizardFooter
 */

import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ListingWizardFooterProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveAndExit: () => void;
  onSubmit: () => void;
}

/**
 * Listing wizard navigation footer
 * 
 * Renders context-aware navigation buttons based on current step.
 * Disables submit button during submission to prevent duplicate requests.
 * 
 * @param props - Component props
 * @param props.currentStep - Current wizard step (1-indexed)
 * @param props.totalSteps - Total number of steps
 * @param props.isSubmitting - Whether form is currently submitting
 * @param props.onBack - Handler for back button click
 * @param props.onNext - Handler for next button click
 * @param props.onSaveAndExit - Handler for save & exit button click
 * @param props.onSubmit - Handler for final submission
 */
export function ListingWizardFooter({
  currentStep,
  totalSteps,
  isSubmitting,
  onBack,
  onNext,
  onSaveAndExit,
  onSubmit,
}: ListingWizardFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border-t border-gray-200 sticky bottom-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onSaveAndExit}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {t('createListing.saveAndExit')}
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={onBack}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('createListing.back')}
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={onNext}
                className="px-6 py-2 text-sm font-medium text-white bg-[#283B73] rounded-lg hover:bg-[#1f2d57] transition-colors"
              >
                {t('createListing.next')}
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-[#FFB400] rounded-lg hover:bg-[#e6a200] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('createListing.creating')}
                  </>
                ) : (
                  t('createListing.createListing')
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
