/**
 * Navbar Component
 * 
 * Main navigation bar component that adapts to scroll state and background.
 * Includes authentication, tenant features, and responsive mobile/desktop views.
 * 
 * @component
 * 
 * Features:
 * - Responsive design (desktop/tablet/mobile)
 * - Dynamic text color based on background brightness
 * - Authentication integration with role-based features
 * - Smooth scroll animations with GSAP
 * - Internationalization support
 * - Global settings modal for language/currency
 * 
 * @example
 * ```tsx
 * import { Navbar } from '@/components/navbar';
 * 
 * <Navbar />
 * ```
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { GlobalSettingsModal } from "../GlobalSettingsModal";
import { gsap } from "gsap";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { useBackgroundDetection } from "./useBackgroundDetection";
import { DesktopNavLinks } from "./DesktopNavLinks";
import { UserMenuDropdown } from "./UserMenuDropdown";
import { MobileMenuDropdown } from "./MobileMenuDropdown";
import { getTextColor, getTextColorHover, getGlobeIconColor } from "./navbarUtils";

export function Navbar() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isTenant = session?.user?.role === "tenant";
  const isHomepage = pathname === "/";

  // Use background detection hook
  const isDarkBackground = useBackgroundDetection({ navRef, isHomepage });

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;

      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);

        if (navRef.current) {
          if (scrolled) {
            gsap.to(navRef.current, {
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              duration: 0.3,
              ease: "power2.out"
            });
          } else {
            gsap.to(navRef.current, {
              backgroundColor: "rgba(255, 255, 255, 0)",
              boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Navigation handlers
  const handleStaysClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (window.location.pathname === "/") {
      const headerElement = document.querySelector("header");
      if (headerElement) {
        const headerHeight = headerElement.offsetHeight;
        const navbarHeight = navRef.current?.offsetHeight || 80;
        const scrollPosition = headerHeight - navbarHeight;
        
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth"
        });
      }
    } else {
      router.push("/#stays");
    }
  };

  const handleWishlistsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/wishlists");
  };

  const handleBookingsClick = (e: React.MouseEvent) => {
    if (!session?.user) {
      e.preventDefault();
      router.push("/auth/login/user?redirect=" + encodeURIComponent("/bookings"));
    }
  };

  const handleBecomeHostClick = async () => {
    if (!session?.user) {
      router.push("/auth/login/user?redirect=" + encodeURIComponent("/auth/register/tenant"));
      return;
    }

    if (isTenant) {
      router.push("/create-listing");
      return;
    }

    // Redirect registered users to tenant registration page for upgrade flow
    router.push("/auth/register/tenant");
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    if (error?.code) {
      toast.error(t('navbar.logout') + " failed. Please try again.");
    } else {
      localStorage.removeItem("bearer_token");
      toast.success(t('navbar.logout') + " successful");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  // Get dynamic colors
  const textColor = getTextColor(isScrolled, isHomepage, isDarkBackground, pathname);
  const textColorHover = getTextColorHover(isScrolled, isHomepage, isDarkBackground, pathname);
  const globeIconColor = getGlobeIconColor(isScrolled, isHomepage, isDarkBackground, pathname);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-300"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 ml-4 lg:ml-8">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Staysia-Logo-1763063444145.png?width=8000&height=8000&resize=contain"
              alt="Staysia"
              width={160}
              height={64}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavLinks
            textColor={textColor}
            textColorHover={textColorHover}
            isTenant={isTenant}
            isReady={isReady}
            t={t}
            handleStaysClick={handleStaysClick}
            handleWishlistsClick={handleWishlistsClick}
            handleBookingsClick={handleBookingsClick}
          />

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {isTenant ? (
              <Button
                onClick={() => router.push("/create-listing")}
                className={`font-semibold px-6 py-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-[#FFB400] text-white hover:bg-[#e6a200]"
                    : "bg-[#FFB400] text-white hover:bg-[#e6a200]"
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.createListing') : 'Create Listing'}
              </Button>
            ) : (
              <Button
                onClick={handleBecomeHostClick}
                className={`font-semibold px-6 py-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-[#283B73] text-white hover:bg-[#1e2d5a]"
                    : "bg-white text-[#283B73] hover:bg-white/90"
                }`}
              >
                {isReady ? t('navbar.becomeHost') : 'Become a host'}
              </Button>
            )}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`transition-colors duration-300 p-2 rounded-full ${
                isScrolled
                  ? "hover:bg-gray-100"
                  : isDarkBackground
                  ? "hover:bg-white/10"
                  : "hover:bg-gray-100"
              }`}
              aria-label="Language and currency settings"
            >
              <Globe className={`w-6 h-6 ${globeIconColor}`} />
            </button>
            <UserMenuDropdown
              session={session}
              isPending={isPending}
              isTenant={isTenant}
              isReady={isReady}
              isScrolled={isScrolled}
              t={t}
              handleBecomeHostClick={handleBecomeHostClick}
              handleSignOut={handleSignOut}
              router={router}
            />
          </div>

          {/* Mobile/Tablet Right Section */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`transition-colors duration-300 p-2 rounded-full ${
                isScrolled
                  ? "hover:bg-gray-100"
                  : isDarkBackground
                  ? "hover:bg-white/10"
                  : "hover:bg-gray-100"
              }`}
              aria-label="Language and currency settings"
            >
              <Globe className={`w-5 h-5 sm:w-6 sm:h-6 ${globeIconColor}`} />
            </button>
            
            <MobileMenuDropdown
              session={session}
              isPending={isPending}
              isTenant={isTenant}
              isReady={isReady}
              t={t}
              handleStaysClick={handleStaysClick}
              handleWishlistsClick={handleWishlistsClick}
              handleBookingsClick={handleBookingsClick}
              handleBecomeHostClick={handleBecomeHostClick}
              handleSignOut={handleSignOut}
              router={router}
            />
          </div>
        </div>
      </nav>

      <GlobalSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
