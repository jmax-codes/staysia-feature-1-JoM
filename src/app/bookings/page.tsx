"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";

export default function BookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth?redirect=" + encodeURIComponent("/bookings"));
    }
  }, [session, isPending, router]);

  if (isPending || !isReady) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#283B73] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('bookings.loading')}</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#283B73] mb-2">{t('bookings.title')}</h1>
            <p className="text-gray-600">
              {t('bookings.welcome', { name: session.user.name })}
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-[#E6DCCD] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-[#283B73]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('bookings.noBookings')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('bookings.startBooking')}
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-[#283B73] hover:bg-[#1e2d5a] text-white px-8 py-3 rounded-full font-semibold transition-all"
              >
                {t('bookings.browseProperties')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}