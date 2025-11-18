/**
 * Profile Information Form Component
 * 
 * Allows users to update their profile information including:
 * - Profile photo
 * - Full name
 * - Phone number
 * - View account role and verification status
 * 
 * @component
 * @param {UseFormReturn} form - React Hook Form instance
 * @param {boolean} isLoading - Whether form is submitting
 * @param {object} userProfile - User profile data
 * @param {string | null} imagePreview - Preview URL for uploaded image
 * @param {Function} onImageChange - Handler for image file selection
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} t - Translation function
 */

"use client";

import { UseFormReturn } from "react-hook-form";
import { Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  userProfile: any;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: any) => void;
  t: (key: string) => string;
}

export function ProfileForm({
  form,
  isLoading,
  userProfile,
  imagePreview,
  onImageChange,
  onSubmit,
  t,
}: ProfileFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Image */}
      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {imagePreview || userProfile?.image ? (
              <img
                src={imagePreview || userProfile?.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <label
            htmlFor="image-upload"
            className="absolute bottom-0 right-0 bg-[#283B73] rounded-full p-2 cursor-pointer hover:bg-[#1e2d5a] transition-colors"
          >
            <Camera className="w-4 h-4 text-white" />
            <input
              id="image-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{t('profile.profilePhoto')}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {t('profile.profilePhotoHint')}
          </p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          {t('auth.fullName')}
        </label>
        <input
          {...form.register("name")}
          type="text"
          id="name"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
          placeholder={t('auth.fullNamePlaceholder')}
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile.phoneNumber')}
        </label>
        <input
          {...form.register("phone")}
          type="tel"
          id="phone"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
          placeholder={t('profile.phoneNumberPlaceholder')}
        />
        {form.formState.errors.phone && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      {/* Role & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('profile.accountRole')}
          </label>
          <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
            {userProfile?.role === "tenant" ? t('profile.tenantRole') : t('profile.userRole')}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('profile.verificationStatus')}
          </label>
          <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2">
            {userProfile?.emailVerified ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-700 font-medium">{t('profile.verified')}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-700 font-medium">{t('profile.notVerified')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-[#283B73] hover:bg-[#1e2d5a] text-white px-6 py-2.5 rounded-lg font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {t('profile.saving')}
          </>
        ) : (
          t('profile.saveChanges')
        )}
      </Button>
    </form>
  );
}
