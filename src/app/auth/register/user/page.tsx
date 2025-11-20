"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, Home, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserRegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('toast.passwordsDoNotMatch'));
      return;
    }

    if (formData.password.length < 8) {
      toast.error(t('toast.passwordMinLength'));
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (error?.code) {
        const errorCode = String(error.code).trim();
        
        if (errorCode === "USER_ALREADY_EXISTS") {
          router.push("/auth/login/user?registered=true&email=" + encodeURIComponent(formData.email));
          return;
        }
        
        const errorMap: Record<string, string> = {
          USER_ALREADY_EXISTS: t('toast.emailAlreadyRegistered'),
        };
        toast.error(errorMap[errorCode] || t('toast.registrationFailed'));
        setIsLoading(false);
        return;
      }

      toast.success(t('navbar.welcomeToStaysia'));
      setIsSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t('toast.registrationError'));
      setIsLoading(false);
    }
  };

  const handleReturnHome = () => {
    toast.success(t('navbar.welcomeToStaysia'));
    window.location.href = "/";
  };

  const handleVerifyEmail = () => {
    router.push("/auth/verify-email");
  };

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md pt-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('auth.createUserAccount')}</h2>
              <p className="text-sm text-gray-600 mt-2">{t('auth.registerAsGuest')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.fullName')}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
                  placeholder={t('auth.fullNamePlaceholder')}
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.email')}
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
                  placeholder={t('auth.emailPlaceholder')}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.password')}
                </Label>
                <Input
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.confirmPassword')}
                </Label>
                <Input
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#283B73] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  autoComplete="off"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('auth.creatingAccount')}
                  </>
                ) : (
                  t('auth.createUserAccount')
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  {t('auth.alreadyHaveAccount')}{" "}
                  <Link href="/auth/login/user" className="text-[#283B73] hover:text-[#1e2d5a] font-semibold">
                    {t('auth.logInHere')}
                  </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {t('auth.wantToList')}{" "}
                  <Link href="/auth/register/tenant" className="text-[#FFB400] hover:text-[#e6a300] font-semibold">
                    {t('auth.registerAsTenant')}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.accountCreated')}</h2>
            <p className="text-gray-600 mb-6">
              {t('auth.accountCreatedMessage')}
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleReturnHome}
                className="w-full bg-[#283B73] hover:bg-[#1e2d5a] text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                {t('auth.returnToHomepage')}
              </Button>

              <Button
                onClick={handleVerifyEmail}
                variant="outline"
                className="w-full border-2 border-[#283B73] text-[#283B73] hover:bg-[#283B73] hover:text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                {t('auth.verifyEmail')}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {t('auth.verifyEmailLater')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}