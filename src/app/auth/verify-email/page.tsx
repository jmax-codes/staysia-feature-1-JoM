"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNotification } from "@/contexts/NotificationContext";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Auto-load email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("pending_verification_email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error(t('toast.pleaseEnterEmailAndCode'));
      return;
    }

    if (otp.length !== 6) {
      toast.error(t('toast.verificationCodeMustBe6Digits'));
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(t('toast.emailVerifiedSuccess'));
        showNotification(
          "success",
          t('auth.emailVerifiedMessage'),
          { duration: 3000 }
        );
        
        // Clear pending email from localStorage
        localStorage.removeItem("pending_verification_email");
        
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setStatus("error");
        setMessage(data.error || t('toast.verificationFailed'));
        toast.error(data.error || t('toast.invalidVerificationCode'));
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage(t('toast.unexpectedError'));
      toast.error(t('toast.unexpectedError'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    const emailToUse = email || localStorage.getItem("pending_verification_email");
    
    if (!emailToUse) {
      toast.error(t('auth.emailRequired'));
      return;
    }

    setIsResending(true);
    
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('toast.verificationCodeSent'));
        showNotification(
          "info",
          t('toast.resendingVerificationCode'),
          { duration: 5000 }
        );
        setStatus("idle");
      } else {
        toast.error(data.error || t('toast.verificationEmailError'));
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error(t('toast.verificationEmailError'));
    } finally {
      setIsResending(false);
    }
  };

  if (!isReady) {
    return <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center" />;
  }

  // Success state
  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.emailVerified')}</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500">{t('auth.redirectingToHomepage')}</p>
        </div>
      </div>
    );
  }

  // Main OTP input form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#283B73]/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-[#283B73]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.verifyYourEmail')}</h2>
          <p className="text-gray-600">
            {t('auth.enterVerificationCode')}
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>

          <div>
            <Label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.verificationCode')}
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent text-center text-2xl tracking-widest font-semibold"
              placeholder="000000"
              maxLength={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              {t('auth.enter6DigitCode')}
            </p>
          </div>

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('auth.verifyingEmail')}
              </>
            ) : (
              t('auth.verifyEmail')
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('listingWizard.step12.cancel')}</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            variant="outline"
            className="w-full border-[#283B73] text-[#283B73] hover:bg-[#283B73] hover:text-white py-2.5 rounded-lg font-semibold"
          >
            {isResending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('auth.sending')}
              </>
            ) : (
              t('auth.resendCode')
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              {t('auth.returnToHomepage')}
            </Button>
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-xs text-blue-800">
            {t('toast.checkSpamFolder')}
          </p>
        </div>
      </div>
    </div>
  );
}