"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

const registerSchema = yup.object({
  name: yup.string().required("Full name is required").min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup.string().optional(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailAvailability, setEmailAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
    email: string;
  }>({ checking: false, available: null, email: "" });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const emailValue = watch("email");

  // Debounced email checking function
  const checkEmailAvailability = useCallback(
    debounce(async (email: string) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailAvailability({ checking: false, available: null, email: "" });
        return;
      }

      setEmailAvailability({ checking: true, available: null, email });

      try {
        const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        setEmailAvailability({
          checking: false,
          available: data.available,
          email,
        });
      } catch (error) {
        setEmailAvailability({ checking: false, available: null, email: "" });
      }
    }, 400),
    []
  );

  // Watch email field and trigger debounced check
  useEffect(() => {
    if (emailValue) {
      checkEmailAvailability(emailValue);
    } else {
      setEmailAvailability({ checking: false, available: null, email: "" });
    }
  }, [emailValue, checkEmailAvailability]);

  const onSubmit = async (data: RegisterFormData) => {
    // Check email availability before submitting
    if (emailAvailability.available === false) {
      toast.error(t('auth.emailAlreadyRegistered'));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      if (error?.code) {
        if (error.code === "USER_ALREADY_EXISTS") {
          toast.error(t('auth.emailAlreadyRegistered'));
        } else {
          toast.error(t('auth.registrationFailed'));
        }
        setIsLoading(false);
        return;
      }

      toast.success(t('auth.accountCreatedSuccess'));
      router.push("/auth?registered=true");
    } catch (err) {
      toast.error(t('auth.errorOccurred'));
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.fullName')}
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
            placeholder={t('auth.fullNamePlaceholder')}
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.email')}
          </label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              id="register-email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all pr-11"
              placeholder={t('auth.emailPlaceholder')}
              autoComplete="email"
            />
            {/* Email availability indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {emailAvailability.checking && emailValue && (
                <Loader className="w-5 h-5 text-gray-400 animate-spin" />
              )}
              {!emailAvailability.checking &&
                emailAvailability.available === true &&
                emailValue === emailAvailability.email && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              {!emailAvailability.checking &&
                emailAvailability.available === false &&
                emailValue === emailAvailability.email && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
            </div>
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          {!errors.email &&
            emailAvailability.available === false &&
            emailValue === emailAvailability.email && (
              <p className="mt-1 text-sm text-red-600">
                {t('auth.emailAlreadyRegistered')}
              </p>
            )}
          {!errors.email &&
            emailAvailability.available === true &&
            emailValue === emailAvailability.email && (
              <p className="mt-1 text-sm text-green-600">{t('auth.emailAvailable')}</p>
            )}
        </div>

        {/* Phone (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.phoneNumberOptional')}
          </label>
          <input
            {...register("phone")}
            type="tel"
            id="phone"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
            placeholder="+62 812 3456 7890"
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.password')}
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="register-password"
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

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.confirmPassword')}
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || emailAvailability.available === false}
          className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('auth.creatingAccount')}
            </>
          ) : (
            t('auth.signUp')
          )}
        </Button>

        {/* Switch to Login */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            {t('auth.alreadyHaveAccount')}{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#283B73] hover:text-[#1e2d5a] font-semibold"
            >
              {t('auth.logInHere')}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}