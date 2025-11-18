"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function ContactUsPage() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success(t('contactUs.successMessage'));
      setFormData({ fullName: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : t('contactUs.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('contactUs.title')}
          </h1>
          <p className="text-white/80 text-lg">
            {t('contactUs.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            {/* Let's Connect */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#283B73] flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('contactUs.letsConnect')}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('contactUs.description')}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#283B73] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('contactUs.visitUs')}</p>
                    <p className="text-gray-600 text-sm">Jakarta, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#283B73] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('contactUs.callUs')}</p>
                    <p className="text-gray-600 text-sm">+62 87868898855</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Us */}
            <div className="bg-gradient-to-br from-[#283B73] to-[#1e2d5a] rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{t('contactUs.emailUs')}</h2>
              </div>
              <p className="text-white/90 mb-4 font-medium">
                {t('contactUs.quickResponse')}
              </p>
              <a 
                href="mailto:founders.staysia@gmail.com"
                className="inline-flex items-center gap-2 text-[#FFB400] hover:text-[#e6a200] transition-colors text-lg font-semibold"
              >
                <Mail className="w-5 h-5" />
                founders.staysia@gmail.com
              </a>
              <p className="text-white/70 text-sm mt-4">
                {t('contactUs.responseTime')}
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('contactUs.sendMessage')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('contactUs.fullName')}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('contactUs.fullNamePlaceholder')}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#283B73] outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('contactUs.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contactUs.emailPlaceholder')}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#283B73] outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('contactUs.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('contactUs.subjectPlaceholder')}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#283B73] outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('contactUs.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contactUs.messagePlaceholder')}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#283B73] outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#4361A8] to-[#5B7FD8] hover:from-[#283B73] hover:to-[#4361A8] text-white py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? (
                  t('contactUs.sending')
                ) : (
                  <>
                    {t('contactUs.send')}
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}