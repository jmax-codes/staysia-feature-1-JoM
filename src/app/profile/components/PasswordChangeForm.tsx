/**
 * Password Change Form Component
 * 
 * Allows users to change their password by providing:
 * - Current password for verification
 * - New password (minimum 8 characters)
 * - Password confirmation
 * 
 * @component
 * @param {UseFormReturn} form - React Hook Form instance
 * @param {boolean} isLoading - Whether form is submitting
 * @param {boolean} showCurrent - Whether to show current password
 * @param {boolean} showNew - Whether to show new password
 * @param {boolean} showConfirm - Whether to show confirm password
 * @param {Function} onToggleCurrent - Handler to toggle current password visibility
 * @param {Function} onToggleNew - Handler to toggle new password visibility
 * @param {Function} onToggleConfirm - Handler to toggle confirm password visibility
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} t - Translation function
 */

"use client";

import { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordChangeFormProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  onToggleCurrent: () => void;
  onToggleNew: () => void;
  onToggleConfirm: () => void;
  onSubmit: (data: any) => void;
  t: (key: string) => string;
}

export function PasswordChangeForm({
  form,
  isLoading,
  showCurrent,
  showNew,
  showConfirm,
  onToggleCurrent,
  onToggleNew,
  onToggleConfirm,
  onSubmit,
  t,
}: PasswordChangeFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            onClick={onToggleCurrent}
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
            onClick={onToggleNew}
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
            onClick={onToggleConfirm}
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
          t('profile.changePassword')
        )}
      </Button>
    </form>
  );
}
