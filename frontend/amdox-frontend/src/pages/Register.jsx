import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { User, Mail, Lock, ShieldCheck, Loader2, ArrowLeft, KeyRound } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Choose Role, 2: Account Details, 3: OTP Verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE", // Default role
  });

  const handleRoleSelect = (selectedRole) => {
    setForm({ ...form, role: selectedRole });
    setStep(2);
  };

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Details to Register & Request OTP
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // Call API to register and trigger OTP email sending
      await API.post("/auth/register-user", {
        name: form.name,
        email: form.email.toLowerCase().trim(),
        password: form.password,
        role: form.role,
      });

      // Advance to the OTP code verification step
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify Received OTP Code
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-200/60">
        
        {/* HEADER */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-sm">
            A
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            {step === 1 && "Create Your Account"}
            {step === 2 && "Enter Details"}
            {step === 3 && "Verify Your Email"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {step === 1 && "Select how you would like to join the AMDOX workspace"}
            {step === 2 && `Setting up your account profile as ${form.role.replace("_", " ")}`}
            {step === 3 && `Enter the 6-digit verification code sent to ${form.email}`}
          </p>
        </div>

        {/* ERROR CONTAINER */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: CHOOSE ROLE */}
        {step === 1 && (
          <div className="space-y-4 mt-8">
            <button
              onClick={() => handleRoleSelect("EMPLOYEE")}
              className="w-full flex items-center gap-4 p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="text-3xl p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-100/30">👨‍💼</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Employee Portal</h3>
                <p className="text-sm text-slate-500 mt-1">HR, payroll, tracking and workspace administration tools.</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("JOB_SEEKER")}
              className="w-full flex items-center gap-4 p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="text-3xl p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-100/30">💼</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Career Portal</h3>
                <p className="text-sm text-slate-500 mt-1">Apply to job postings and track your hiring applications.</p>
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

        {/* STEP 2: PROFILE DETAILS */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
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
                    placeholder="John Doe"
                    className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email Address */}
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
                className="w-1/3 h-12 flex justify-center items-center border border-slate-300 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 flex justify-center items-center text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5 text-white" /> : "Continue"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
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
                className="w-1/3 h-12 flex justify-center items-center border border-slate-300 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 flex justify-center items-center text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5 text-white" /> : "Verify Code"}
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
          <ShieldCheck size={14} />
          <span>Security Protected Environment</span>
        </div>
      </div>
    </div>
  );
}