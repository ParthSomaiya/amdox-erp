import { useEffect, useState, useRef } from "react";
import { Bell, Search, Sparkles, LogOut, LogIn, UserPlus, MailOpen, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAuthenticated = !!token && !!user;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications if logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        h-20
        px-8
        flex
        items-center
        justify-between
        border-b
        border-slate-200/80
        bg-white/80
        backdrop-blur-md
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">
            A
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">AMDOX</span>
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {/* AI Assistant */}
            <button
              onClick={() => navigate("/ai")}
              className="
                hidden
                md:flex
                h-11
                px-5
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                font-semibold
                items-center
                gap-2
                shadow-sm
                transition-all
                duration-300
              "
            >
              <Sparkles size={16} />
              AI Assistant
            </button>

            {/* Notification Bell Dropdown Wrapper */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="
                  relative
                  h-11
                  w-11
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-100
                  text-slate-600
                  transition-all
                "
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Popup Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 overflow-hidden animate-fade-in">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-medium">
                        No notifications found
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((item) => (
                        <div
                          key={item._id}
                          className={`p-4 text-left transition ${
                            !item.isRead ? "bg-indigo-50/20" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold text-slate-800 text-xs leading-normal">{item.title}</p>
                            {!item.isRead && (
                              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-slate-500 text-xs mt-1 leading-normal">{item.message}</p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-2.5 font-medium">
                            <Clock size={10} />
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/notifications");
                    }}
                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-center text-xs font-bold text-slate-600 border-t border-slate-100 transition"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Profile Block */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <h4 className="text-slate-800 font-semibold text-sm leading-none">{user?.name || "Admin"}</h4>
                <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-wider">{user?.role || "ADMIN"}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="
                h-11
                w-11
                rounded-xl
                border
                border-rose-200
                bg-rose-50/50
                flex
                items-center
                justify-center
                hover:bg-rose-500
                text-rose-500
                hover:text-white
                transition-all
                duration-200
              "
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="h-11 px-5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 transition-all">
              <LogIn size={16} />
              Sign In
            </Link>
            <Link to="/register" className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm transition-all">
              <UserPlus size={16} />
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}