/**
 * Cookie Policy Section Component
 * 
 * Reusable section component for cookie policy content.
 * 
 * @module app/legal/cookie-policy/components
 */

import { type LucideIcon } from "lucide-react";

interface PolicySectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  gradient?: boolean;
}

/**
 * Policy section with icon and content
 */
export const PolicySection = ({ 
  icon: Icon, 
  title, 
  children, 
  gradient = true 
}: PolicySectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {gradient ? (
        <div className="bg-gradient-to-r from-[#283B73] to-[#4361A8] px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        </div>
      ) : null}
      <div className="p-8">{children}</div>
    </div>
  );
};

/**
 * Cookie type item component
 */
export const CookieType = ({ title, description }: { title: string; description: string }) => (
  <li className="flex items-start gap-2">
    <span className="mt-1">•</span>
    <span>
      <strong>{title}:</strong> {description}
    </span>
  </li>
);

/**
 * Cookie usage category component
 */
export const UsageCategory = ({ 
  title, 
  description, 
  items 
}: { 
  title: string; 
  description: string; 
  items: string[] 
}) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <ul className="space-y-2 text-gray-600 text-sm">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-[#FFB400] mt-1">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
