import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

const socket = io("http://localhost:5000");

export default function MainLayout({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔹 LOAD EXISTING NOTIFICATIONS FROM DB
  useEffect(() => {
    API.get("/notifications")
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔹 SOCKET REAL-TIME
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const user = jwtDecode(token);

    socket.emit("join", user.id);

    socket.on("new_notification", (data) => {
      console.log("New Notification:", data);

      // Add real-time notification
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  // 🔹 MARK AS READ
  const handleRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">

        {/* 🔝 Topbar */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">ERP Dashboard</h1>

          <div className="flex items-center gap-4">

            {/* 🔔 Notification */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-xl"
              >
                🔔
              </button>

              {/* Badge (only unread count) */}
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full text-white">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded p-3 z-50 max-h-80 overflow-y-auto">
                  <h4 className="font-semibold mb-2">Notifications</h4>

                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id || Math.random()}
                        onClick={() => handleRead(n._id)}
                        className={`text-sm border-b py-2 cursor-pointer hover:bg-gray-100 px-2 rounded ${
                          !n.isRead ? "font-semibold bg-gray-50" : ""
                        }`}
                      >
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            >
              Logout
            </button>

          </div>
        </div>

        {/* 📦 Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}