import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Check, CheckCheck, Clock3, MailOpen, Search, Trash2, Loader2 } from "lucide-react";
import io from "socket.io-client";
import API from "../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    fetchNotifications();

    // 🚀 સોકેટ કનેક્શન અને રિયલ ટાઇમ નોટિફિકેશન સિંકિંગ
    const socket = io("http://localhost:5000");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?._id || user?.id) {
      socket.emit("join", user._id || user.id);
    }

    socket.on("notification", (newNotif) => {
      try {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      } catch (e) {}
      setNotifications((prev) => [newNotif, ...prev]);
    });

    // ક્રોસ-પેજ (Navbar) સિંક સાંભળવા માટેનો લિસનર
    const handleCrossPageSync = () => {
      fetchNotifications();
    };
    window.addEventListener("amdox_notifications_updated", handleCrossPageSync);

    return () => {
      socket.disconnect();
      window.removeEventListener("amdox_notifications_updated", handleCrossPageSync);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      
      // ક્રોસ-પેજ સિંક ટ્રિગર
      window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
    } catch (err) {
      console.log(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
      
      // ક્રોસ-પેજ સિંક ટ્રિગર
      window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
      
      // ક્રોસ-પેજ સિંક ટ્રિગર
      window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (activeFilter === "UNREAD") {
      filtered = filtered.filter((item) => !item.isRead);
    }

    if (activeFilter === "READ") {
      filtered = filtered.filter((item) => item.isRead);
    }

    filtered = filtered.filter((item) => {
      const text = `
        ${item.title || ""}
        ${item.message || ""}
        ${item.type || ""}
      `.toLowerCase();
      return text.includes(search.toLowerCase());
    });

    return filtered;
  }, [notifications, search, activeFilter]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const readCount = notifications.filter((item) => item.isRead).length;

  const typeStyle = (type) => {
    switch (type?.toUpperCase()) {
      case "PAYROLL": return "bg-emerald-100 text-emerald-700";
      case "LEAVE": return "bg-yellow-100 text-yellow-700";
      case "PROJECT": return "bg-blue-100 text-blue-700";
      case "TASK": return "bg-violet-100 text-violet-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-[32px] p-10 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center">
                <Bell size={38} />
              </div>
              <div>
                <h1 className="text-5xl font-black">Notifications</h1>
                <p className="mt-3 text-cyan-100 text-lg">Stay updated with real-time alerts and enterprise activities</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 min-w-[150px]">
              <p className="text-cyan-100">Unread</p>
              <h2 className="text-4xl font-black mt-2">{unreadCount}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 min-w-[150px]">
              <p className="text-cyan-100">Read</p>
              <h2 className="text-4xl font-black mt-2">{readCount}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white rounded-[32px] shadow-lg p-6 flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">
        <div className="relative w-full xl:w-[380px]">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 rounded-2xl border border-gray-300 pl-14 pr-5 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {["ALL", "UNREAD", "READ"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`h-12 px-6 rounded-2xl font-semibold transition-all ${
                activeFilter === item ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white" : "bg-slate-100 text-gray-700 hover:bg-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={markAllAsRead}
          className="h-14 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
        >
          <CheckCheck size={20} />
          Mark All Read
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-5">
        {loading ? (
          <div className="bg-white rounded-[32px] shadow-lg p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <h2 className="text-3xl font-black mt-4">Loading Notifications...</h2>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-[32px] shadow-lg p-20 text-center">
            <Bell size={80} className="mx-auto text-slate-300" />
            <h2 className="text-4xl font-black mt-8">No Notifications Found</h2>
            <p className="text-gray-500 mt-4 text-lg">You're all caught up</p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-[32px] shadow-lg p-7 transition-all duration-300 hover:shadow-2xl border ${
                item.isRead ? "border-transparent" : "border-blue-200 bg-blue-50/40"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex gap-5">
                  <div className={`h-16 w-16 rounded-3xl flex items-center justify-center shrink-0 ${
                    item.isRead ? "bg-slate-100 text-slate-500" : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  }`}>
                    {item.isRead ? <MailOpen size={28} /> : <Bell size={28} />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black">{item.title}</h2>
                      <span className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase ${typeStyle(item.type)}`}>
                        {item.type || "General"}
                      </span>
                    </div>

                    <p className="text-gray-600 mt-4 leading-8 text-lg">{item.message}</p>

                    <div className="flex items-center gap-2 text-gray-400 mt-5">
                      <Clock3 size={16} />
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!item.isRead && (
                    <button
                      onClick={() => markAsRead(item._id)}
                      className="h-12 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all"
                    >
                      <Check size={18} />
                      Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item._id)}
                    className="h-12 w-12 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}