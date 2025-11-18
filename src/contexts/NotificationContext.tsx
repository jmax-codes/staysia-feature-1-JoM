"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type NotificationType = "warning" | "success" | "info" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (
    type: NotificationType,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback(
    (
      type: NotificationType,
      message: string,
      options?: { autoClose?: boolean; duration?: number }
    ) => {
      const id = `notification-${Date.now()}`;
      setNotification({
        id,
        type,
        message,
        autoClose: options?.autoClose ?? true,
        duration: options?.duration ?? 5000,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
