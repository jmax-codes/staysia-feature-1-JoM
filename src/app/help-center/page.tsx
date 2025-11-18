/**
 * Help Center Page
 * 
 * Comprehensive help center with searchable FAQs and support options.
 * Features categorized questions and live support access.
 * 
 * @module app/help-center
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { faqCategories } from "./data/faqs";
import { HeroSection } from "./components/HeroSection";
import { QuickLinks } from "./components/QuickLinks";
import { FAQSection } from "./components/FAQSection";
import { ContactSection } from "./components/ContactSection";

/**
 * Help center page component
 * 
 * Provides searchable FAQ database and contact support options.
 */
export default function HelpCenterPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter FAQs based on debounced query
  const filteredFaqs = useCallback(() => {
    if (!debouncedQuery.trim() || !isReady) {
      return faqCategories;
    }

    const query = debouncedQuery.toLowerCase();
    return faqCategories
      .map(category => ({
        ...category,
        questions: category.questions.filter(faq => {
          const q = t(`helpCenter.${faq.qKey}`).toLowerCase();
          const a = t(`helpCenter.${faq.aKey}`).toLowerCase();
          return q.includes(query) || a.includes(query);
        })
      }))
      .filter(category => category.questions.length > 0);
  }, [debouncedQuery, isReady, t]);

  const displayFaqs = filteredFaqs();
  const resultsCount = displayFaqs.reduce((acc, cat) => acc + cat.questions.length, 0);

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <HeroSection 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        debouncedQuery={debouncedQuery}
        resultsCount={resultsCount}
      />

      <QuickLinks />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t('helpCenter.faqTitle')}
        </h2>

        <FAQSection 
          categories={displayFaqs}
          onClearSearch={() => setSearchQuery("")}
        />
      </div>

      <ContactSection />

      <div className="text-center py-8">
        <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
          {t('helpCenter.backToHome')}
        </Link>
      </div>
    </div>
  );
}