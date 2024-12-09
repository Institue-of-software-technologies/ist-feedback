"use client";

import { Notification } from "@/types";
import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import Loading from "@/app/loading";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/components/ToastMessage";
import { useRouter } from 'next/navigation';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const { user } = useUser();
  const router = useRouter();

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notification", {
          method: "GET",
          headers: {
            "user-id": `${user?.id}`,
          },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user?.id]);

  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notification/${id}`, { status: "read" }); // Assume `status` is the field for read/unread
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, status: "read" } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Delete notification function
  const deleteNotification = async (id: number) => {
    setDeleting(id);
    try {
      await api.delete(`/notification/${id}`);
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      showToast.success("Notification Deleted successfully!");
    } catch (error) {
      console.error(error);
      showToast.error("Error deleting notification");
    } finally {
      setDeleting(null);
    }
  };

  // Handle "View Details" click
  const handleViewDetailsClick = async (id: number, link: string) => {
    await markAsRead(id); // Mark the notification as read before navigating
    router.push(link); // Redirect to the notification detail page
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="bg-white rounded-lg shadow-md p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`flex items-center justify-between p-4 hover:bg-gray-100 transition ${notification.status === "unread" ? "bg-yellow-50" : ""
                  }`} // Highlight unread notifications
              >
                <div>
                  <h5 className="text-sm font-semibold">
                    {notification.status === "unread" && (
                      <div className="mb-1">
                        <span className="font-bold text-blue-600">New</span>
                      </div>
                    )}
                    {notification.title}
                  </h5>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                  {notification.link && (
                    <Link
                      href="#"
                      onClick={() => handleViewDetailsClick(notification.id, notification.link)}
                      className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                    >
                      Resolve Notification
                    </Link>
                  )}
                </div>

                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="ml-4 flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                  disabled={deleting === notification.id}
                >
                  {deleting === notification.id ? (
                    <svg
                      className="animate-spin h-4 w-4 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Delete"
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
