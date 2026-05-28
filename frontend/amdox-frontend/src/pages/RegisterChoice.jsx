import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { User, Mail, Lock, ShieldCheck, Loader2, ArrowLeft, KeyRound, Briefcase } from "lucide-react";

export default function RegisterChoice() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Choose Role, 2: Input Details, 3: Verify OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const handleRoleSelection = (role) => {
    setForm((prev) => ({ ...prev, role }));
    setStep(2);
  };

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (form.role === "EMPLOYEE") {
        await API.post("/auth/register-user", {
          name: form.name,
          email: form.email.toLowerCase().trim(),
          password: form.password,
          role: "EMPLOYEE",
        });
        setStep(3); // Employee moves to OTP step
      } else {
        await API.post("/auth/register-job", {
          name: form.name,
          email: form.email.toLowerCase().trim(),
          password: form.password,
        });
        alert("Registration complete! You can now log in.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration encountered an issue. Please try again.");
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

      alert("Email verified successfully! You can now sign in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification code is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-200/80 animate-fade-in">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-sm">
            A
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            {step === 1 && "Register As"}
            {step === 2 && "Create Workspace"}
            {step === 3 && "Verify Identity"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {step === 1 && "Choose how you want to join the AMDOX network"}
            {step === 2 && `Setting up your profile for ${form.role.toLowerCase()}`}
            {step === 3 && `Enter the 6-digit code sent to ${form.email}`}
          </p>
        </div>

        {/* Error Container */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        {/* STEP 1: CHOOSE WORKSPACE ROLE */}
        {step === 1 && (
          <div className="space-y-4 mt-8">
            <button
              onClick={() => handleRoleSelection("EMPLOYEE")}
              className="w-full flex items-center gap-4 p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/10 text-left transition-all group"
            >
              <div className="text-3xl p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-100/20">
                <User size={24} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-base">Employee</h3>
                <p className="text-xs text-slate-500 mt-1">HR portals, payslip logs, and general workflow task boards.</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelection("JOB_SEEKER")}
              className="w-full flex items-center gap-4 p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/10 text-left transition-all group"
            >
              <div className="text-3xl p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-100/20">
                <Briefcase size={24} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-base">Job Applicant</h3>
                <p className="text-xs text-slate-500 mt-1">Browse and apply to career openings at AMDOX.</p>
              </div>
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: ACCOUNT REGISTRATION FORM */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmitDetails}>
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-12 flex justify-center items-center border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 flex justify-center items-center text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5 text-white" /> : "Sign Up"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION VIEW */}
        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">6-Digit Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="otp"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-center tracking-widest font-black focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 h-12 flex justify-center items-center border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 flex justify-center items-center text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5 text-white" /> : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
          <ShieldCheck size={14} />
          <span>Secured Enterprise Portal</span>
        </div>

      </div>
    </div>
  );
}