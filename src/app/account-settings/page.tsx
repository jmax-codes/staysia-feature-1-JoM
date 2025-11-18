/**
 * Account Settings Page
 * 
 * Manages user account security settings.
 * Provides email verification, password change, and connected accounts.
 * 
 * @module app/account-settings
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { EmailVerificationCard } from "./components/EmailVerificationCard";
import { PasswordChangeCard } from "./components/PasswordChangeCard";
import { ConnectedAccountsCard } from "./components/ConnectedAccountsCard";

/**
 * Account settings page component
 * 
 * Provides security-focused account management.
 * Requires user authentication.
 */
export default function AccountSettingsPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login/user?redirect=" + encodeURIComponent("/account-settings"));
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("bearer_token");
    if (!token) return;

    try {
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!isReady || isPending) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#283B73]" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('accountSettings.title')}</h1>
          <p className="text-gray-600 mt-2">{t('accountSettings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          <EmailVerificationCard
            email={userProfile?.email || ""}
            isVerified={userProfile?.emailVerified || false}
          />

          <PasswordChangeCard />

          <ConnectedAccountsCard />
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            {t('auth.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}