"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowRegisteredMessage(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: searchParams.get("redirect") || "/",
      });

      if (error?.code) {
        toast.error(t('toast.invalidEmailOrPassword'));
        setIsLoading(false);
        return;
      }

      toast.success(t('navbar.welcomeBack'));

      const redirectUrl = searchParams.get("redirect") || "/";
      router.push(redirectUrl);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t('toast.loginError'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md pt-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('auth.userLogin')}</h2>
            <p className="text-sm text-gray-600 mt-2">{t('auth.userLoginSubtitle')}</p>
          </div>

          {showRegisteredMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              {t('auth.accountCreatedSuccess')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <Input
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type="password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  {t('auth.rememberMe')}
                </label>
              </div>
              <Link href="/auth/reset-password" className="text-sm text-[#283B73] hover:text-[#1e2d5a] font-semibold">
                {t('auth.forgotPassword')}
              </Link>
            </div>

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

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                {t('auth.dontHaveAccount')}{" "}
                <Link href="/auth/register/user" className="text-[#283B73] hover:text-[#1e2d5a] font-semibold">
                  {t('auth.signUpHere')}
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {t('auth.areYouPropertyOwner')}{" "}
                <Link href="/auth/login/tenant" className="text-[#FFB400] hover:text-[#e6a300] font-semibold">
                  {t('auth.loginAsTenant')}
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