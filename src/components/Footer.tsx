"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export function Footer() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();

  // Show footer with English fallback while translations load
  return (
    <footer className="bg-[#283B73] text-white py-12 lg:py-16 mt-16">
      <div className="px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Untitled-design-2-1763062037193.png?width=8000&height=8000&resize=contain"
                alt="Staysia"
                width={160}
                height={64}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              {isReady ? t('footer.description') : 'Find your perfect stay across Indonesia. From modern apartments to luxury villas, discover exceptional accommodations for every journey.'}
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{isReady ? t('footer.company') : 'Company'}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.aboutUs') : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.careers') : 'Careers'}
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.pressMedia') : 'Press & Media'}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.blog') : 'Blog'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{isReady ? t('footer.support') : 'Support'}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help-center" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.helpCenter') : 'Help Center'}
                </Link>
              </li>
              <li>
                <Link href="/support/safety-information" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.safetyInformation') : 'Safety Information'}
                </Link>
              </li>
              <li>
                <Link href="/support/cancellation-options" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.cancellationOptions') : 'Cancellation Options'}
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.contactSupport') : 'Contact Support'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{isReady ? t('footer.hosting') : 'Hosting'}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/register/tenant" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.becomeAHost') : 'Become a Host'}
                </Link>
              </li>
              <li>
                <Link href="/hosting/host-resources" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.hostResources') : 'Host Resources'}
                </Link>
              </li>
              <li>
                <Link href="/hosting/community-forum" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.communityForum') : 'Community Forum'}
                </Link>
              </li>
              <li>
                <Link href="/hosting/responsible-hosting" className="text-white/80 hover:text-white transition-colors text-sm">
                  {isReady ? t('footer.responsibleHosting') : 'Responsible Hosting'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              {isReady ? t('footer.allRightsReserved') : '© 2025 Staysia. All rights reserved.'}
            </p>
            <div className="flex gap-6">
              <Link href="/legal/privacy-policy" className="text-white/60 hover:text-white text-sm transition-colors">
                {isReady ? t('footer.privacyPolicy') : 'Privacy Policy'}
              </Link>
              <Link href="/legal/terms-of-service" className="text-white/60 hover:text-white text-sm transition-colors">
                {isReady ? t('footer.termsOfService') : 'Terms of Service'}
              </Link>
              <Link href="/legal/cookie-policy" className="text-white/60 hover:text-white text-sm transition-colors">
                {isReady ? t('footer.cookiePolicy') : 'Cookie Policy'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}