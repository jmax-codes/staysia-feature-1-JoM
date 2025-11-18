"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/contexts/NotificationContext";

export function NotificationBanner() {
  const { notification, hideNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);

      // Auto-dismiss after duration
      if (notification.autoClose) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [notification]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      hideNotification();
    }, 300);
  };

  const getNotificationConfig = () => {
    switch (notification?.type) {
      case "warning":
        return {
          icon: AlertTriangle,
          bgColor: "bg-amber-50/95",
          borderColor: "border-amber-200",
          iconColor: "text-amber-600",
          textColor: "text-amber-900",
        };
      case "success":
        return {
          icon: CheckCircle,
          bgColor: "bg-emerald-50/95",
          borderColor: "border-emerald-200",
          iconColor: "text-emerald-600",
          textColor: "text-emerald-900",
        };
      case "info":
        return {
          icon: Info,
          bgColor: "bg-blue-50/95",
          borderColor: "border-blue-200",
          iconColor: "text-blue-600",
          textColor: "text-blue-900",
        };
      case "error":
        return {
          icon: AlertCircle,
          bgColor: "bg-red-50/95",
          borderColor: "border-red-200",
          iconColor: "text-red-600",
          textColor: "text-red-900",
        };
      default:
        return {
          icon: Info,
          bgColor: "bg-white/95",
          borderColor: "border-gray-200",
          iconColor: "text-gray-600",
          textColor: "text-gray-900",
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-[72px] lg:top-[88px] right-4 sm:right-6 lg:right-12 z-50"
          style={{ maxWidth: '380px' }}
        >
          <div
            className={`${config.bgColor} ${config.borderColor} border rounded-xl shadow-lg backdrop-blur-sm p-3`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${config.textColor} leading-snug`}>
                  {notification.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-0.5 hover:bg-black/5 rounded transition-colors"
                aria-label="Close"
              >
                <X className={`w-4 h-4 ${config.iconColor}`} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}