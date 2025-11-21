/**
 * Email Verification Card Component
 * 
 * Displays email verification status and provides resend verification option.
 * Shows different UI states for verified and unverified emails.
 * 
 * @module account-settings/components/EmailVerificationCard
 */

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface EmailVerificationCardProps {
  email: string;
  isVerified: boolean;
}

/**
 * Email verification status card
 * 
 * Displays current email verification status and action buttons.
 * Allows users to resend verification email if not verified.
 * 
 * @param props - Component props
 * @param props.email - User's email address
 * @param props.isVerified - Whether email is verified
 */
export function EmailVerificationCard({ email, isVerified }: EmailVerificationCardProps) {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);

  const handleSendVerification = async () => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      toast.error(t('toast.pleaseLogInAgain'));
      return;
    }

    setIsSending(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success(t('toast.verificationEmailSent'));
      } else {
        const error = await response.json();
        toast.error(error.error || t('toast.verificationEmailError'));
      }
    } catch (error) {
      toast.error(t('toast.errorOccurred'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] px-6 py-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold text-white">{t('accountSettings.emailVerification')}</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-gray-700">{t('accountSettings.currentEmail')}</p>
              <p className="text-sm font-semibold text-gray-900">{email}</p>
            </div>
            
            {isVerified ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900">{t('accountSettings.emailVerified')}</p>
                  <p className="text-xs text-green-700">{t('accountSettings.emailVerifiedMessage')}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">{t('accountSettings.emailNotVerified')}</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {t('accountSettings.emailNotVerifiedMessage')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!isVerified && (
            <Button
              onClick={handleSendVerification}
              disabled={isSending}
              className="bg-[#283B73] hover:bg-[#1e2d5a] text-white flex-shrink-0"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('accountSettings.resendingVerification')}
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {t('accountSettings.resendVerification')}
                </>
              )}
            </Button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">{t('accountSettings.wantToUpdateEmail')}</p>
          <Link href="/profile">
            <Button variant="outline" className="border-[#283B73] text-[#283B73] hover:bg-[#283B73] hover:text-white">
              {t('accountSettings.goToProfileSettings')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
