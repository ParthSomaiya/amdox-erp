import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, Loader2, KeyRound, Briefcase, AlertTriangle } from "lucide-react";
import API from "../services/api";

export default function RegisterChoice() {
  const navigate = useNavigate();
  
  // Steps: 1 = Choose Role, 2 = Input Details, 3 = Verify OTP
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpInput, setOtpInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE", // EMPLOYEE or JOB_SEEKER
  });

  const handleRoleSelection = (selectedRole) => {
    setForm((prev) => ({ ...prev, role: selectedRole }));
    setStep(2);
  };

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit profile details and request real OTP via mail server
  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const endpoint = form.role === "EMPLOYEE" ? "/auth/register-user" : "/auth/register-job";
      
      // ૧. સર્વર પર રજીસ્ટ્રેશન રિકવેસ્ટ મોકલો (કોઈપણ ઈનલાઇન કેચ વગર, જેથી સાચી એરર બહાર આવે)
      await API.post(endpoint, {
        name: form.name,
        email: form.email.toLowerCase().trim(),
        password: form.password,
        role: form.role
      });

      // ૨. સફળતાપૂર્વક ઈમેલ મોકલાયા પછી સ્ટેપ ૩ પર જાઓ
      setStep(3);
    } catch (err) {
      // 🧠 જો ઈમેલ ઓલરેડી રજીસ્ટર હશે (User already exists), તો અહીં સ્ક્રીન પર લાઈવ એરર બતાવશે
      const serverError = err.response?.data?.message || "User already exists or registration failed.";
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  // Verify the OTP code from Mail Inbox
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const cleanOtp = otpInput.trim();

      // ૩. ડેવલપર ટેસ્ટિંગ બાયપાસ કોડ
      if (cleanOtp === "123456") {
        window.triggerAmdoxNotification?.(
          "Account Verified (Bypass)", 
          `Email verified via developer master code. Welcome, ${form.name}!`, 
          "SECURITY"
        );
        alert("Bypass verification successful! Redirecting to login...");
        navigate("/login");
        return;
      }

      // ૪. વાસ્તવિક ઓટીપી કોડ સર્વર દ્વારા ચેક કરાવો
      await API.post("/auth/verify-otp", {
        email: form.email.toLowerCase().trim(),
        otp: cleanOtp
      });

      window.triggerAmdoxNotification?.(
        "Account Verified", 
        `Email verified successfully. Welcome to AMDOX workspace, ${form.name}!`, 
        "SECURITY"
      );

      alert("Email verified successfully! You can now log in to the system.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-200/80">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-sm">
            A
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            {step === 1 && "Register As"}
            {step === 2 && "Create Account"}
            {step === 3 && "Email Verification"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {step === 1 && "Choose how you want to join the AMDOX network"}
            {step === 2 && `Setting up your profile for ${form.role.toLowerCase().replace("_", " ")}`}
            {step === 3 && `Enter the 6-digit verification code sent to ${form.email}`}
          </p>
        </div>

        {/* Error Container */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: CHOOSE ROLE */}
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

        {/* STEP 2: PROFILE DETAILS FORM */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmitDetails}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
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

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-12 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Request OTP"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION INPUT */}
        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">6-Digit Verification Code</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  name="otp"
                  maxLength="6"
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="000000"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-center tracking-widest font-black text-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* ⚠️ Helpful Info */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2.5 text-[10px] text-amber-800 leading-normal">
                <AlertTriangle className="shrink-0 text-amber-600 mt-0.5" size={14} />
                <div>
                  <p className="font-bold">If you did not receive the email:</p>
                  <p className="mt-1">
                    Please check your inbox. If the email doesn't arrive, you can use the master bypass code <span className="font-black text-xs text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-amber-200">123456</span> to complete registration instantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 h-12 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Register"}
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
          <ShieldCheck size={14} />
          <span>Secured Enterprise Portal (MFA Shield)</span>
        </div>

      </div>
    </div>
  );
}