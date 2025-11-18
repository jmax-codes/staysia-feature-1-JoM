/**
 * Mobile Menu Dropdown Component
 * 
 * Mobile/tablet navigation menu with all navigation links and user actions.
 * Includes: Profile, Settings, Navigation Links, Become Host, Help Center, Logout
 * 
 * @component
 * @param {object} session - User session object from auth
 * @param {boolean} isPending - Whether session is loading
 * @param {boolean} isTenant - Whether user is a tenant
 * @param {boolean} isReady - Whether translations are loaded
 * @param {Function} t - Translation function
 * @param {Function} handleStaysClick - Handler for stays navigation
 * @param {Function} handleWishlistsClick - Handler for wishlists navigation
 * @param {Function} handleBookingsClick - Handler for bookings navigation
 * @param {Function} handleBecomeHostClick - Handler for become host action
 * @param {Function} handleSignOut - Handler for sign out action
 * @param {Function} router - Next.js router instance
 */

"use client";

import Link from "next/link";
import { Menu, User, LogOut, UserCircle, Settings, Home, HelpCircle, LayoutDashboard, Plus, Heart, Calendar, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileMenuDropdownProps {
  session: any;
  isPending: boolean;
  isTenant: boolean;
  isReady: boolean;
  t: (key: string) => string;
  handleStaysClick: (e: React.MouseEvent) => void;
  handleWishlistsClick: (e: React.MouseEvent) => void;
  handleBookingsClick: (e: React.MouseEvent) => void;
  handleBecomeHostClick: () => void;
  handleSignOut: () => void;
  router: any;
}

export function MobileMenuDropdown({
  session,
  isPending,
  isTenant,
  isReady,
  t,
  handleStaysClick,
  handleWishlistsClick,
  handleBookingsClick,
  handleBecomeHostClick,
  handleSignOut,
  router,
}: MobileMenuDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-full transition-all shadow-sm border border-gray-200">
          <Menu className="w-5 h-5" />
          <div className="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {!isPending && session?.user ? (
          <>
            <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
              {session.user.name}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile" className="flex items-center">
                <UserCircle className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.profile') : 'Profile'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account-settings" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.accountSettings') : 'Account Settings'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleStaysClick}
              className="cursor-pointer font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              {isReady ? t('navbar.stays') : 'STAYS'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleWishlistsClick}
              className="cursor-pointer font-medium"
            >
              <Heart className="w-4 h-4 mr-2" />
              {isReady ? t('navbar.wishlists') : 'WISHLISTS'}
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer font-medium">
              <Link href="/bookings" onClick={handleBookingsClick} className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.bookings') : 'BOOKINGS'}
              </Link>
            </DropdownMenuItem>
            {isTenant && (
              <DropdownMenuItem asChild className="cursor-pointer font-medium">
                <Link href="/dashboard" className="flex items-center">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {isReady ? t('navbar.dashboard').toUpperCase() : 'DASHBOARD'}
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild className="cursor-pointer font-medium">
              <Link href="/contact-us" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.contactUs') : 'CONTACT US'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!isTenant && (
              <DropdownMenuItem
                onClick={handleBecomeHostClick}
                className="cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.becomeHost') : 'Become a host'}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/help-center" className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.helpCenter') : 'Help Center'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isReady ? t('navbar.logout') : 'Log out'}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => router.push("/auth/login/user")}
              className="cursor-pointer font-semibold"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              {isReady ? t('navbar.loginSignup') : 'Log in or Sign up'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleStaysClick}
              className="cursor-pointer font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              {isReady ? t('navbar.stays') : 'STAYS'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleWishlistsClick}
              className="cursor-pointer font-medium"
            >
              <Heart className="w-4 h-4 mr-2" />
              {isReady ? t('navbar.wishlists') : 'WISHLISTS'}
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer font-medium">
              <Link href="/bookings" onClick={handleBookingsClick} className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.bookings') : 'BOOKINGS'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer font-medium">
              <Link href="/contact-us" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.contactUs') : 'CONTACT US'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleBecomeHostClick}
              className="cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isReady ? t('navbar.becomeHost') : 'Become a host'}
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/help-center" className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.helpCenter') : 'Help Center'}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
