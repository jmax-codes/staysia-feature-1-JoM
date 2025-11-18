/**
 * Listing Wizard Header Component
 * 
 * Displays progress bar and stepper for the listing creation wizard.
 * Shows mobile progress bar and desktop step indicators.
 * 
 * @module create-listing/components/ListingWizardHeader
 */

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ListingWizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

/**
 * Listing wizard header with progress tracking
 * 
 * Renders responsive progress indicators:
 * - Mobile: Simple progress bar with percentage
 * - Desktop: Full stepper with numbered steps
 * 
 * @param props - Component props
 * @param props.currentStep - Current active step (1-indexed)
 * @param props.totalSteps - Total number of steps
 * @param props.stepTitles - Array of step titles for display
 */
export function ListingWizardHeader({ currentStep, totalSteps, stepTitles }: ListingWizardHeaderProps) {
  const { t } = useTranslation();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile Progress */}
        <div className="block lg:hidden mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('createListing.stepOf', { current: currentStep, total: totalSteps })}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#283B73] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Desktop Stepper */}
        <div className="hidden lg:flex items-center justify-between">
          {stepTitles.map((title, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={stepNumber} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-[#283B73] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                  </div>
                  <span
                    className={`text-xs mt-2 max-w-[80px] text-center ${
                      isActive ? "text-[#283B73] font-medium" : "text-gray-500"
                    }`}
                  >
                    {title}
                  </span>
                </div>
                {stepNumber < totalSteps && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
