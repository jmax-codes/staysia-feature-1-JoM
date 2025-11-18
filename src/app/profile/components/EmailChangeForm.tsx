/**
 * Email Change Form Component
 * 
 * Allows users to change their email address with password confirmation.
 * Displays current email and requires password for security.
 * 
 * @component
 * @param {UseFormReturn} form - React Hook Form instance
 * @param {boolean} isLoading - Whether form is submitting
 * @param {string} currentEmail - User's current email address
 * @param {boolean} showPassword - Whether to show password field
 * @param {Function} onTogglePassword - Handler to toggle password visibility
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} t - Translation function
 */

"use client";

import { UseFormReturn } from "react-hook-form";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailChangeFormProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  currentEmail: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (data: any) => void;
  t: (key: string) => string;
}

export function EmailChangeForm({
  form,
  isLoading,
  currentEmail,
  showPassword,
  onTogglePassword,
  onSubmit,
  t,
}: EmailChangeFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              {t('profile.emailChangeNotice')}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {t('profile.emailChangeNoticeMessage')}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile.currentEmailLabel')}
        </label>
        <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
          {currentEmail}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile.newEmailAddress')}
        </label>
        <input
          {...form.register("email")}
          type="email"
          id="email"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
          placeholder={t('profile.newEmailPlaceholder')}
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email-password" className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile.confirmPasswordLabel')}
        </label>
        <div className="relative">
          <input
            {...form.register("password")}
            type={showPassword ? "text" : "password"}
            id="email-password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all pr-11"
            placeholder="••••••••"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.password.message}
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
            {t('profile.changingEmail')}
          </>
        ) : (
          t('profile.changeEmail')
        )}
      </Button>
    </form>
  );
}
