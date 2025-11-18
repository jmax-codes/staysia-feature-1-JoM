"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { useTranslation } from "react-i18next";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  rememberMe: yup.boolean().default(false),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  
  const registered = searchParams.get("registered");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const { data: session, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        callbackURL: "/",
      });

      // CRITICAL: Check for ANY error or missing session
      if (error || !session?.user) {
        toast.error(t('auth.wrongLoginCredentials'));
        setIsLoading(false);
        return;
      }

      // Update auth store only after successful authentication
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: (session.user as any).role || "user",
          phone: (session.user as any).phone,
          emailVerified: session.user.emailVerified,
        });
      }

      toast.success(t('navbar.welcomeBack'));
      
      // Redirect
      const redirect = searchParams.get("redirect");
      const destination = redirect ? decodeURIComponent(redirect) : "/";
      
      // Force full page reload to update session state
      setTimeout(() => {
        window.location.href = destination;
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(t('auth.wrongLoginCredentials'));
      setIsLoading(false);
    }
  };

  return (
    <div>
      {registered === "true" && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          {t('auth.accountCreatedSuccess')}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.email')}
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

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.password')}
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

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            {...register("rememberMe")}
            type="checkbox"
            id="rememberMe"
            className="w-4 h-4 text-[#283B73] border-gray-300 rounded focus:ring-[#283B73]"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            {t('auth.rememberMe')}
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('auth.loggingIn')}
            </>
          ) : (
            t('auth.login')
          )}
        </Button>

        {/* Social Login Buttons */}
        <SocialLoginButtons callbackURL="/" mode="login" />

        {/* Switch to Register */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            {t('auth.dontHaveAccount')}{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#283B73] hover:text-[#1e2d5a] font-semibold"
            >
              {t('auth.signUpHere')}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}