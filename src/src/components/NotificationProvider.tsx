"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Notification {
  id: number;
  message: string;
  type: string;
  timeLeft: string;
  projectId: number;
  read: boolean;
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextProps | null>(
  null
);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          setUnreadCount(data.filter((n: Notification) => !n.read).length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval); // Cleanup
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
