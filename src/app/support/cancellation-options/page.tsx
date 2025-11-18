"use client";

import { Navbar } from "@/components/Navbar";
import { XCircle, UserX, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function CancellationOptionsPage() {
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
            <XCircle className="w-10 h-10 text-[#283B73]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('cancellation.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('cancellation.subtitle')}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Cancel Order (User) Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('cancellation.cancelOrder')}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{t('cancellation.forGuests')}</p>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    {t('cancellation.cancelBeforeUpload')}
                  </p>
                  <p>
                    {t('cancellation.autoCancel')}
                  </p>
                  
                  <div className="mt-6 p-6 bg-yellow-50 rounded-xl border-l-4 border-yellow-400 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t('cancellation.importantNote')}</h3>
                      <p className="text-gray-700">
                        {t('cancellation.afterUpload')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cancel User Order (Tenant) Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFB400]/10 flex-shrink-0">
                <UserX className="w-6 h-6 text-[#283B73]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('cancellation.cancelUserOrder')}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{t('cancellation.forHosts')}</p>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    {t('cancellation.cancelNoProof')}
                  </p>
                  <p>
                    {t('cancellation.confirmationPopup')}
                  </p>
                  
                  <div className="mt-6 p-6 bg-[#FAFAFA] rounded-xl border-l-4 border-[#283B73]">
                    <h3 className="font-semibold text-gray-900 mb-3">{t('cancellation.cancellationProcess')}</h3>
                    <ol className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#283B73] text-white text-sm font-bold flex-shrink-0">1</span>
                        <span>{t('cancellation.step1')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#283B73] text-white text-sm font-bold flex-shrink-0">2</span>
                        <span>{t('cancellation.step2')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#283B73] text-white text-sm font-bold flex-shrink-0">3</span>
                        <span>{t('cancellation.step3')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#283B73] text-white text-sm font-bold flex-shrink-0">4</span>
                        <span>{t('cancellation.step4')}</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cancellation Timeline */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('cancellation.timeline')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('cancellation.beforePayment')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('cancellation.beforePaymentDesc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('cancellation.afterPayment')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('cancellation.afterPaymentDesc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('cancellation.afterCheckin')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('cancellation.afterCheckinDesc')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d54] rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">{t('cancellation.questions')}</h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              {t('cancellation.questionsDesc')}
            </p>
            <Link 
              href="/contact-us"
              className="inline-block px-6 py-3 bg-[#FFB400] text-[#283B73] font-semibold rounded-lg hover:bg-[#e6a300] transition-colors"
            >
              {t('cancellation.contactSupport')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}