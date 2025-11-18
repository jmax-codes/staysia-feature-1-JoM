/**
 * Help Center FAQ Data
 * 
 * Contains FAQ categories and questions for the help center.
 * Extracted to reduce page file size.
 * 
 * @module app/help-center/data
 */

import { Users, CreditCard, Home, Shield, type LucideIcon } from "lucide-react";

/**
 * FAQ category structure
 */
export interface FAQCategory {
  categoryKey: string;
  icon: LucideIcon;
  questions: Array<{
    qKey: string;
    aKey: string;
  }>;
}

/**
 * FAQ categories with translation keys
 */
export const faqCategories: FAQCategory[] = [
  {
    categoryKey: "accountBooking",
    icon: Users,
    questions: [
      { qKey: "createAccountQ", aKey: "createAccountA" },
      { qKey: "bookPropertyQ", aKey: "bookPropertyA" },
      { qKey: "cancelModifyQ", aKey: "cancelModifyA" },
      { qKey: "verifyEmailQ", aKey: "verifyEmailA" }
    ]
  },
  {
    categoryKey: "paymentsPricing",
    icon: CreditCard,
    questions: [
      { qKey: "paymentMethodsQ", aKey: "paymentMethodsA" },
      { qKey: "whenChargedQ", aKey: "whenChargedA" },
      { qKey: "hiddenFeesQ", aKey: "hiddenFeesA" }
    ]
  },
  {
    categoryKey: "propertyOwners",
    icon: Home,
    questions: [
      { qKey: "listPropertyQ", aKey: "listPropertyA" },
      { qKey: "hostingFeesQ", aKey: "hostingFeesA" },
      { qKey: "receivePaymentsQ", aKey: "receivePaymentsA" }
    ]
  },
  {
    categoryKey: "safetySecurity",
    icon: Shield,
    questions: [
      { qKey: "personalInfoQ", aKey: "personalInfoA" },
      { qKey: "propertiesVerifiedQ", aKey: "propertiesVerifiedA" },
      { qKey: "issueBookingQ", aKey: "issueBookingA" }
    ]
  }
];
