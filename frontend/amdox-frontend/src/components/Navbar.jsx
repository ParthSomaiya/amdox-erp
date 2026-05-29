import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom"; // 🔹 ૧. પોર્ટલ ઇમ્પોર્ટ કર્યું (Crucial Centering Fix)
import { Bell, Sparkles, LogOut, KeyRound, Check, ShieldCheck, Clock, User, X, Mail, ShieldAlert } from "lucide-react";
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
  
  const [showProfile, setShowProfile] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  
  const [resetStep, setResetStep] = useState(1); 
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
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

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (emailInput.toLowerCase().trim() !== user?.email?.toLowerCase().trim()) {
      return alert("The email entered does not match your currently logged-in account email.");
    }

    try {
      setLoadingAction(true);
      await API.post("/auth/forgot-password", { email: emailInput.toLowerCase().trim() });
      alert("Verification OTP sent! If you are on localhost, check your backend terminal (Nodemon Console)!");
      setResetStep(2); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to dispatch OTP code.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoadingAction(true);
      await API.post("/auth/verify-otp", {
        email: emailInput.toLowerCase().trim(),
        otp: otpInput.trim(),
      });
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
      await API.post("/admin/settings", {
        securitySettings: { passwordMinLength: 8 }
      });
      alert("Your password has been securely reset.");
      setShowResetModal(false);
      setResetStep(1);
      setEmailInput("");
      setOtpInput("");
      setNewPassword("");
      setShowProfile(false);
    } catch (err) {
      alert("Failed to reset password: " + err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <nav className="sticky top-0 z-50 h-20 px-8 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      
      {/* Logo */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">A</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">AMDOX</span>
        </Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {/* AI Assistant */}
            <button
              onClick={() => navigate("/ai")}
              className="hidden md:flex h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles size={16} /> AI Assistant
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all"
              >
                <Bell size={18} />
                {unreadCount > 0 && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />}
              </button>
            </div>

            {/* PROFILE POPUP TRIGGER */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-3 pl-2 border-l border-slate-200 focus:outline-none cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="hidden sm:block text-left">
                  <h4 className="text-slate-800 font-semibold text-sm leading-none">{user?.name || "Admin"}</h4>
                  <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-wider">{user?.role || "ADMIN"}</p>
                </div>
              </button>

              {/* FLOATING DROPDOWN MENU */}
              {showProfile && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 overflow-hidden">
                  <div className="p-5 bg-slate-50 border-b border-slate-100 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <h4 className="font-bold text-slate-800 text-base mt-3">{user?.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
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
          <>
            <Link to="/login" className="h-11 px-5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 transition-all">Sign In</Link>
            <Link to="/register" className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm transition-all">Get Started</Link>
          </>
        )}
      </div>

      {/* 🔹 ૨. SECURED 3-STEP OTP PASSWORD RESET MODAL USING PORTAL (Centers Perfectly on Screen!) */}
      {showResetModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert size={20} className="text-indigo-600" /> Change Password
              </h2>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            {/* STEP 1: Enter Email */}
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

            {/* STEP 2: Enter OTP Code */}
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

            {/* STEP 3: Enter New Password */}
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
        document.body // 🔹 પોર્ટલ સીધું જ બોડી સાથે જોડેલ છે
      )}
    </nav>
  );
}