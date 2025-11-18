"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useTranslation } from "react-i18next";

export function VerificationBanner() {
  const { t } = useTranslation();
  const { data: session, isPending } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem("verification_banner_dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
      return;
    }

    // Show banner if user is logged in but not verified
    if (!isPending && session?.user && !session.user.emailVerified) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [session, isPending]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("verification_banner_dismissed", "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-[82px] right-12 z-50 animate-fade-in">
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg shadow-md px-3 py-2 max-w-[280px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-yellow-900 flex-1">
            {t('components.verificationBanner.warning')} {session?.user?.email}
          </p>
          <button
            onClick={handleDismiss}
            className="text-yellow-700 hover:text-yellow-900 transition-colors p-0.5 rounded hover:bg-yellow-100 flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}