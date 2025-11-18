/**
 * Cookie Policy Page
 * 
 * Explains cookie usage, types, and user controls.
 * Complies with privacy regulations and transparency requirements.
 * 
 * @module app/legal/cookie-policy
 */

"use client";

import { Navbar } from "@/components/Navbar";
import { Cookie, Settings, Eye, Shield } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { PolicySection, CookieType, UsageCategory } from "./components/PolicySection";

/**
 * Cookie policy page component
 * 
 * Provides comprehensive information about cookie usage.
 */
export default function CookiePolicyPage() {
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
              <Cookie className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('legal.cookiePolicy.title')}
          </h1>
          <p className="text-white/80 text-lg">
            {t('legal.cookiePolicy.lastUpdated', { date: 'January 2025' })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-600 leading-relaxed mb-4">
            {t('legal.cookiePolicy.introText')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            Cookies are small text files that are placed on your device when you visit our website.
          </p>
        </div>

        <div className="space-y-8">
          {/* What Are Cookies */}
          <PolicySection icon={Cookie} title={`1. ${t('legal.cookiePolicy.whatAreCookies')}`}>
            <p className="text-gray-600 text-sm mb-4">
              {t('legal.cookiePolicy.whatAreCookiesText')}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-blue-900 font-semibold mb-2">{t('legal.cookiePolicy.typesOfCookies')}:</p>
              <ul className="space-y-2 text-blue-800 text-sm">
                <CookieType 
                  title={t('legal.cookiePolicy.sessionCookies')}
                  description={t('legal.cookiePolicy.sessionCookiesText')}
                />
                <CookieType 
                  title={t('legal.cookiePolicy.persistentCookies')}
                  description={t('legal.cookiePolicy.persistentCookiesText')}
                />
                <CookieType 
                  title={t('legal.cookiePolicy.firstPartyCookies')}
                  description={t('legal.cookiePolicy.firstPartyCookiesText')}
                />
                <CookieType 
                  title={t('legal.cookiePolicy.thirdPartyCookies')}
                  description={t('legal.cookiePolicy.thirdPartyCookiesText')}
                />
              </ul>
            </div>
          </PolicySection>

          {/* How We Use Cookies */}
          <PolicySection icon={Eye} title={`2. ${t('legal.cookiePolicy.howWeUseCookies')}`}>
            <div className="space-y-6">
              <UsageCategory
                title={t('legal.cookiePolicy.essential')}
                description={t('legal.cookiePolicy.essentialText')}
                items={["Authentication and security", "Session management", "Load balancing and site performance"]}
              />
              <UsageCategory
                title={t('legal.cookiePolicy.performance')}
                description={t('legal.cookiePolicy.performanceText')}
                items={["Pages visited and time spent", "Error messages encountered", "Navigation patterns"]}
              />
              <UsageCategory
                title={t('legal.cookiePolicy.functional')}
                description={t('legal.cookiePolicy.functionalText')}
                items={["Language preferences", "Currency selection", "Search filters and preferences"]}
              />
              <UsageCategory
                title={t('legal.cookiePolicy.advertising')}
                description={t('legal.cookiePolicy.advertisingText')}
                items={["Personalized content and offers", "Retargeting campaigns", "Social media integration"]}
              />
            </div>
          </PolicySection>

          {/* Managing Cookies */}
          <PolicySection icon={Settings} title={`3. ${t('legal.cookiePolicy.managingCookies')}`}>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                {t('legal.cookiePolicy.managingCookiesText')}
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <p className="text-amber-900 font-semibold mb-2">Please Note:</p>
                <p className="text-amber-800 text-sm">
                  If you choose to disable cookies, some features may not function properly.
                </p>
              </div>
            </div>
          </PolicySection>

          {/* Third-Party Cookies */}
          <PolicySection icon={Shield} title="4. Third-Party Cookies">
            <p className="text-gray-600 text-sm mb-4">
              We use third-party services that may set their own cookies.
            </p>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#FFB400] mt-1">•</span>
                <span><strong>Analytics Services:</strong> Google Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFB400] mt-1">•</span>
                <span><strong>Payment Processors:</strong> Secure payment handling</span>
              </li>
            </ul>
          </PolicySection>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] rounded-2xl shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About Cookies?</h3>
            <p className="text-white/90 mb-6">
              If you have any questions about our Cookie Policy, please reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FFB400] text-white font-semibold hover:bg-[#e6a200] transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/legal/privacy-policy"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-[#283B73] font-semibold hover:bg-gray-100 transition-colors"
              >
                View Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}