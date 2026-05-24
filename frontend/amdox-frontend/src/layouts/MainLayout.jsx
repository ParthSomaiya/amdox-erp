import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

import API from "../services/api";
import Sidebar from "../components/Sidebar";

const socket = io("http://localhost:5000");

export default function MainLayout() {

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  // =========================
  // LOAD THEME
  // =========================

  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "dark") {

      setDarkMode(true);

      document.documentElement.classList.add(
        "dark"
      );

    }

  }, []);


  // =========================
  // TOGGLE THEME
  // =========================

  const toggleTheme = () => {

    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {

      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  };


  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  useEffect(() => {

    API.get("/notifications")

      .then((res) => {

        setNotifications(res.data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);


  // =========================
  // SOCKET SETUP
  // =========================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) return;

    try {

      const decoded =
        jwtDecode(token);

      socket.emit(
        "join",
        decoded.id
      );

      socket.on(
        "new_notification",
        (data) => {

          setNotifications((prev) => [
            data,
            ...prev,
          ]);

        }
      );

    } catch (err) {

      console.log(err);

    }

    return () => {

      socket.off("new_notification");

    };

  }, []);


  // =========================
  // MARK READ
  // =========================

  const handleRead =
    async (id) => {

      try {

        await API.put(
          `/notifications/${id}/read`
        );

        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id
              ? {
                  ...n,
                  isRead: true,
                }
              : n
          )
        );

      } catch (err) {

        console.log(err);

      }

    };


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };


  return (

    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN AREA ================= */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ================= TOPBAR ================= */}

        <div className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center border-b">

          {/* LEFT */}

          <div>

            <h1 className="text-2xl font-bold">
              AMDOX ERP
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enterprise Resource Planning
            </p>

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-5">

            {/* THEME BUTTON */}

            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
            >

              {darkMode
                ? "☀️ Light"
                : "🌙 Dark"}

            </button>


            {/* NOTIFICATIONS */}

            <div className="relative">

              <button
                onClick={() =>
                  setShowDropdown(
                    !showDropdown
                  )
                }
                className="text-2xl relative"
              >
                🔔
              </button>

              {/* BADGE */}

              {notifications.filter(
                (n) => !n.isRead
              ).length > 0 && (

                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">

                  {
                    notifications.filter(
                      (n) => !n.isRead
                    ).length
                  }

                </span>

              )}


              {/* DROPDOWN */}

              {showDropdown && (

                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl z-50 max-h-[400px] overflow-y-auto border">

                  <div className="p-4 border-b flex justify-between items-center">

                    <h2 className="font-bold text-lg">
                      Notifications
                    </h2>

                    <button
                      className="text-sm text-blue-600"
                      onClick={async () => {

                        await API.put(
                          "/notifications/mark-all-read"
                        );

                        setNotifications((prev) =>
                          prev.map((n) => ({
                            ...n,
                            isRead: true,
                          }))
                        );

                      }}
                    >
                      Mark all read
                    </button>

                  </div>


                  {/* LIST */}

                  {notifications.length === 0 ? (

                    <div className="p-5 text-center text-gray-500">
                      No Notifications
                    </div>

                  ) : (

                    notifications.map((n) => (

                      <div
                        key={n._id}
                        onClick={() =>
                          handleRead(n._id)
                        }
                        className={`p-4 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${

                          !n.isRead
                            ? "bg-blue-50 dark:bg-gray-700"
                            : ""

                        }`}
                      >

                        <p className="font-semibold">

                          {n.title || "Notification"}

                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-300">

                          {n.message}

                        </p>

                        <p className="text-xs mt-1 text-gray-400">

                          {new Date(
                            n.createdAt
                          ).toLocaleString()}

                        </p>

                      </div>

                    ))

                  )}

                </div>

              )}

            </div>


            {/* LOGOUT */}

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>

        </div>


        {/* ================= PAGE CONTENT ================= */}

        <div className="flex-1 overflow-y-auto p-6">

          <Outlet />

        </div>

      </div>

    </div>

  );

}