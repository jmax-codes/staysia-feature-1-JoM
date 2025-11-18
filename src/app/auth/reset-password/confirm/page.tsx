"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

const confirmResetSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type ConfirmResetFormData = yup.InferType<typeof confirmResetSchema>;

export default function ConfirmResetPasswordPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState("idle");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmResetFormData>({
    resolver: yupResolver(confirmResetSchema),
  });

  useEffect(() => {
    if (!token) {
      setTokenError(true);
      toast.error(t('auth.invalidResetLink'));
    }
  }, [token, t]);

  const onSubmit = async (data: ConfirmResetFormData) => {
    if (!token) {
      toast.error(t('auth.invalidResetLink'));
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        toast.success(t('toast.passwordResetSuccess'));
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/auth/login/user?reset=success");
        }, 2000);
      } else {
        if (result.code === "INVALID_TOKEN") {
          toast.error(t('toast.invalidResetLink'));
          setTokenError(true);
        } else {
          toast.error(result.error || t('toast.passwordResetError'));
        }
        setIsVerifying(false);
      }
    } catch (error) {
      toast.error(t('toast.errorOccurred'));
      setIsVerifying(false);
    }
  };

  if (!isReady) {
    return <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center" />;
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.invalidResetLink')}</h2>
          <p className="text-gray-600 mb-6">
            {t('auth.invalidResetLinkMessage')}
          </p>
          
          <div className="space-y-3">
            <Link href="/auth/reset-password">
              <Button className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-2.5 rounded-lg font-semibold">
                {t('auth.requestNewResetLink')}
              </Button>
            </Link>
            
            <Link href="/auth/login/user">
              <Button
                variant="outline"
                className="w-full border-[#283B73] text-[#283B73] hover:bg-[#283B73] hover:text-white py-2.5 rounded-lg font-semibold"
              >
                {t('auth.backToLogin')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.passwordResetSuccessful')}</h2>
          <p className="text-gray-600 mb-6">
            {t('auth.passwordResetSuccessMessage')}
          </p>
          
          <Link href="/auth/login/user?reset=success">
            <Button className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-2.5 rounded-lg font-semibold">
              {t('auth.continueToLogin')}
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500 mt-4">{t('auth.redirectingToLogin')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md pt-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('auth.createNewPasswordTitle')}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {t('auth.createNewPasswordSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.newPassword')}
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all pr-11"
                  placeholder="••••••••"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmNewPassword')}
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all pr-11"
                  placeholder="••••••••"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                  {t('auth.resettingPassword')}
                </>
              ) : (
                t('auth.resetPassword')
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/auth/login/user"
                className="text-sm text-[#283B73] hover:text-[#1e2d5a] font-semibold"
              >
                {t('auth.backToLogin')}
              </Link>
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