"use client";

import { Navbar } from "@/components/Navbar";
import { FileCheck, List, CreditCard, Mail, Clock } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function HostResourcesPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('hostResources.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            {t('hostResources.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🧾 {t('hostResources.intro')}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t('hostResources.introDesc')}
            </p>
          </div>

          {/* Transaction Confirmation */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('hostResources.transactionConfirmation')}</h3>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {t('hostResources.transactionDesc')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#FFB400] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    {t('hostResources.ownedProperties')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#FFB400] mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    {t('hostResources.autoEmail')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Order List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <List className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">📋 {t('hostResources.orderList')}</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed">
                {t('hostResources.orderListDesc')}
              </p>
            </div>
          </div>

          {/* Confirm Payment */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">💳 {t('hostResources.confirmPayment')}</h3>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {t('hostResources.confirmPaymentDesc')}
              </p>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="text-red-800 font-semibold mb-2">{t('hostResources.ifRejected')}</p>
                <p className="text-red-700">{t('hostResources.returnToWaiting')}</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="text-green-800 font-semibold mb-2">{t('hostResources.ifApproved')}</p>
                <p className="text-green-700 mb-2">{t('hostResources.statusProcessing')}</p>
                <p className="text-green-700">{t('hostResources.notifyUser')}</p>
              </div>
            </div>
          </div>

          {/* Order Reminder */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">📧 {t('hostResources.orderReminder')}</h3>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {t('hostResources.orderReminderDesc')}
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-blue-900 font-semibold mb-3">{t('hostResources.emailContains')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-blue-800">{t('hostResources.bookingDetails')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-blue-800">{t('hostResources.propertyGuidelines')}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-900 font-semibold mb-2">{t('hostResources.autoReminder')}</p>
                    <p className="text-amber-800">
                      {t('hostResources.autoReminderDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] rounded-2xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t('hostResources.readyToHost')}
            </h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              {t('hostResources.readyToHostDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register/tenant"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FFB400] text-white font-semibold hover:bg-[#e6a200] transition-colors"
              >
                {t('hostResources.becomeHost')}
              </Link>
              <Link
                href="/help-center"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-[#283B73] font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('hostResources.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}