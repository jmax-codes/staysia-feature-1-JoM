/**
 * User Menu Dropdown Component
 * 
 * Desktop user menu with profile, settings, dashboard, and logout options.
 * Shows different menu items based on authentication and tenant status.
 * 
 * @component
 * @param {object} session - User session object from auth
 * @param {boolean} isPending - Whether session is loading
 * @param {boolean} isTenant - Whether user is a tenant
 * @param {boolean} isReady - Whether translations are loaded
 * @param {Function} t - Translation function
 * @param {Function} handleBecomeHostClick - Handler for become host action
 * @param {Function} handleSignOut - Handler for sign out action
 * @param {Function} router - Next.js router instance
 */

"use client";

import Link from "next/link";
import { Menu, User, LogOut, UserCircle, Settings, Home, HelpCircle, LayoutDashboard, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuDropdownProps {
  session: any;
  isPending: boolean;
  isTenant: boolean;
  isReady: boolean;
  isScrolled: boolean;
  t: (key: string) => string;
  handleBecomeHostClick: () => void;
  handleSignOut: () => void;
  router: any;
}

export function UserMenuDropdown({
  session,
  isPending,
  isTenant,
  isReady,
  isScrolled,
  t,
  handleBecomeHostClick,
  handleSignOut,
  router,
}: UserMenuDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-300 shadow-sm ${
            isScrolled
              ? "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
              : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
          }`}
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
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
            {isTenant && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard" className="flex items-center">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {isReady ? t('navbar.dashboard') : 'Dashboard'}
                </Link>
              </DropdownMenuItem>
            )}
            {isTenant ? (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/create-listing" className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  {isReady ? t('navbar.createListing') : 'Create Listing'}
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleBecomeHostClick}
                className="cursor-pointer"
              >
                <Home className="w-4 h-4 mr-2" />
                {isReady ? t('navbar.becomeHost') : 'Become a Host'}
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
              {isReady ? t('navbar.loginSignup') : 'Log in or Sign up'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleBecomeHostClick}
              className="cursor-pointer"
            >
              <Home className="w-4 h-4 mr-2" />
              {isReady ? t('navbar.becomeHost') : 'Become a Host'}
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
