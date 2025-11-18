/**
 * Password Change Card Component
 * 
 * Form for changing user password.
 * Validates current password and requires confirmation.
 * 
 * @module account-settings/components/PasswordChangeCard
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("newPassword")], "Passwords must match").required("Please confirm your password"),
});

type PasswordFormData = yup.InferType<typeof passwordSchema>;

/**
 * Password change form card
 * 
 * Provides secure password change functionality with validation.
 * Requires current password for security.
 * 
 */
export function PasswordChangeCard() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      toast.error(t('toast.pleaseLogInAgain'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (response.ok) {
        toast.success(t('toast.passwordChangedSuccess'));
        form.reset();
      } else {
        const error = await response.json();
        toast.error(error.error || t('toast.passwordChangeError'));
      }
    } catch (error) {
      toast.error(t('toast.errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] px-6 py-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold text-white">{t('accountSettings.changePassword')}</h2>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.currentPassword')}
            </label>
            <div className="relative">
              <input
                {...form.register("currentPassword")}
                type={showCurrent ? "text" : "password"}
                id="currentPassword"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all pr-11"
                placeholder="••••••••"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.formState.errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.newPassword')}
            </label>
            <div className="relative">
              <input
                {...form.register("newPassword")}
                type={showNew ? "text" : "password"}
                id="newPassword"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all pr-11"
                placeholder="••••••••"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.formState.errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.confirmNewPassword')}
            </label>
            <div className="relative">
              <input
                {...form.register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all pr-11"
                placeholder="••••••••"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#283B73] hover:bg-[#1e2d5a] text-white px-6 py-2.5 rounded-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('accountSettings.changingPassword')}
              </>
            ) : (
              t('accountSettings.changePassword')
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
