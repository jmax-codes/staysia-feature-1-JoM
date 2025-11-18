/**
 * Property Detail Utilities
 * 
 * Utility functions for property detail components including
 * image validation, URL checking, and formatting helpers.
 * 
 * @module PropertyDetailUtils
 */

/**
 * Validates if a string is a valid image URL
 * 
 * @param url - The URL string to validate
 * @returns True if the URL is valid, false otherwise
 * 
 * @example
 * ```ts
 * isValidImageUrl('https://example.com/image.jpg') // true
 * isValidImageUrl('/local/image.png') // true
 * isValidImageUrl('') // false
 * ```
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string' || url.trim() === '') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    // Check if it's a relative path
    return url.startsWith('/') || url.startsWith('http');
  }
}

/**
 * Formats bed configuration into readable string
 * 
 * @param beds - Object mapping bed types to counts
 * @returns Formatted string like "2 King, 1 Single"
 * 
 * @example
 * ```ts
 * formatBeds({ King: 2, Single: 1 }) // "2 King, 1 Single"
 * ```
 */
export function formatBeds(beds: Record<string, number>): string {
  const bedTypes = Object.entries(beds)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => `${count} ${type}`);
  return bedTypes.join(", ");
}

/**
 * Gets valid images with fallback handling
 * 
 * @param property - Property object containing image data
 * @param failedUrls - Set of URLs that have failed to load
 * @returns Array of valid image URLs
 */
export function getValidImages(
  property: { images: string[] | null; imageUrl: string },
  failedUrls: Set<string>
): string[] {
  const fallbackImage = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop';
  
  // Get raw images
  const rawImages = property.images && Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : [property.imageUrl];
  
  // Filter out invalid and failed images
  const validImages = rawImages.filter((img) => {
    return isValidImageUrl(img) && !failedUrls.has(img);
  });
  
  // Use fallback if no valid images
  return validImages.length > 0 ? validImages : [fallbackImage];
}
