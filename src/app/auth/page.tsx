"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function AuthPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [mode, setMode] = useState<"login" | "register">("login");

  if (!isReady) {
    return <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md pt-16">
        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-md font-semibold transition-all ${
              mode === "login" ?
              "bg-white text-[#283B73] shadow-sm" :
              "text-gray-600 hover:text-gray-900"}`
              }>

              {t('auth.login')}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-md font-semibold transition-all ${
              mode === "register" ?
              "bg-white text-[#283B73] shadow-sm" :
              "text-gray-600 hover:text-gray-900"}`
              }>

              {t('auth.signUp')}
            </button>
          </div>

          {/* Forms */}
          {mode === "login" ?
          <LoginForm onSwitchToRegister={() => setMode("register")} /> :

          <RegisterForm onSwitchToLogin={() => setMode("login")} />
          }
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors text-sm">

            {t('auth.backToHome')}
          </Link>
        </div>
      </div>
    </div>);

}