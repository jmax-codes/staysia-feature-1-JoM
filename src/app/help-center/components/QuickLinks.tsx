/**
 * Help Center Quick Links
 * 
 * Displays quick access cards for common help topics.
 * 
 * @module app/help-center/components
 */

import { Book, MessageCircle, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Quick links section with action cards
 */
export const QuickLinks = () => {
  const { t } = useTranslation();

  const links = [
    {
      icon: Book,
      titleKey: "gettingStarted",
      descKey: "gettingStartedDesc"
    },
    {
      icon: MessageCircle,
      titleKey: "contactSupport",
      descKey: "contactSupportDesc"
    },
    {
      icon: Shield,
      titleKey: "safetyResources",
      descKey: "safetyResourcesDesc"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 -mt-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
          >
            <link.icon className="w-8 h-8 text-[#283B73] mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t(`helpCenter.${link.titleKey}`)}
            </h3>
            <p className="text-sm text-gray-600">
              {t(`helpCenter.${link.descKey}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
