"use client";

import { Navbar } from "@/components/Navbar";
import { Newspaper, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function PressPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#283B73] mb-6">
            <Newspaper className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('press.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('press.subtitle')}
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('press.comingSoon')}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {t('press.comingSoonDescription')}
            </p>
            
            <div className="inline-flex items-center gap-2 text-[#FFB400] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FFB400] animate-pulse"></span>
              <span>{t('press.updatesInProgress')}</span>
            </div>
          </div>
        </div>

        {/* Media Contact Section */}
        <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d54] rounded-2xl p-8 sm:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#FFB400] flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-[#283B73]" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-3">{t('press.mediaInquiries')}</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                {t('press.mediaDescription')}
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-white/60 text-sm mb-1">{t('press.email')}</p>
                  <a 
                    href="mailto:press@staysia.com" 
                    className="text-[#FFB400] font-semibold hover:underline"
                  >
                    press@staysia.com
                  </a>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">{t('press.responseTime')}</p>
                  <p className="text-white font-medium">{t('press.responseTimeValue')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-3xl font-bold text-[#283B73] mb-2">2025</p>
            <p className="text-gray-600 text-sm">{t('press.founded')}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-3xl font-bold text-[#283B73] mb-2">Indonesia</p>
            <p className="text-gray-600 text-sm">{t('press.headquarters')}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-3xl font-bold text-[#283B73] mb-2">{t('press.growing')}</p>
            <p className="text-gray-600 text-sm">{t('press.teamSize')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}