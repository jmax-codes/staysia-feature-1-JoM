/**
 * Create Listing Page
 * 
 * Multi-step wizard for creating new property listings.
 * Guides hosts through property details, amenities, pricing, and submission.
 * 
 * @module app/create-listing
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useListingWizard } from "@/store/listingWizardStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Import components
import { ListingWizardHeader } from "./components/ListingWizardHeader";
import { ListingWizardFooter } from "./components/ListingWizardFooter";
import { Step1PropertyCategory } from "@/components/listing-wizard/Step1PropertyCategory";
import { Step2PlaceType } from "@/components/listing-wizard/Step2PlaceType";
import { Step3Location } from "@/components/listing-wizard/Step3Location";
import { Step4ConfirmAddress } from "@/components/listing-wizard/Step4ConfirmAddress";
import { Step5Capacity } from "@/components/listing-wizard/Step5Capacity";
import { Step6RoomHighlights } from "@/components/listing-wizard/Step6RoomHighlights";
import { Step7WhoElse } from "@/components/listing-wizard/Step7WhoElse";
import { Step8Amenities } from "@/components/listing-wizard/Step8Amenities";
import { Step9Rules } from "@/components/listing-wizard/Step9Rules";
import { Step10Photos } from "@/components/listing-wizard/Step10Photos";
import { Step11Description } from "@/components/listing-wizard/Step11Description";
import { Step12Pricing } from "@/components/listing-wizard/Step12Pricing";

// Import utilities
import { validateStep } from "./utils/validation";
import { submitListing } from "./utils/submission";

const TOTAL_STEPS = 12;

/**
 * Create Listing Page Component
 * 
 * Provides a step-by-step wizard for property listing creation.
 * Validates each step and guides users through the complete process.
 * Requires tenant authentication.
 */
export default function CreateListingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const store = useListingWizard();
  const { language, currency } = useGlobalStore();

  // Generate step titles dynamically
  const getStepTitles = () => [
    t('listingWizard.step1.title'),
    t('listingWizard.step2.title'),
    t('listingWizard.step3.title'),
    t('listingWizard.step4.title'),
    t('listingWizard.step5.title'),
    t('listingWizard.step6.title'),
    t('listingWizard.step7.title'),
    t('listingWizard.step8.title'),
    t('listingWizard.step9.title'),
    t('listingWizard.step10.title'),
    t('listingWizard.step11.title'),
    t('listingWizard.step12.title'),
  ];

  const STEP_TITLES = getStepTitles();

  // Redirect if not tenant
  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "tenant")) {
      toast.error(t('toast.onlyTenantsCanCreateListings'));
      router.push("/dashboard");
    }
  }, [session, isPending, router, t]);

  const handleNext = () => {
    if (validateStep(currentStep, store as any, t)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveAndExit = () => {
    toast.success(t('toast.progressSaved'));
    router.push("/dashboard");
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep, store as any, t)) return;
    if (!session?.user?.id) {
      toast.error(t('toast.youMustBeLoggedIn'));
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyId = await submitListing(
        store as any,
        session.user.id,
        language,
        currency,
        t
      );

      if (propertyId) {
        store.reset();
        toast.success(t('toast.listingPublishedSuccess'));
        router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#283B73]" />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1PropertyCategory />;
      case 2: return <Step2PlaceType />;
      case 3: return <Step3Location />;
      case 4: return <Step4ConfirmAddress />;
      case 5: return <Step5Capacity />;
      case 6: return <Step6RoomHighlights />;
      case 7: return <Step7WhoElse />;
      case 8: return <Step8Amenities />;
      case 9: return <Step9Rules />;
      case 10: return <Step10Photos />;
      case 11: return <Step11Description />;
      case 12: return <Step12Pricing />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24">
      <ListingWizardHeader
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepTitles={STEP_TITLES}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStep()}
      </div>

      <ListingWizardFooter
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onNext={handleNext}
        onSaveAndExit={handleSaveAndExit}
        onSubmit={handleSubmit}
      />
    </div>
  );
}