"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Language {
  id: number;
  code: string;
  name: string;
  region: string;
  isActive: boolean;
}

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isActive: boolean;
}

// Helper function to get flag emoji from language code
const getFlagEmoji = (code: string): string => {
  const flags: Record<string, string> = {
    "en-US": "🇺🇸",
    "id-ID": "🇮🇩",
    "da-DK": "🇩🇰",
    "de-DE": "🇩🇪",
    "es-ES": "🇪🇸",
    "fr-FR": "🇫🇷",
    "it-IT": "🇮🇹",
    "nl-NL": "🇳🇱",
    "no-NO": "🇳🇴",
    "pl-PL": "🇵🇱",
    "pt-BR": "🇵🇹",
    "fi-FI": "🇫🇮",
    "sv-SE": "🇸🇪",
    "tr-TR": "🇹🇷",
    "cs-CZ": "🇨🇿",
    "ru-RU": "🇷🇺",
    "ar-SA": "🇸🇦",
    "ja-JP": "🇯🇵",
    "zh-CN": "🇨🇳",
    "ko-KR": "🇰🇷"
  };
  return flags[code] || "🌐";
};

export function GlobalSettingsModal({ isOpen, onClose }: GlobalSettingsModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"language" | "region" | "currency">("language");
  const { language, region, currency, setLanguage, setRegion, setCurrency } = useGlobalStore();
  
  // Dynamic data states
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);

  const tabs = [
    { id: "language" as const, label: t('navbar.language') },
    { id: "currency" as const, label: t('navbar.currency') }
  ];

  // Fetch languages from API
  useEffect(() => {
    if (isOpen) {
      fetchLanguages();
      fetchCurrencies();
    }
  }, [isOpen]);

  const fetchLanguages = async () => {
    setIsLoadingLanguages(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/languages`);
      if (!response.ok) {
        throw new Error("Failed to fetch languages");
      }
      const data = await response.json();
      setLanguages(data);
    } catch (error) {
      console.error("Error fetching languages:", error);
      toast.error("Failed to load languages");
    } finally {
      setIsLoadingLanguages(false);
    }
  };

  const fetchCurrencies = async () => {
    setIsLoadingCurrencies(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/currencies`);
      if (!response.ok) {
        throw new Error("Failed to fetch currencies");
      }
      const data = await response.json();
      setCurrencies(data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      toast.error("Failed to load currencies");
    } finally {
      setIsLoadingCurrencies(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[85vh] z-50"
          >
            <div
              className="h-full bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 250, 0.95) 100%)"
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <div className="flex gap-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id === "language" ? "language" : "currency")}
                      className={`text-base font-medium transition-colors relative pb-2 !whitespace-pre-line ${
                        tab.id === "language" && (activeTab === "language" || activeTab === "region") ||
                        tab.id === activeTab
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                      {(tab.id === "language" && (activeTab === "language" || activeTab === "region") ||
                        tab.id === activeTab) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(85vh - 80px)" }}>
                <AnimatePresence mode="wait">
                  {(activeTab === "language" || activeTab === "region") && (
                    <motion.div
                      key="language-region"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Translation Toggle */}
                      <div className="mb-8 p-4 bg-gray-50/80 backdrop-blur-lg rounded-xl border border-gray-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              {t('navbar.translation')}
                              <span className="text-gray-600">🌐</span>
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t('navbar.translationDescription')}
                            </p>
                          </div>
                          <div className="w-14 h-8 bg-gray-900 rounded-full p-1 flex items-center justify-end">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-gray-900" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Language Selection */}
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('navbar.chooseLanguage')}</h2>
                      
                      {isLoadingLanguages ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-[#283B73]" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage({ code: lang.code, name: lang.name, region: lang.region });
                                setRegion({ code: lang.code.split('-')[1] || 'US', name: lang.region, continent: '' });
                              }}
                              className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                                language.code === lang.code
                                  ? "border-gray-900 bg-gray-50/80 backdrop-blur-lg"
                                  : "border-gray-200/50 bg-white/50 hover:bg-white/80 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getFlagEmoji(lang.code)}</span>
                                <div>
                                  <p className="font-semibold text-gray-900">{lang.name}</p>
                                  <p className="text-sm text-gray-600 mt-0.5">{lang.region}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "currency" && (
                    <motion.div
                      key="currency"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('navbar.chooseCurrency')}</h2>
                      
                      {isLoadingCurrencies ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-[#283B73]" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {currencies.map((curr) => (
                            <button
                              key={curr.code}
                              onClick={() => setCurrency({ code: curr.code, name: curr.name, symbol: curr.symbol, rate: curr.rate })}
                              className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                                currency.code === curr.code
                                  ? "border-gray-900 bg-gray-50/80 backdrop-blur-lg"
                                  : "border-gray-200/50 bg-white/50 hover:bg-white/80 hover:border-gray-300"
                              }`}
                            >
                              <p className="font-semibold text-gray-900">{curr.name}</p>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {curr.code} – {curr.symbol}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}