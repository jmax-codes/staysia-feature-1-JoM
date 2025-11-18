"use client";

import { Navbar } from "@/components/Navbar";
import { Shield, Bed, CreditCard, ListChecks } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function SafetyInformationPage() {
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#283B73]/10 mb-6">
            <Shield className="w-10 h-10 text-[#283B73]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('safetyInfo.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('safetyInfo.subtitle')}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Room Reservation Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFB400]/10 flex-shrink-0">
                <Bed className="w-6 h-6 text-[#283B73]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('safetyInfo.roomReservation')}
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    {t('safetyInfo.roomReservationDesc')}
                  </p>
                  <p>
                    <strong>{t('safetyInfo.important')}</strong> {t('safetyInfo.cannotProcess')}
                  </p>
                  <p>
                    {t('safetyInfo.autoProcessed')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Upload Payment Proof Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFB400]/10 flex-shrink-0">
                <CreditCard className="w-6 h-6 text-[#283B73]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('safetyInfo.uploadPayment')}
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    {t('safetyInfo.manualTransfer')}
                  </p>
                  <p>
                    <strong className="text-red-600">{t('safetyInfo.timeLimit')}</strong> {t('safetyInfo.timeLimitDesc')}
                  </p>
                  <p>
                    {t('safetyInfo.autoCancel')}
                  </p>
                  
                  <div className="mt-6 p-6 bg-[#FAFAFA] rounded-xl border-l-4 border-[#FFB400]">
                    <h3 className="font-semibold text-gray-900 mb-3">{t('safetyInfo.validationRules')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFB400] font-bold mt-1">•</span>
                        <span>{t('safetyInfo.onlyJpgPng')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFB400] font-bold mt-1">•</span>
                        <span>{t('safetyInfo.maxSize')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Order List Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFB400]/10 flex-shrink-0">
                <ListChecks className="w-6 h-6 text-[#283B73]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('safetyInfo.orderList')}
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    {t('safetyInfo.orderListDesc')}
                  </p>
                  <p>
                    {t('safetyInfo.searchOrders')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d54] rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">{t('safetyInfo.needHelp')}</h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              {t('safetyInfo.supportDesc')}
            </p>
            <Link 
              href="/contact-us"
              className="inline-block px-6 py-3 bg-[#FFB400] text-[#283B73] font-semibold rounded-lg hover:bg-[#e6a300] transition-colors"
            >
              {t('safetyInfo.contactSupport')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}