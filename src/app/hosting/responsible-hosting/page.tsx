"use client";

import { Navbar } from "@/components/Navbar";
import { Shield, Heart, Leaf, Users, Home, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function ResponsibleHostingPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();

  if (!isReady) {
    return null;
  }

  const principles = [
    {
      icon: Shield,
      title: t('responsibleHosting.safetyFirst'),
      description: t('responsibleHosting.safetyFirstDesc'),
      points: [
        t('responsibleHosting.installDetectors'),
        t('responsibleHosting.emergencyInfo'),
        t('responsibleHosting.complyRegulations'),
        t('responsibleHosting.regularMaintenance')
      ]
    },
    {
      icon: Heart,
      title: t('responsibleHosting.guestWellbeing'),
      description: t('responsibleHosting.guestWellbeingDesc'),
      points: [
        t('responsibleHosting.maintainCleanliness'),
        t('responsibleHosting.accurateDescriptions'),
        t('responsibleHosting.respondPromptly'),
        t('responsibleHosting.respectPrivacy')
      ]
    },
    {
      icon: Leaf,
      title: t('responsibleHosting.envSustainability'),
      description: t('responsibleHosting.envSustainabilityDesc'),
      points: [
        t('responsibleHosting.energyEfficient'),
        t('responsibleHosting.recyclingFacilities'),
        t('responsibleHosting.reduceWater'),
        t('responsibleHosting.ecoFriendlyProducts')
      ]
    },
    {
      icon: Users,
      title: t('responsibleHosting.communityRespect'),
      description: t('responsibleHosting.communityRespectDesc'),
      points: [
        t('responsibleHosting.manageNoise'),
        t('responsibleHosting.followRegulations'),
        t('responsibleHosting.educateGuests'),
        t('responsibleHosting.supportLocal')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('responsibleHosting.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            {t('responsibleHosting.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('responsibleHosting.commitment')}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {t('responsibleHosting.commitmentDesc1')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('responsibleHosting.commitmentDesc2')}
          </p>
        </div>

        {/* Four Principles */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('responsibleHosting.fourPillars')}
          </h3>
          <div className="space-y-8">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                      <principle.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white">{principle.title}</h4>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {principle.description}
                  </p>
                  <div className="space-y-3">
                    {principle.points.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d5a] rounded-2xl shadow-lg p-8 text-white mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">
            {t('responsibleHosting.bestPractices')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-3">📝 {t('responsibleHosting.clearComm')}</h4>
              <p className="text-white/90 text-sm">
                {t('responsibleHosting.clearCommDesc')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-3">🏡 {t('responsibleHosting.propertyMaint')}</h4>
              <p className="text-white/90 text-sm">
                {t('responsibleHosting.propertyMaintDesc')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-3">⚖️ {t('responsibleHosting.legalCompliance')}</h4>
              <p className="text-white/90 text-sm">
                {t('responsibleHosting.legalComplianceDesc')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-3">🤝 {t('responsibleHosting.fairPricing')}</h4>
              <p className="text-white/90 text-sm">
                {t('responsibleHosting.fairPricingDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('responsibleHosting.resourcesTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-[#FAFAFA] rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#283B73] flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('responsibleHosting.safetyGuidelines')}</h4>
              <p className="text-gray-600 text-sm mb-4">
                {t('responsibleHosting.safetyGuidelinesDesc')}
              </p>
              <Link
                href="/help-center"
                className="text-[#283B73] font-semibold text-sm hover:underline"
              >
                {t('responsibleHosting.learnMore')}
              </Link>
            </div>
            <div className="text-center p-6 bg-[#FAFAFA] rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#283B73] flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('responsibleHosting.sustainabilityTips')}</h4>
              <p className="text-gray-600 text-sm mb-4">
                {t('responsibleHosting.sustainabilityTipsDesc')}
              </p>
              <Link
                href="/help-center"
                className="text-[#283B73] font-semibold text-sm hover:underline"
              >
                {t('responsibleHosting.learnMore')}
              </Link>
            </div>
            <div className="text-center p-6 bg-[#FAFAFA] rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#283B73] flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('responsibleHosting.communityForum')}</h4>
              <p className="text-gray-600 text-sm mb-4">
                {t('responsibleHosting.communityForumDesc')}
              </p>
              <Link
                href="/hosting/community-forum"
                className="text-[#283B73] font-semibold text-sm hover:underline"
              >
                {t('responsibleHosting.joinCommunity')}
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('responsibleHosting.commitToResponsible')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('responsibleHosting.commitDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register/tenant"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#283B73] text-white font-semibold hover:bg-[#1e2d5a] transition-colors"
            >
              {t('responsibleHosting.becomeHost')}
            </Link>
            <Link
              href="/hosting/host-resources"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-[#283B73] text-[#283B73] font-semibold hover:bg-[#283B73] hover:text-white transition-colors"
            >
              {t('responsibleHosting.hostResources')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}