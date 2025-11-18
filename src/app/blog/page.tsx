/**
 * Blog Page
 * 
 * Displays blog articles about travel tips, guest guides, and host stories.
 * Features article grid, newsletter signup, and full article dialog.
 * 
 * @module app/blog
 */

"use client";

import { Navbar } from "@/components/Navbar";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { BlogArticleDialog } from "@/components/BlogArticleDialog";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { blogArticles, articleContents } from "./data/articles";

/**
 * Blog page component
 * 
 * Showcases platform content and provides newsletter subscription.
 */
export default function BlogPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [isArticleOpen, setIsArticleOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const handleReadArticle = (article: any) => {
    const ContentComponent = articleContents[article.contentKey as keyof typeof articleContents];
    setSelectedArticle({
      ...article,
      category: t(`blog.${article.categoryKey}`),
      content: <ContentComponent />,
    });
    setIsArticleOpen(true);
  };

  if (!isReady) {
    return null;
  }

  const articlesWithTranslations = blogArticles.map(article => ({
    ...article,
    category: t(`blog.${article.categoryKey}`)
  }));

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Featured Post */}
        <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d54] rounded-2xl p-8 sm:p-12 mb-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#FFB400] text-[#283B73] text-xs font-semibold rounded-full">
              {t('blog.featured')}
            </span>
            <span className="text-white/80 text-sm">{articlesWithTranslations[0].category}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{articlesWithTranslations[0].title}</h2>
          <p className="text-white/80 text-lg mb-6 leading-relaxed">{articlesWithTranslations[0].excerpt}</p>
          <div className="flex items-center gap-6 text-sm text-white/60 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{articlesWithTranslations[0].date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{articlesWithTranslations[0].readTime}</span>
            </div>
          </div>
          <button 
            onClick={() => handleReadArticle(articlesWithTranslations[0])}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFB400] text-[#283B73] font-semibold rounded-lg hover:bg-[#e6a300] transition-colors"
          >
            {t('blog.readArticle')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('blog.recentPosts')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {articlesWithTranslations.slice(1).map((post) => (
              <article 
                key={post.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="p-8">
                  <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-[#283B73]/10 mb-6 text-4xl">
                    {post.image}
                  </div>
                  
                  <span className="inline-block px-3 py-1 bg-[#FFB400]/10 text-[#283B73] text-xs font-semibold rounded-full mb-4">
                    {post.category}
                  </span>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#283B73] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleReadArticle(post)}
                      className="text-[#283B73] font-semibold hover:text-[#1e2d54] transition-colors inline-flex items-center gap-1"
                    >
                      {t('blog.read')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('blog.stayUpdated')}</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">{t('blog.newsletterDescription')}</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('blog.emailPlaceholder')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283B73] focus:border-transparent"
            />
            <button className="px-6 py-3 bg-[#283B73] text-white font-semibold rounded-lg hover:bg-[#1e2d54] transition-colors whitespace-nowrap">
              {t('blog.subscribe')}
            </button>
          </div>
        </div>
      </main>

      <BlogArticleDialog 
        open={isArticleOpen} 
        onOpenChange={setIsArticleOpen}
        article={selectedArticle}
      />
    </div>
  );
}