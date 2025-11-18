/**
 * Help Center FAQ Section
 * 
 * Displays categorized FAQs with expandable answers.
 * 
 * @module app/help-center/components
 */

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import type { FAQCategory } from "../data/faqs";

interface FAQSectionProps {
  categories: FAQCategory[];
  onClearSearch: () => void;
}

/**
 * FAQ section with collapsible categories
 */
export const FAQSection = ({ categories, onClearSearch }: FAQSectionProps) => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">{t('helpCenter.noFaqsMatch')}</p>
        <Button
          onClick={onClearSearch}
          variant="outline"
          className="border-[#283B73] text-[#283B73] hover:bg-[#283B73] hover:text-white"
        >
          {t('helpCenter.clearSearch')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.map((category, catIndex) => (
        <div key={catIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <category.icon className="w-6 h-6 text-[#283B73]" />
              <h3 className="text-xl font-bold text-gray-900">
                {t(`helpCenter.${category.categoryKey}`)}
              </h3>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {category.questions.map((faq, faqIndex) => {
              const faqId = `${catIndex}-${faqIndex}`;
              const isOpen = openFaq === faqId;

              return (
                <div key={faqIndex}>
                  <button
                    onClick={() => toggleFaq(faqId)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-medium text-gray-900 pr-4">
                      {t(`helpCenter.${faq.qKey}`)}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {t(`helpCenter.${faq.aKey}`)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
