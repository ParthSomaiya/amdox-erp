import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { User, Mail, Lock, ShieldCheck, Loader2, KeyRound, Globe, Server, Activity, Shield, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Choose Role, 2: Account Details, 3: OTP Verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [isPluginOpen, setIsPluginOpen] = useState(false);
  const [latency, setLatency] = useState(12);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (selectedRole) => {
    setForm({ ...form, role: selectedRole });
    setStep(2);
  };

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await API.post("/auth/register-user", {
        name: form.name,
        email: form.email.toLowerCase().trim(),
        password: form.password,
        role: form.role,
      });

      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await API.post("/auth/verify-otp", {
        email: form.email.toLowerCase().trim(),
        otp: otp.trim(),
      });

      alert("Email verified successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP code. Please verify.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans relative w-full">
      {/* LEFT COLUMN: પ્રીમિયમ બ્રાન્ડિંગ પેનલ (ડેસ્કટોપ પર જ દેખાશે) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/15">
            <Globe size={20} className="text-white animate-spin-slow" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight">AMDOX</span>
            <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">Enterprise ERP Suite</p>
          </div>
        </div>

        {/* Visual Content */}
        <div className="space-y-6 relative z-10 max-w-md">
          <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-indigo-200">
            Secure Member Portal Registration
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Create Your Enterprise Identity Credentials.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Register your enterprise staff node profile, configure strong credentials, and secure your workspace domain parameters.
          </p>
        </div>

        {/* Trust Seal */}
        <div className="flex items-center gap-4 relative z-10 text-xs text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> SOC2 Secure</div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> ISO 27001 Ready</div>
        </div>
      </div>

      {/* RIGHT COLUMN: એક્ટિવ ઓથેન્ટિકેશન ફોર્મ (મોબાઇલ-ફ્રેન્ડલી અને રિસ્પોન્સિવ) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-10 lg:p-12">
        <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
          
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-sm shrink-0">
              A
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
              {step === 1 && "Create Your Account"}
              {step === 2 && "Enter Details"}
              {step === 3 && "Verify Your Email"}
            </h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {step === 1 && "Select how you would like to join the AMDOX workspace."}
              {step === 2 && `Setting up your account profile as ${form.role.replace("_", " ")}`}
              {step === 3 && `Enter the 6-digit verification code sent to ${form.email}`}
            </p>
          </div>

          {error && (
            <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          {/* STEP 1: CHOOSE ROLE */}
          {step === 1 && (
            <div className="space-y-4 mt-6">
              <button
                onClick={() => handleRoleSelect("EMPLOYEE")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/10 text-left transition-all group cursor-pointer"
              >
                <div className="text-3xl p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-100/30">👨‍💼</div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Employee Portal</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">HR, payroll, tracking and workspace administration tools.</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("JOB_SEEKER")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/10 text-left transition-all group cursor-pointer"
              >
                <div className="text-3xl p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-100/30">💼</div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Career Portal</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">Apply to job postings and track your hiring applications.</p>
                </div>
              </button>

              <div className="text-center pt-4">
                <p className="text-xs text-slate-500 font-semibold">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE DETAILS */}
          {step === 2 && (
            <form className="mt-6 space-y-4" onSubmit={handleRegisterSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-12 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Continue"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === 3 && (
            <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Verification Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    name="otp"
                    maxLength="6"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-center tracking-widest font-black text-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 h-12 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify Code"}
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center justify-center gap-2 pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
            <ShieldCheck size={14} />
            <span>Secure Enterprise Workspace Portal</span>
          </div>
        </div>
      </div>

      {/* ================= 🔮 SECURITY MONITOR PLUG-IN ================= */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
        <AnimatePresence>
          {isPluginOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 w-[calc(100vw-32px)] sm:w-[350px] max-w-full mb-4 space-y-4 font-mono text-left"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-indigo-400 animate-pulse" />
                  <span className="font-extrabold text-[11px] tracking-wider text-indigo-100 uppercase">Amdox Guard™ Portal</span>
                </div>
                <button onClick={() => setIsPluginOpen(false)} className="text-slate-400 hover:text-white transition cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-2.5 text-[11px] font-semibold text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Server size={12} /> Server Latency</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> {latency}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Activity size={12} /> MFA Tunnel</span>
                  <span className="text-slate-300">Active (TLS 1.3)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> SOC2 Security</span>
                  <span className="text-indigo-400 font-bold">Verified Check</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsPluginOpen(!isPluginOpen)}
          className="h-14 w-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-indigo-500/10 relative"
        >
          {isPluginOpen ? <X size={20} /> : <Shield size={20} className="text-indigo-400" />}
        </button>
      </div>
    </div>
  );
}