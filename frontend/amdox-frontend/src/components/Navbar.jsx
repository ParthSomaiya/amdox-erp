import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, Sparkles, LogOut, KeyRound, Check, ShieldCheck, Clock, User, X, Mail, ShieldAlert, CheckCheck, Menu, Globe } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

export default function Navbar({ onMenuClick, isJobSeeker }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null") || {};
  const isAuthenticated = !!token && !!user.email;
  const role = user?.role;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [showProfile, setShowProfile] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [resetStep, setResetStep] = useState(1);
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  // પેજ રીફ્રેશ હેન્ડલર
  const handleBrandClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  useEffect(() => {
    window.triggerAmdoxNotification = async (title, message, type = "GENERAL") => {
      try {
        const payload = {
          _id: `notif-${Date.now()}`,
          title,
          message,
          type: type.toUpperCase(),
          isRead: false,
          createdAt: new Date().toISOString()
        };

        const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
        const updatedLocal = [payload, ...localNotifs];
        localStorage.setItem("amdox_notifications", JSON.stringify(updatedLocal));

        await API.post("/notifications", payload).catch(() => {
          console.warn("Local storage backup engaged.");
        });

        try {
          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => { });
        } catch (e) { }

        toast((t) => (
          <div className="flex items-start gap-3 text-left">
            <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-xs">
              🔔
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{message}</p>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="text-slate-400 hover:text-slate-600 ml-2 shrink-0">
              ×
            </button>
          </div>
        ), {
          duration: 5000,
          position: "top-right",
          style: {
            borderRadius: "16px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
            padding: "12px"
          }
        });

        setNotifications((prev) => [payload, ...prev]);
        window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));

      } catch (err) {
        console.error("Global Notification Dispatch Error:", err);
      }
    };
  }, [notifications]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const actionInterceptor = API.interceptors.response.use(
      (response) => {
        const url = response.config.url || "";
        const method = (response.config.method || "").toUpperCase();

        if (method === "POST") {
          if (url.includes("/auth/login")) {
            window.triggerAmdoxNotification?.("Security Session Initiated", "User session established securely in ERP workspace.", "SECURITY");
          }
          else if (url.includes("/auth/register")) {
            window.triggerAmdoxNotification?.("New User Registered", "A new user has been registered in the secure environment.", "SECURITY");
          }
          else if (url.includes("/leave/apply")) {
            window.triggerAmdoxNotification?.("Leave Requested", "New employee leave request submitted for approval.", "LEAVE");
          }
          else if (url.includes("/projects")) {
            window.triggerAmdoxNotification?.("Project Created", "New sprint project roadmap established in the workspace.", "PROJECT");
          }
          else if (url.includes("/tasks")) {
            window.triggerAmdoxNotification?.("Kanban Task Created", "New objective added to team board.", "TASK");
          }
        }
        else if (method === "PUT") {
          if (url.includes("/hr/leave/status")) {
            window.triggerAmdoxNotification?.("Leave Status Resolved", "Leave request has been evaluated by HR.", "LEAVE");
          }
          else if (url.includes("/tasks/")) {
            window.triggerAmdoxNotification?.("Kanban Board Update", "Task progress dynamically synchronized.", "TASK");
          }
        }
        return response;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      API.interceptors.response.eject(actionInterceptor);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();

    const socket = io("http://localhost:5000");

    if (user?._id || user?.id) {
      socket.emit("join", user._id || user.id);
    }

    socket.on("notification", (newNotif) => {
      const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
      const updatedLocal = [newNotif, ...localNotifs];
      localStorage.setItem("amdox_notifications", JSON.stringify(updatedLocal));

      try {
        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => { });
      } catch (e) { }

      toast((t) => (
        <div className="flex items-start gap-3 text-left">
          <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-xs">
            🔔
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{newNotif.title}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{newNotif.message}</p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="text-slate-400 hover:text-slate-600 ml-2 shrink-0">
            ×
          </button>
        </div>
      ), {
        duration: 5000,
        position: "top-right",
        style: {
          borderRadius: "16px",
          background: "#fff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
          padding: "12px"
        }
      });

      setNotifications((prev) => [newNotif, ...prev]);
      window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
    });

    const handleCrossPageSync = () => {
      fetchNotifications();
    };
    window.addEventListener("amdox_notifications_updated", handleCrossPageSync);

    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("amdox_notifications_updated", handleCrossPageSync);
      socket.disconnect();
    };
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
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
      console.error("Using LocalStorage fallback:", err);
      const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
      localNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(localNotifs);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
    } catch (err) {
      console.error(err);
    }
    const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
    const updatedLocal = localNotifs.map((item) => ({ ...item, isRead: true }));
    localStorage.setItem("amdox_notifications", JSON.stringify(updatedLocal));

    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
    } catch (err) {
      console.error(err);
    }

    const localNotifs = JSON.parse(localStorage.getItem("amdox_notifications") || "[]");
    const updatedLocal = localNotifs.map((item) => item._id === id ? { ...item, isRead: true } : item);
    localStorage.setItem("amdox_notifications", JSON.stringify(updatedLocal));

    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    );

    setShowNotifications(false);
    navigate("/notifications");

    window.dispatchEvent(new CustomEvent("amdox_notifications_updated"));
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (emailInput.toLowerCase().trim() !== user?.email?.toLowerCase().trim()) {
      return alert("The email entered does not match your currently logged-in account email.");
    }

    try {
      setLoadingAction(true);
      await API.post("/auth/forgot-password", { email: emailInput.toLowerCase().trim() });
      alert("Verification OTP sent! Check your inbox.");
      setResetStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to dispatch OTP code.");
    } finally {
      setLoadingAction(false);
    }
  };

  const [resetToken, setResetToken] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoadingAction(true);

      const targetEmail = user?.email || emailInput;
      const otpNumber = Number(otpInput.trim());

      const res = await API.post("/auth/verify-otp", {
        email: targetEmail.toLowerCase().trim(),
        otp: otpNumber,
      });

      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
      }

      alert("OTP Verified successfully! Please choose your new password.");
      setResetStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid verification code.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      return alert("Password must be at least 8 characters long.");
    }

    try {
      setLoadingAction(true);

      await API.post(`/auth/reset-password/${resetToken}`, {
        password: newPassword
      });

      alert("Your password has been securely reset.");
      setShowResetModal(false);
      setResetStep(1);
      setEmailInput("");
      setOtpInput("");
      setNewPassword("");
      setResetToken(""); 
      setShowProfile(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoadingAction(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  // ૧. લેન્ડિંગ પેજ અથવા અન-ઓથેન્ટિકેટેડ વિઝિટર કન્ડીશન
  const isGuestOrLanding = !isAuthenticated;

  return (
    <nav className="sticky top-0 z-50 h-20 px-4 md:px-8 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md w-full">
      <Toaster />

      {/* 🔹 LEFT SIDE: કન્ડિશનલ બ્રાન્ડ લોગો અથવા મોબાઇલ હેમબર્ગર */}
      <div className="flex items-center gap-3">
        {isGuestOrLanding || isJobSeeker ? (
          // લેન્ડિંગ પેજ અથવા જોબ સીકર માટે આંતરરાષ્ટ્રીય સ્તરનો Amdox લોગો
          <Link 
            to="/" 
            onClick={handleBrandClick} 
            className="flex items-center gap-3 group transition-all"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-all">
              <Globe size={20} className="animate-spin-slow text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
                AMDOX
              </span>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Enterprise ERP</p>
            </div>
          </Link>
        ) : (
          // એડમિન/કર્મચારી લૉગિન વખતે ડાબી બાજુ લોગો નહીં દેખાય, માત્ર મોબાઇલ હેમબર્ગર બટન દેખાશે
          <button
            onClick={onMenuClick}
            className="lg:hidden h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* 🔹 RIGHT SIDE: રોલ મુજબ સચોટ ગોઠવેલ આઇકોન અને બટનો */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            {/* જોબ સીકર સિવાયના તમામ કર્મચારીઓ/એડમિન માટે ૩ આઇકોન સેટ */}
            {!isJobSeeker && (
              <>
                {/* ૧. AI Assistant (મોબાઇલ પર આઇકોન અને ડેસ્કટોપ પર ફુલ ટેક્સ્ટ બટન) */}
                <button
                  onClick={() => navigate("/ai")}
                  className="h-11 w-11 md:w-auto md:px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Sparkles size={18} />
                  <span className="hidden md:inline text-sm">AI Assistant</span>
                </button>

                {/* ૨. Notification Bell with Dropdown */}
                <div className="relative shrink-0" ref={notificationDropdownRef}>
                  <button
                    onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                    className="relative h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all active:scale-95 cursor-pointer"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-[-48px] sm:right-0 mt-3 w-[calc(100vw-32px)] sm:w-96 max-w-[360px] sm:max-w-none bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden">
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 text-sm">Notifications ({unreadCount})</h4>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                            <CheckCheck size={14} /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-xs">
                            No notifications found.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleMarkSingleRead(n._id)}
                              className={`p-4 text-left transition cursor-pointer hover:bg-slate-50 ${!n.isRead ? "bg-indigo-50/20" : ""}`}
                            >
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-800 text-xs">{n.title}</h5>
                                {!n.isRead && <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-1" />}
                              </div>
                              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{n.message}</p>
                              <span className="text-[9px] text-slate-400 font-semibold block mt-2">
                                {new Date(n.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                        <Link to="/notifications" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-indigo-600 hover:underline">
                          View all activity stream
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ૩. Profile Avatar (તમામ ઓથેન્ટિકેટેડ યુઝર્સ માટે) */}
            <div className="relative shrink-0" ref={profileDropdownRef}>
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-3 focus:outline-none cursor-pointer active:scale-95 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-[-16px] sm:right-0 mt-3 w-[calc(100vw-32px)] sm:w-80 max-w-[280px] sm:max-w-none bg-white border border-slate-200 shadow-xl rounded-2xl z-50 overflow-hidden">
                  <div className="p-5 bg-slate-50 border-b border-slate-100 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <h4 className="font-bold text-slate-800 text-base mt-3">{user?.name}</h4>
                    <p className="text-xs text-slate-400 font-medium truncate max-w-[240px]">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => { setShowProfile(false); navigate("/profile"); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <User size={16} className="text-slate-400" /> My Profile
                    </button>
                    <button
                      onClick={() => { setShowResetModal(true); setResetStep(1); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <KeyRound size={16} className="text-slate-400" /> Reset Password (OTP)
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // મહેમાનો અથવા લેન્ડિંગ પેજ વિઝિટર્સ માટે માત્ર "Sign In" અને "Get Started" બટનો
          <div className="flex items-center gap-2">
            <Link 
              to="/login" 
              className="h-11 px-4 rounded-xl text-slate-600 hover:text-slate-900 font-semibold flex items-center transition-all text-sm"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm shadow-indigo-600/15 transition-all text-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {showResetModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert size={20} className="text-indigo-600" /> Change Password
              </h2>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            {resetStep === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <p className="text-xs text-slate-500">Please enter your verified email to receive 6-digit OTP code.</p>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your login email"
                    className="w-full h-11 border rounded-xl pl-11 pr-4 text-sm bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                  />
                </div>
                <button type="submit" disabled={loadingAction} className="w-full h-11 bg-indigo-600 text-white rounded-xl font-bold text-sm">
                  {loadingAction ? "Sending OTP..." : "Request Verification Code"}
                </button>
              </form>
            )}

            {resetStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-xs text-slate-500">Enter the 6-digit verification code sent to your inbox.</p>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="000000"
                    className="w-full h-11 border rounded-xl pl-11 pr-4 text-sm bg-slate-50/50 text-center tracking-widest font-black focus:bg-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setResetStep(1)} className="flex-1 h-11 border rounded-xl font-semibold text-slate-600 text-sm">Back</button>
                  <button type="submit" disabled={loadingAction} className="flex-1 h-11 bg-indigo-600 text-white rounded-xl font-bold text-sm">Verify Code</button>
                </div>
              </form>
            )}

            {resetStep === 3 && (
              <form onSubmit={handleSavePassword} className="space-y-4">
                <p className="text-xs text-slate-500">Create a secure password with at least 8 characters.</p>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                />
                <button type="submit" disabled={loadingAction} className="w-full h-11 bg-emerald-600 text-white rounded-xl font-bold text-sm">Reset Password</button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}