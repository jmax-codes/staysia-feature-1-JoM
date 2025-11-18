"use client";

import { Navbar } from "@/components/Navbar";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();

  if (!isReady) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('legal.privacyPolicy.title')}
          </h1>
          <p className="text-white/80 text-lg">
            {t('legal.privacyPolicy.lastUpdated', { date: 'January 2025' })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-600 leading-relaxed mb-4">
            {t('legal.privacyPolicy.introText')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            By using Staysia's services, you agree to the collection and use of information in accordance with 
            this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>

        {/* Key Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">1. {t('legal.privacyPolicy.informationWeCollect')}</h2>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('legal.privacyPolicy.personalInfo')}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {t('legal.privacyPolicy.informationWeCollectText')}
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {t('legal.privacyPolicy.personalInfoItems', { returnObjects: true }).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#FFB400] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('legal.privacyPolicy.automaticInfo')}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  We automatically collect certain information about your device and usage patterns:
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {t('legal.privacyPolicy.automaticInfoItems', { returnObjects: true }).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#FFB400] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">2. {t('legal.privacyPolicy.howWeUseInfo')}</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 text-sm mb-4">{t('legal.privacyPolicy.howWeUseInfoText')}</p>
              <ul className="space-y-3 text-gray-600 text-sm">
                {t('legal.privacyPolicy.usageItems', { returnObjects: true }).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#FFB400] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">3. {t('legal.privacyPolicy.dataSecurity')}</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 text-sm mb-4">
                {t('legal.privacyPolicy.dataSecurityText')}
              </p>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB400] mt-1">•</span>
                  <span>Encryption of data in transit and at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB400] mt-1">•</span>
                  <span>Regular security assessments and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB400] mt-1">•</span>
                  <span>Restricted access to personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB400] mt-1">•</span>
                  <span>Secure payment processing through trusted providers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">4. {t('legal.privacyPolicy.yourRights')}</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 text-sm mb-4">{t('legal.privacyPolicy.yourRightsText')}</p>
              <ul className="space-y-3 text-gray-600 text-sm">
                {t('legal.privacyPolicy.rightsItems', { returnObjects: true }).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#FFB400] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 text-sm mb-6">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain 
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is 
              being sent.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
            <p className="text-gray-600 text-sm mb-6">
              Our platform may contain links to third-party websites or services. We are not responsible for the 
              privacy practices of these third parties.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">7. {t('legal.privacyPolicy.childrensPrivacy')}</h2>
            <p className="text-gray-600 text-sm mb-6">
              {t('legal.privacyPolicy.childrensPrivacyText')}
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">8. {t('legal.privacyPolicy.changesToPolicy')}</h2>
            <p className="text-gray-600 text-sm">
              {t('legal.privacyPolicy.changesToPolicyText')}
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] rounded-2xl shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h3>
            <p className="text-white/90 mb-6">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FFB400] text-white font-semibold hover:bg-[#e6a200] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}