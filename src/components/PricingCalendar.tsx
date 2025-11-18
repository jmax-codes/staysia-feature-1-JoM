/**
 * Pricing Calendar - Backward Compatibility Layer
 * 
 * This file re-exports components from the pricing-calendar/ directory.
 * Maintained for backward compatibility with existing imports.
 * 
 * @deprecated Import directly from '@/components/pricing-calendar' instead
 */

export { PricingCalendar } from "./pricing-calendar";
export type { 
  PricingCalendarProps, 
  PricingData, 
  Room, 
  PricingCalculationResult 
} from "./pricing-calendar";