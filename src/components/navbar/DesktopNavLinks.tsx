/**
 * Desktop Navigation Links Component
 * 
 * Renders the centered navigation links for desktop view.
 * Includes: Stays, Wishlists, Bookings, Dashboard (for tenants), Contact Us
 * 
 * @component
 * @param {string} textColor - CSS class for text color based on background
 * @param {string} textColorHover - CSS class for hover state color
 * @param {boolean} isTenant - Whether the user is a tenant
 * @param {boolean} isReady - Whether translations are loaded
 * @param {Function} t - Translation function
 * @param {Function} handleStaysClick - Handler for stays navigation
 * @param {Function} handleWishlistsClick - Handler for wishlists navigation
 * @param {Function} handleBookingsClick - Handler for bookings navigation
 */

"use client";

import Link from "next/link";

interface DesktopNavLinksProps {
  textColor: string;
  textColorHover: string;
  isTenant: boolean;
  isReady: boolean;
  t: (key: string) => string;
  handleStaysClick: (e: React.MouseEvent) => void;
  handleWishlistsClick: (e: React.MouseEvent) => void;
  handleBookingsClick: (e: React.MouseEvent) => void;
}

export function DesktopNavLinks({
  textColor,
  textColorHover,
  isTenant,
  isReady,
  t,
  handleStaysClick,
  handleWishlistsClick,
  handleBookingsClick,
}: DesktopNavLinksProps) {
  return (
    <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
      <button
        onClick={handleStaysClick}
        className={`font-medium text-lg tracking-wide transition-colors duration-300 ${textColor} ${textColorHover}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {isReady ? t('navbar.stays') : 'STAYS'}
      </button>
      <button
        onClick={handleWishlistsClick}
        className={`font-medium text-lg tracking-wide transition-colors duration-300 ${textColor} ${textColorHover}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {isReady ? t('navbar.wishlists') : 'WISHLISTS'}
      </button>
      <Link
        href="/bookings"
        onClick={handleBookingsClick}
        className={`font-medium text-lg tracking-wide transition-colors duration-300 ${textColor} ${textColorHover}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {isReady ? t('navbar.bookings') : 'BOOKINGS'}
      </Link>
      {isTenant && (
        <Link
          href="/dashboard"
          className={`font-medium text-lg tracking-wide transition-colors duration-300 ${textColor} ${textColorHover}`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {isReady ? t('navbar.dashboard').toUpperCase() : 'DASHBOARD'}
        </Link>
      )}
      <Link
        href="/contact-us"
        className={`font-medium text-lg tracking-wide transition-colors duration-300 ${textColor} ${textColorHover}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {isReady ? t('navbar.contactUs') : 'CONTACT US'}
      </Link>
    </div>
  );
}
