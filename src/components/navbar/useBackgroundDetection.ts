/**
 * Background Detection Hook
 * 
 * Detects whether the background behind the navbar is light or dark
 * to automatically adjust text colors for optimal readability.
 * 
 * @module useBackgroundDetection
 * @returns {boolean} isDarkBackground - True if background is dark, false if light
 * 
 * @example
 * ```tsx
 * const isDarkBackground = useBackgroundDetection(navRef, isHomepage);
 * const textColor = isDarkBackground ? "text-white" : "text-black";
 * ```
 */

import { useState, useEffect } from "react";

interface UseBackgroundDetectionProps {
  navRef: React.RefObject<HTMLElement>;
  isHomepage: boolean;
}

export function useBackgroundDetection({ navRef, isHomepage }: UseBackgroundDetectionProps) {
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    // Don't detect on homepage - always use dark (white text)
    if (isHomepage) {
      setIsDarkBackground(true);
      return;
    }

    const detectBackgroundBrightness = () => {
      if (!navRef.current) return;

      // Get navbar position
      const navRect = navRef.current.getBoundingClientRect();
      const centerX = navRect.left + navRect.width / 2;
      const centerY = navRect.top + navRect.height / 2;

      // Get all elements at navbar center position
      const elementsAtPoint = document.elementsFromPoint(centerX, centerY);
      
      // Find the first element that's NOT the navbar or its children
      let backgroundElement: Element | null = null;
      for (const el of elementsAtPoint) {
        if (el !== navRef.current && !navRef.current?.contains(el)) {
          backgroundElement = el;
          break;
        }
      }

      if (!backgroundElement) {
        backgroundElement = document.body;
      }

      // Check this element and traverse up the DOM tree
      let currentElement: Element | null = backgroundElement;
      let foundBackground = false;

      while (currentElement && currentElement !== document.documentElement) {
        const styles = window.getComputedStyle(currentElement);
        const bgColor = styles.backgroundColor;
        const bgImage = styles.backgroundImage;

        // Check for background image - ALWAYS use white text on images
        if (bgImage && bgImage !== 'none') {
          setIsDarkBackground(true);
          return;
        }

        // Parse background color
        const rgbaMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        
        if (rgbaMatch) {
          const r = parseInt(rgbaMatch[1]);
          const g = parseInt(rgbaMatch[2]);
          const b = parseInt(rgbaMatch[3]);
          const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

          // Only process if alpha is visible
          if (a > 0.1) {
            // Check if it's blue/indigo (any shade)
            const isBlueish = b > r && b > g && (b - Math.max(r, g)) > 30;
            
            if (isBlueish) {
              setIsDarkBackground(true);
              return;
            }
            
            // Calculate luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            
            // Bright backgrounds (> 0.85 luminance) = BLACK text
            // Dark backgrounds (<= 0.85 luminance) = WHITE text
            setIsDarkBackground(luminance <= 0.85);
            foundBackground = true;
            break;
          }
        }

        currentElement = currentElement.parentElement;
      }

      // If no background found, default to bright (black text)
      if (!foundBackground) {
        setIsDarkBackground(false);
      }
    };

    // Initial detection with multiple attempts
    detectBackgroundBrightness();
    setTimeout(detectBackgroundBrightness, 50);
    setTimeout(detectBackgroundBrightness, 150);
    setTimeout(detectBackgroundBrightness, 300);

    // Listen for changes
    window.addEventListener("resize", detectBackgroundBrightness);
    window.addEventListener("popstate", detectBackgroundBrightness);
    
    const handleScroll = () => {
      detectBackgroundBrightness();
    };
    
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", detectBackgroundBrightness);
      window.removeEventListener("popstate", detectBackgroundBrightness);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navRef, isHomepage]);

  return isDarkBackground;
}
