"use client";

import { useState, useEffect } from "react";

export default function NotificationNavbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 5 seconds to check for new notifications
    const interval = setInterval(fetchNotifications, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      const notificationIds = notifications.map((n) => n.id);
      await fetch("/api/notifications/mark-read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
          markAllAsRead();
        }}
        className={`relative p-2 ${
          unreadCount > 0 ? "text-red-500" : "text-gray-500"
        }`}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-80 max-h-64 overflow-y-auto z-50">
          <div className="p-4">
            <h2 className="font-semibold text-gray-700">Notifications</h2>
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 cursor-pointer ${
                  !notification.read ? "font-bold" : "font-normal"
                } hover:bg-gray-100`}
                onClick={() =>
                  window.location.assign(`/projects/${notification.projectId}`)
                }
              >
                {notification.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
