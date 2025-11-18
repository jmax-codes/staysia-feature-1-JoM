/**
 * Navbar Utilities
 * 
 * Helper functions for determining navbar text colors based on
 * scroll state, background brightness, and page context.
 * 
 * @module navbarUtils
 */

/**
 * Pages that should always display white navigation text regardless of background
 */
export const FORCE_WHITE_TEXT_PAGES = [
  "/contact-us",
  "/hosting/host-resources",
  "/hosting/community-forum",
  "/hosting/responsible-hosting",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy"
];

/**
 * Get text color class based on current navbar state
 * 
 * @param {boolean} isScrolled - Whether the page is scrolled
 * @param {boolean} isHomepage - Whether on homepage
 * @param {boolean} isDarkBackground - Whether background is dark
 * @param {string} pathname - Current page pathname
 * @returns {string} Tailwind CSS class for text color
 */
export function getTextColor(
  isScrolled: boolean,
  isHomepage: boolean,
  isDarkBackground: boolean,
  pathname: string
): string {
  if (isScrolled) return "text-[#000000]";
  if (FORCE_WHITE_TEXT_PAGES.includes(pathname)) return "text-[#FFFFFF]";
  if (isHomepage) return "text-[#FFFFFF]";
  return isDarkBackground ? "text-[#FFFFFF]" : "text-[#000000]";
}

/**
 * Get text hover color class based on current navbar state
 * 
 * @param {boolean} isScrolled - Whether the page is scrolled
 * @param {boolean} isHomepage - Whether on homepage
 * @param {boolean} isDarkBackground - Whether background is dark
 * @param {string} pathname - Current page pathname
 * @returns {string} Tailwind CSS class for hover text color
 */
export function getTextColorHover(
  isScrolled: boolean,
  isHomepage: boolean,
  isDarkBackground: boolean,
  pathname: string
): string {
  if (isScrolled) return "hover:text-[#283B73]";
  if (FORCE_WHITE_TEXT_PAGES.includes(pathname)) return "hover:text-[#FFFFFF]/90";
  if (isHomepage) return "hover:text-[#FFFFFF]/90";
  return isDarkBackground ? "hover:text-[#FFFFFF]/90" : "hover:text-[#283B73]";
}

/**
 * Get globe icon color class based on current navbar state
 * 
 * @param {boolean} isScrolled - Whether the page is scrolled
 * @param {boolean} isHomepage - Whether on homepage
 * @param {boolean} isDarkBackground - Whether background is dark
 * @param {string} pathname - Current page pathname
 * @returns {string} Tailwind CSS class for globe icon color
 */
export function getGlobeIconColor(
  isScrolled: boolean,
  isHomepage: boolean,
  isDarkBackground: boolean,
  pathname: string
): string {
  if (isScrolled) return "text-[#000000]";
  if (FORCE_WHITE_TEXT_PAGES.includes(pathname)) return "text-[#FFFFFF]";
  if (isHomepage) return "text-[#FFFFFF]";
  return isDarkBackground ? "text-[#FFFFFF]" : "text-[#000000]";
}
