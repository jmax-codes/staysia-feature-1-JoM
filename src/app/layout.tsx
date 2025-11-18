"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NotificationBanner } from "@/components/NotificationBanner";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { useNotification } from "@/contexts/NotificationContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      <Navbar />
      <NotificationBanner />
      {children}
      {!isAuthPage && <Footer />}
      <Toaster />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Staysia-Logo-1763063444145.png?width=8000&height=8000&resize=contain" type="image/png" />
        <link rel="shortcut icon" href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Staysia-Logo-1763063444145.png?width=8000&height=8000&resize=contain" type="image/png" />
        <link rel="apple-touch-icon" href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Staysia-Logo-1763063444145.png?width=8000&height=8000&resize=contain" />
        <meta name="theme-color" content="#283B73" />
      </head>
      <body className="antialiased">
        <TranslationProvider>
          <CurrencyProvider>
            <SearchProvider>
              <NotificationProvider>
                <LayoutContent>{children}</LayoutContent>
              </NotificationProvider>
            </SearchProvider>
          </CurrencyProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}