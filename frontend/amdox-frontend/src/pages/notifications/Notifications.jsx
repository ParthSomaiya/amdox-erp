import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Check, CheckCheck, Clock3, MailOpen, Search, Trash2, Loader2, ShieldCheck } from "lucide-react";
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

    const socket = io("http://localhost:5000");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?._id || user?.id) {
      socket.emit("join", user._id || user.id);
    }

    socket.on("notification", (newNotif) => {
      // 🚀 લાઈવ નોટિફિકેશન સેવ ટુ લોકલ સ્ટોરેજ (તમારું બેકઅપ લોજીક)
      const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
      const updatedLocal = [newNotif, ...localNotifs];
      localStorage.setItem("amdox_notifications", JSON.stringify(updatedLocal));

      try {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      } catch (e) {}
      
      setNotifications((prev) => [newNotif, ...prev]);
    });

    const handleCrossPageSync = () => {
      fetchNotifications();
    };
    window.addEventListener("amdox_notifications_updated", handleCrossPageSync);

    return () => {
      socket.disconnect();
      window.removeEventListener("amdox_notifications_updated", handleCrossPageSync);
    };
  }, []);

  // 🔄 હાઇબ્રિડ સિંકિંગ લોડર (API + LocalStorage Merge)
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      const serverNotifs = Array.isArray(res.data) ? res.data : [];
      
      const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
      
      const merged = [...serverNotifs];
      localNotifs.forEach((ln) => {
        if (!merged.some((sn) => sn._id === ln._id)) {
          merged.push(ln);
        }
      });

      merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(merged);
    } catch (err) {
      console.error("API Fetch Failed. Loading from Local Storage:", err);
      // ફોલબેક: જો બેકએન્ડ બંધ હોય તો લોકલ સ્ટોરેજમાંથી ડેટા બતાવો
      const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
      localNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(localNotifs);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
    } catch (err) {
      console.warn("API Error on Mark All Read:", err);
    }

    const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
    const updatedLocal = localNotifs.map((item) => ({ ...item, isRead: true }));
    localStorage.setItem("amdox_notifications", JSON.stringify(updatedLocal));

    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
    } catch (err) {
      console.warn("API Error on Mark Read:", err);
    }

    const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
    const updatedLocal = localNotifs.map((item) => item._id === id ? { ...item, isRead: true } : item);
    localStorage.setItem("amdox_notifications", JSON.stringify(updatedLocal));

    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    );
    window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
    } catch (err) {
      console.warn("API Error on Delete:", err);
    }

    const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
    const updatedLocal = localNotifs.filter((item) => item._id !== id);
    localStorage.setItem("amdox_notifications", JSON.stringify(updatedLocal));

    setNotifications((prev) => prev.filter((item) => item._id !== id));
    window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
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
      const text = `${item.title || ""} ${item.message || ""} ${item.type || ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });

    return filtered;
  }, [notifications, search, activeFilter]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const readCount = notifications.filter((item) => item.isRead).length;

  const typeStyle = (type) => {
    switch (type?.toUpperCase()) {
      case "PAYROLL": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "LEAVE": return "bg-amber-100 text-amber-700 border border-amber-200";
      case "PROJECT": return "bg-sky-100 text-sky-700 border border-sky-200";
      case "TASK": return "bg-violet-100 text-violet-700 border border-violet-200";
      default: return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      
      {/* 🚀 HERO BANNER (Premium Dark Layout with Counters) */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-2">Workspace Audit Stream</span>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Bell className="text-indigo-400" size={20} />
            </div>
            Notifications Center
          </h1>
          <p className="mt-3 text-slate-400 text-sm max-w-xl">
            Stay updated with real-time enterprise alerts, offline-synced logs, and system events.
          </p>
        </div>

        {/* Dynamic Metric Cards inside Header */}
        <div className="flex gap-4 relative z-10">
          <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl min-w-[120px] text-center backdrop-blur-md">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unread</p>
            <h2 className="text-3xl font-black text-rose-500 mt-1">{unreadCount}</h2>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl min-w-[120px] text-center backdrop-blur-md">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Read</p>
            <h2 className="text-3xl font-black text-emerald-500 mt-1">{readCount}</h2>
          </div>
        </div>
      </div>

      {/* 🚀 TOOLBAR CONTROLS */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full md:max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search system logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-3 rounded-xl border bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 text-sm font-semibold text-slate-700 transition"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {["ALL", "UNREAD", "READ"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`h-10 px-5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeFilter === f 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="h-10 px-5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
          >
            <CheckCheck size={14} /> Mark All as Read
          </button>
        )}
      </div>

      {/* 🚀 NOTIFICATIONS LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-20 text-center shadow-sm">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <h2 className="text-sm font-bold text-slate-500 mt-4">Syncing secure logs...</h2>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-sm">
            <MailOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-black text-slate-700">Inbox Clear</h2>
            <p className="text-slate-400 text-sm mt-1">You have no matching notifications.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div 
              key={n._id} 
              className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !n.isRead ? "border-l-4 border-l-indigo-600 bg-indigo-50/10" : "border-slate-200/80"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon based on read status */}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                  n.isRead ? "bg-slate-50 text-slate-400 border border-slate-100" : "bg-indigo-100 text-indigo-600"
                }`}>
                  {n.isRead ? <MailOpen size={20} /> : <Bell size={20} />}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-800 text-sm">{n.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${typeStyle(n.type)}`}>
                      {n.type || "SYSTEM"}
                    </span>
                  </div>
                  
                  <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">{n.message}</p>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold pt-1">
                    <Clock3 size={12} />
                    {new Date(n.createdAt).toLocaleString("en-IN", { 
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-end">
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="h-9 px-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Check size={14} /> Acknowledge
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-100 flex items-center justify-center transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> Hybrid Local-Storage Notification Sync Active
      </div>
    </div>
  );
}