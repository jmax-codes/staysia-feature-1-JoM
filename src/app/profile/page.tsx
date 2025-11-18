/**
 * Profile Page
 * 
 * User profile management page with three sections:
 * 1. Profile Information - Update name, phone, profile photo
 * 2. Change Email - Update email address with password verification
 * 3. Change Password - Update password with current password verification
 * 
 * Features:
 * - Email verification status tracking
 * - Image upload with preview
 * - Form validation with yup
 * - Authentication required
 * - Internationalization support
 * 
 * @page
 */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { VerificationAlert } from "./components/VerificationAlert";
import { ProfileForm } from "./components/ProfileForm";
import { EmailChangeForm } from "./components/EmailChangeForm";
import { PasswordChangeForm } from "./components/PasswordChangeForm";
import {
  profileSchema,
  emailSchema,
  passwordSchema,
  ProfileFormData,
  EmailFormData,
  PasswordFormData,
} from "./components/validationSchemas";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  
  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  
  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "email" | "password">("profile");
  
  // Data states
  const [userProfile, setUserProfile] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Forms
  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
  });

  const emailForm = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login/user?redirect=" + encodeURIComponent("/profile"));
    }
  }, [session, isPending, router]);

  // Fetch user profile on session load
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("bearer_token");
    if (!token) return;

    try {
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        profileForm.reset({
          name: data.name,
          phone: data.phone || "",
          image: data.image || "",
        });
        emailForm.reset({
          email: data.email,
          password: "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error(t('toast.invalidFileType'));
      return;
    }

    if (file.size > 1048576) {
      toast.error(t('toast.fileSizeTooLarge'));
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      toast.error(t('toast.pleaseLogInAgain'));
      return;
    }

    setIsLoadingProfile(true);

    try {
      let imageUrl = data.image;
      if (imageFile && imagePreview) {
        imageUrl = imagePreview;
      }

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone || null,
          image: imageUrl || null,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        toast.success(t('toast.profileUpdatedSuccess'));
        refetch();
      } else {
        const error = await response.json();
        toast.error(error.error || t('toast.profileUpdateError'));
      }
    } catch (error) {
      toast.error(t('toast.errorOccurred'));
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      toast.error(t('toast.pleaseLogInAgain'));
      return;
    }

    setIsLoadingEmail(true);

    try {
      const response = await fetch("/api/user/change-email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        toast.success(t('toast.emailChangedSuccess'));
        fetchUserProfile();
        refetch();
        emailForm.reset({
          email: data.email,
          password: "",
        });
      } else {
        const error = await response.json();
        toast.error(error.error || t('toast.emailChangeError'));
      }
    } catch (error) {
      toast.error(t('toast.errorOccurred'));
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      toast.error(t('toast.pleaseLogInAgain'));
      return;
    }

    setIsLoadingPassword(true);

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
        passwordForm.reset();
      } else {
        const error = await response.json();
        toast.error(error.error || t('toast.passwordChangeError'));
      }
    } catch (error) {
      toast.error(t('toast.errorOccurred'));
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleSendVerification = async () => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      toast.error(t('toast.pleaseLogInAgain'));
      return;
    }

    setIsSendingVerification(true);

    try {
      const response = await fetch("/api/auth/send-verification", {
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
      setIsSendingVerification(false);
    }
  };

  if (!isReady || isPending) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#283B73]" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] px-8 py-6">
            <h1 className="text-3xl font-bold text-white">{t('profile.title')}</h1>
            <p className="text-white/80 mt-1">{t('profile.subtitle')}</p>
          </div>

          {/* Verification Alert */}
          <VerificationAlert
            isVisible={userProfile && !userProfile.emailVerified}
            isSending={isSendingVerification}
            onSendVerification={handleSendVerification}
            t={t}
          />

          {/* Tabs */}
          <div className="border-b border-gray-200 px-8 mt-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-4 px-2 font-semibold text-sm transition-all ${
                  activeTab === "profile"
                    ? "text-[#283B73] border-b-2 border-[#283B73]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t('profile.profileInformation')}
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`pb-4 px-2 font-semibold text-sm transition-all ${
                  activeTab === "email"
                    ? "text-[#283B73] border-b-2 border-[#283B73]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t('profile.changeEmail')}
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`pb-4 px-2 font-semibold text-sm transition-all ${
                  activeTab === "password"
                    ? "text-[#283B73] border-b-2 border-[#283B73]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t('profile.changePassword')}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === "profile" && (
              <ProfileForm
                form={profileForm}
                isLoading={isLoadingProfile}
                userProfile={userProfile}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onSubmit={onProfileSubmit}
                t={t}
              />
            )}

            {activeTab === "email" && (
              <EmailChangeForm
                form={emailForm}
                isLoading={isLoadingEmail}
                currentEmail={userProfile?.email || ""}
                showPassword={showEmailPassword}
                onTogglePassword={() => setShowEmailPassword(!showEmailPassword)}
                onSubmit={onEmailSubmit}
                t={t}
              />
            )}

            {activeTab === "password" && (
              <PasswordChangeForm
                form={passwordForm}
                isLoading={isLoadingPassword}
                showCurrent={showCurrentPassword}
                showNew={showNewPassword}
                showConfirm={showConfirmPassword}
                onToggleCurrent={() => setShowCurrentPassword(!showCurrentPassword)}
                onToggleNew={() => setShowNewPassword(!showNewPassword)}
                onToggleConfirm={() => setShowConfirmPassword(!showConfirmPassword)}
                onSubmit={onPasswordSubmit}
                t={t}
              />
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            {t('auth.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}