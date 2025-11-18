/**
 * Help Center Contact Section
 * 
 * Displays contact options for additional support.
 * 
 * @module app/help-center/components
 */

import { MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";

/**
 * Contact section with support options
 */
export const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('helpCenter.stillNeedHelp')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('helpCenter.supportAvailable')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-[#283B73] hover:bg-[#1e2d5a] text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            {t('helpCenter.startLiveChat')}
          </Button>
          <Button 
            variant="outline" 
            className="border-[#283B73] text-[#283B73] hover:bg-[#283B73] hover:text-white"
            asChild
          >
            <Link href="/contact-us">
              <Mail className="w-4 h-4 mr-2" />
              {t('helpCenter.emailSupport')}
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{t('helpCenter.support247')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
