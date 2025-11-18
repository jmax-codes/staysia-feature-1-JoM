"use client";

import { Navbar } from "@/components/Navbar";
import { Briefcase, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function CareersPage() {
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
            {t('careers.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('careers.subtitle')}
          </p>
        </div>

        {/* Why Work Here Section */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('careers.whyStaysia')}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#283B73]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('careers.fastGrowth')}</h3>
              <p className="text-sm text-gray-600">
                {t('careers.fastGrowthDescription')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#283B73]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('careers.innovation')}</h3>
              <p className="text-sm text-gray-600">
                {t('careers.innovationDescription')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#283B73]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('careers.impact')}</h3>
              <p className="text-sm text-gray-600">
                {t('careers.impactDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Open Position */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('careers.openPositions')}</h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-[#FFB400]/20 hover:border-[#FFB400] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('careers.administrator')}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Jakarta, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{t('careers.fullTime')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{t('careers.immediateStart')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">{t('careers.aboutRole')}</h4>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t('careers.roleDescription')}
              </p>

              <h4 className="font-semibold text-gray-900 mb-3">{t('careers.keyResponsibilities')}</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>{t('careers.responsibility1')}</li>
                <li>{t('careers.responsibility2')}</li>
                <li>{t('careers.responsibility3')}</li>
                <li>{t('careers.responsibility4')}</li>
                <li>{t('careers.responsibility5')}</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mb-3">{t('careers.requirements')}</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>{t('careers.requirement1')}</li>
                <li>{t('careers.requirement2')}</li>
                <li>{t('careers.requirement3')}</li>
                <li>{t('careers.requirement4')}</li>
                <li>{t('careers.requirement5')}</li>
              </ul>
            </div>

            <button className="w-full sm:w-auto px-8 py-3 bg-[#283B73] text-white font-semibold rounded-lg hover:bg-[#1e2d54] transition-colors">
              {t('careers.applyNow')}
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d54] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">{t('careers.noRightRole')}</h2>
          <p className="text-white/80 mb-6">
            {t('careers.sendResume')}
          </p>
          <Link 
            href="/contact-us"
            className="inline-block px-8 py-3 bg-[#FFB400] text-[#283B73] font-semibold rounded-lg hover:bg-[#e6a300] transition-colors"
          >
            {t('careers.contactUs')}
          </Link>
        </div>
      </main>
    </div>
  );
}