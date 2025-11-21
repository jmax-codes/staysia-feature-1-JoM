/**
 * Email Verification Dialog Component
 * 
 * Modal dialog prompting users to verify their email before booking.
 * Includes resend verification email functionality.
 * 
 * @component
 */

"use client";

import { useState } from "react";
import { Mail, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VerificationDialogProps {
  /** Whether dialog is open */
  open: boolean;
  /** Callback to change open state */
  onOpenChange: (open: boolean) => void;
  /** User's email address */
  userEmail: string | undefined;
}

/**
 * VerificationDialog Component
 * 
 * Shows email verification prompt with resend functionality.
 * Prevents booking until email is verified.
 * 
 * @param props - Component props
 * @returns Verification dialog component
 */
export function VerificationDialog({ open, onOpenChange, userEmail }: VerificationDialogProps) {
  const { t } = useTranslation();
  const [isResending, setIsResending] = useState(false);

  /**
   * Resends verification email to user
   * 
   * @sideEffects Makes API call to /api/auth/send-verification
   * @sideEffects Shows toast notification
   * @sideEffects Closes dialog on success
   */
  const handleResendVerification = async () => {
    if (!userEmail || isResending) return;

    setIsResending(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bearer_token")}`,
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('auth.resendVerificationEmail'));
        onOpenChange(false);
      } else {
        toast.error(data.error || t('auth.errorOccurred'));
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error(t('auth.errorOccurred'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">{t('propertyDetail.emailVerificationRequired')}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {t('propertyDetail.emailVerificationMessage')} <strong>{userEmail}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full bg-[#283B73] hover:bg-[#1e2d5a]"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isResending ? t('propertyDetail.sending') : t('propertyDetail.resendVerificationEmail')}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full"
          >
            {t('propertyDetail.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
