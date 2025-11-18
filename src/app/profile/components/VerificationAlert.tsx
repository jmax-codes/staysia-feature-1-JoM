/**
 * Email Verification Alert Component
 * 
 * Displays an alert when the user's email is not verified,
 * with a button to resend the verification email.
 * 
 * @component
 * @param {boolean} isVisible - Whether to show the alert
 * @param {boolean} isSending - Whether verification email is being sent
 * @param {Function} onSendVerification - Handler to send verification email
 * @param {Function} t - Translation function
 */

"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationAlertProps {
  isVisible: boolean;
  isSending: boolean;
  onSendVerification: () => void;
  t: (key: string) => string;
}

export function VerificationAlert({
  isVisible,
  isSending,
  onSendVerification,
  t,
}: VerificationAlertProps) {
  if (!isVisible) return null;

  return (
    <div className="mx-8 mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-800">
          {t('profile.emailNotVerifiedAlert')}
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          {t('profile.emailNotVerifiedMessage')}
        </p>
      </div>
      <Button
        onClick={onSendVerification}
        disabled={isSending}
        variant="outline"
        className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
      >
        {isSending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          t('auth.sendVerification')
        )}
      </Button>
    </div>
  );
}
