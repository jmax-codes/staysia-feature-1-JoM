"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

const resetSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

type ResetFormData = yup.InferType<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetFormData>({
    resolver: yupResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setEmailSent(true);
        toast.success(t('toast.passwordResetEmailSent'));
      } else {
        toast.error(result.error || t('toast.passwordResetError'));
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(t('toast.errorOccurred'));
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center" />;
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-[#283B73]" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.checkYourEmail')}</h2>
          <p className="text-gray-600 mb-6">
            {t('auth.checkEmailMessage')} <strong>{getValues("email")}</strong>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>{t('auth.nextSteps')}</strong>
            </p>
            <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
              <li>{t('auth.checkEmailInbox')}</li>
              <li>{t('auth.clickResetLink')}</li>
              <li>{t('auth.createNewPassword')}</li>
            </ol>
          </div>

          <Link href="/auth/login/user">
            <Button className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-2.5 rounded-lg font-semibold mb-3">
              {t('auth.backToLogin')}
            </Button>
          </Link>

          <button
            onClick={() => {
              setEmailSent(false);
              setIsLoading(false);
            }}
            className="text-sm text-[#283B73] hover:text-[#1e2d5a] font-semibold"
          >
            {t('auth.didntReceiveEmail')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md pt-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('auth.resetPassword')}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {t('auth.resetPasswordSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.emailAddress')}
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('auth.sendingResetLink')}
                </>
              ) : (
                t('auth.sendResetLink')
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                {t('auth.rememberPassword')}{" "}
                <Link href="/auth/login/user" className="text-[#283B73] hover:text-[#1e2d5a] font-semibold">
                  {t('auth.logInHere')}
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm">
            {t('auth.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}