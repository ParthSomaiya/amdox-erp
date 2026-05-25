import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

import API from "../services/api";

import Sidebar from "../components/Sidebar";

const socket = io("http://localhost:5000");

export default function MainLayout() {

  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(true);

  // =========================================
  // LOAD THEME
  // =========================================

  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme");

    if (
      savedTheme === "dark" ||
      !savedTheme
    ) {

      setDarkMode(true);

      document.documentElement.classList.add(
        "dark"
      );

    }

  }, []);

  // =========================================
  // TOGGLE THEME
  // =========================================

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

  // =========================================
  // LOAD NOTIFICATIONS
  // =========================================

  useEffect(() => {

    API.get("/notifications")

      .then((res) => {

        setNotifications(res.data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  // =========================================
  // SOCKET
  // =========================================

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

  // =========================================
  // MARK READ
  // =========================================

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

  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <div
      className="
        flex
        h-screen
        bg-[#020617]
        text-white
        overflow-hidden
      "
    >

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}

        <header
          className="
            h-24
            px-8
            flex
            items-center
            justify-between
            border-b
            border-white/5
            bg-[#020617]/80
            backdrop-blur-2xl
            sticky
            top-0
            z-40
          "
        >

          {/* LEFT */}

          <div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
              "
            >
              Enterprise Command Center
            </h1>

            <p className="text-slate-400 mt-1">
              Real-time business intelligence dashboard
            </p>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-5">

            {/* SEARCH */}

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-3
                h-12
                w-[340px]
                px-4
                rounded-2xl
                bg-[#0F172A]
                border
                border-white/5
              "
            >

              <span className="text-slate-500">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search anything..."
                className="
                  bg-transparent
                  outline-none
                  text-sm
                  w-full
                  text-white
                "
              />

            </div>

            {/* THEME */}

            <button
              onClick={toggleTheme}
              className="
                h-12
                px-5
                rounded-2xl
                bg-[#0F172A]
                border
                border-white/5
                hover:bg-[#172033]
                transition-all
              "
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
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-[#0F172A]
                  border
                  border-white/5
                  flex
                  items-center
                  justify-center
                  text-lg
                "
              >
                🔔
              </button>

              {/* BADGE */}

              {notifications.filter(
                (n) => !n.isRead
              ).length > 0 && (

                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    h-5
                    min-w-[20px]
                    px-1
                    rounded-full
                    bg-red-500
                    text-white
                    text-xs
                    flex
                    items-center
                    justify-center
                  "
                >

                  {
                    notifications.filter(
                      (n) => !n.isRead
                    ).length
                  }

                </span>

              )}

              {/* DROPDOWN */}

              {showDropdown && (

                <div
                  className="
                    absolute
                    right-0
                    mt-4
                    w-[380px]
                    rounded-3xl
                    overflow-hidden
                    bg-[#0F172A]
                    border
                    border-white/5
                    shadow-2xl
                    z-50
                  "
                >

                  {/* HEADER */}

                  <div
                    className="
                      p-5
                      border-b
                      border-white/5
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <h2 className="font-bold text-lg">
                      Notifications
                    </h2>

                    <button
                      className="
                        text-sm
                        text-blue-400
                      "
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

                  <div className="max-h-[450px] overflow-y-auto">

                    {notifications.length === 0 ? (

                      <div className="p-8 text-center text-slate-400">
                        No Notifications
                      </div>

                    ) : (

                      notifications.map((n) => (

                        <div
                          key={n._id}
                          onClick={() =>
                            handleRead(n._id)
                          }
                          className={`
                            p-5
                            border-b
                            border-white/5
                            cursor-pointer
                            transition-all
                            hover:bg-white/5
                            ${
                              !n.isRead
                                ? "bg-blue-500/5"
                                : ""
                            }
                          `}
                        >

                          <p className="font-semibold">
                            {n.title || "Notification"}
                          </p>

                          <p className="text-sm text-slate-400 mt-1">
                            {n.message}
                          </p>

                          <p className="text-xs mt-3 text-slate-500">
                            {new Date(
                              n.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>

                      ))

                    )}

                  </div>

                </div>

              )}

            </div>

            {/* USER */}

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-500
              "
            />

            {/* LOGOUT */}

            <button
              onClick={logout}
              className="
                h-12
                px-5
                rounded-2xl
                bg-red-500
                hover:bg-red-600
                transition-all
                font-medium
              "
            >
              Logout
            </button>

          </div>

        </header>

        {/* PAGE */}

        <main
          className="
            flex-1
            overflow-y-auto
            p-8
            bg-[#020617]
          "
        >

          <Outlet />

        </main>

      </div>

    </div>

  );

}