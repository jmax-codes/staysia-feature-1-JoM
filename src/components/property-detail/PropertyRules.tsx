/**
 * Property Rules Component
 * 
 * Displays a list of property rules (e.g., Check-in time, No smoking).
 * 
 * @component
 */

"use client";

import { useTranslation } from "react-i18next";
import { Clock, AlertCircle } from "lucide-react";

interface PropertyRulesProps {
  rules: string[];
}

export function PropertyRules({ rules }: PropertyRulesProps) {
  const { t } = useTranslation();

  if (!rules || rules.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Property Rules
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {rule.toLowerCase().includes("check") ? (
              <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5" />
            )}
            <span className="text-gray-700">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
