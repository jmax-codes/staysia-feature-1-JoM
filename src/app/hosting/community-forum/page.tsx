"use client";

import { Navbar } from "@/components/Navbar";
import { MessageSquare, Users, TrendingUp, HelpCircle, Lightbulb, Award } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function CommunityForumPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();

  if (!isReady) {
    return null;
  }

  const forumCategories = [
    {
      icon: MessageSquare,
      title: t('communityForum.generalDiscussion'),
      description: t('communityForum.generalDiscussionDesc'),
      topics: 1247,
      posts: 8934
    },
    {
      icon: TrendingUp,
      title: t('communityForum.marketingGrowth'),
      description: t('communityForum.marketingGrowthDesc'),
      topics: 892,
      posts: 5621
    },
    {
      icon: HelpCircle,
      title: t('communityForum.qaTitle'),
      description: t('communityForum.qaDesc'),
      topics: 2156,
      posts: 12438
    },
    {
      icon: Lightbulb,
      title: t('communityForum.tipsTricks'),
      description: t('communityForum.tipsTricksDesc'),
      topics: 634,
      posts: 4287
    },
    {
      icon: Award,
      title: t('communityForum.successStories'),
      description: t('communityForum.successStoriesDesc'),
      topics: 412,
      posts: 2893
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
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('communityForum.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            {t('communityForum.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Coming Soon Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB400] to-[#FFA500] text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            <MessageSquare className="w-5 h-5" />
            <span>{t('communityForum.comingSoon')}</span>
          </div>
        </div>

        {/* Forum Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            {t('communityForum.joinCommunity')}
          </h2>
          <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            {t('communityForum.forumDesc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-[#FAFAFA] rounded-xl">
              <div className="text-4xl font-bold text-[#283B73] mb-2">5,000+</div>
              <div className="text-gray-600">{t('communityForum.activeHosts')}</div>
            </div>
            <div className="p-6 bg-[#FAFAFA] rounded-xl">
              <div className="text-4xl font-bold text-[#283B73] mb-2">15,000+</div>
              <div className="text-gray-600">{t('communityForum.forumPosts')}</div>
            </div>
            <div className="p-6 bg-[#FAFAFA] rounded-xl">
              <div className="text-4xl font-bold text-[#283B73] mb-2">24/7</div>
              <div className="text-gray-600">{t('communityForum.communitySupport')}</div>
            </div>
          </div>
        </div>

        {/* Forum Categories Preview */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {t('communityForum.whatToExpect')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forumCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#283B73]/10 flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-6 h-6 text-[#283B73]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {category.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{category.topics.toLocaleString()} {t('communityForum.topics')}</span>
                      <span>•</span>
                      <span>{category.posts.toLocaleString()} {t('communityForum.posts')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d5a] rounded-2xl shadow-lg p-8 text-white mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">
            {t('communityForum.whyJoin')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#FFB400] font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">{t('communityForum.learnFromHosts')}</h4>
                <p className="text-white/80 text-sm">
                  {t('communityForum.learnFromHostsDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#FFB400] font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">{t('communityForum.stayUpdated')}</h4>
                <p className="text-white/80 text-sm">
                  {t('communityForum.stayUpdatedDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#FFB400] font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">{t('communityForum.networkCollaborate')}</h4>
                <p className="text-white/80 text-sm">
                  {t('communityForum.networkCollaborateDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#FFB400] font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">{t('communityForum.support247')}</h4>
                <p className="text-white/80 text-sm">
                  {t('communityForum.support247Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('communityForum.getNotified')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('communityForum.getNotifiedDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#283B73] text-white font-semibold hover:bg-[#1e2d5a] transition-colors"
            >
              {t('communityForum.contactForUpdates')}
            </Link>
            <Link
              href="/help-center"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-[#283B73] text-[#283B73] font-semibold hover:bg-[#283B73] hover:text-white transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              {t('communityForum.visitHelpCenter')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}