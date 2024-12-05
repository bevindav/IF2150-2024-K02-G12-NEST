"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Notification {
  id: number;
  message: string;
  projectId: number;
  type: string;
}

export default function NotificationPopup() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch the unread notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications?unread=true");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const markAllAsRead = async () => {
      try {
        // Automatically mark all unread notifications as read
        await fetch("/api/notifications", {
          method: "PATCH",
        });
        console.log("All unread notifications marked as read.");
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    };

    fetchNotifications(); // Fetch notifications
    markAllAsRead(); // Mark all as read as soon as the popup opens

    const interval = setInterval(fetchNotifications, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClose = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClick = (id: number, projectId: number) => {
    router.push(`/projects/${projectId}`);
    handleClose(id);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border shadow-lg rounded-lg p-4 flex justify-between items-center w-96"
        >
          <p
            className="text-sm cursor-pointer"
            onClick={() => handleClick(notification.id, notification.projectId)}
          >
            {notification.message}
          </p>
          <button
            onClick={() => handleClose(notification.id)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
