"use client";

import { Navbar } from "@/components/Navbar";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function AboutPage() {
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
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission')}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {t('about.missionText1')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('about.missionText2')}
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('about.ourTeam')}</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Forentino - CEO */}
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-full bg-[#283B73] flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Forentino</h3>
              <p className="text-[#FFB400] font-semibold mb-3">{t('about.ceo')}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('about.ceoDescription')}
              </p>
            </div>

            {/* Jonathan - CFO */}
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-full bg-[#283B73] flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Jonathan</h3>
              <p className="text-[#FFB400] font-semibold mb-3">{t('about.cfo')}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('about.cfoDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d54] rounded-2xl p-8 sm:p-12 text-white">
          <h2 className="text-2xl font-bold mb-6">{t('about.ourValues')}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-[#FFB400]">{t('about.trust')}</h3>
              <p className="text-white/80 text-sm">
                {t('about.trustDescription')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-[#FFB400]">{t('about.quality')}</h3>
              <p className="text-white/80 text-sm">
                {t('about.qualityDescription')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-[#FFB400]">{t('about.community')}</h3>
              <p className="text-white/80 text-sm">
                {t('about.communityDescription')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}