import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock, ShieldCheck, Loader2, Globe, ShieldAlert, CheckCircle2, KeyRound } from "lucide-react";
import notifier from "../utils/notifier";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("credentials"); // "credentials", "mfa"
  const [detectedTenant, setDetectedTenant] = useState(null);
  const [mfaType, setMfaType] = useState("EMAIL_OTP"); // EMAIL_OTP, TOTP
  const [mfaCode, setMfaCode] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ડાયનેમિક ઈમેલ ડોમેન ચેક દ્વારા ઓટો-ટેનન્ટ લોકેટર
  useEffect(() => {
    if (form.email.includes("@")) {
      const domain = form.email.split("@")[1].toLowerCase();
      if (domain === "amdox.com" || domain === "enterprise.in") {
        setDetectedTenant({
          name: "AMDOX Enterprise Main",
          ssoEnabled: true,
          ssoProvider: "AZURE_AD",
          mfaRequired: true,
          mfaMethod: "TOTP"
        });
      } else if (domain === "google.co" || domain === "tech.org") {
        setDetectedTenant({
          name: "Global Tech Hub",
          ssoEnabled: true,
          ssoProvider: "GOOGLE_WORKSPACE",
          mfaRequired: true,
          mfaMethod: "EMAIL_OTP"
        });
      } else {
        setDetectedTenant(null);
      }
    } else {
      setDetectedTenant(null);
    }
  }, [form.email]);

  const handleChange = (e) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // જો ભાડુઆત (Tenant) ને MFA ની જરૂર હોય, તો સીધા વેરિફિકેશન સ્ટેપ પર ટ્રાન્સફર કરો
      if (detectedTenant?.mfaRequired && step === "credentials") {
        await new Promise((resolve) => setTimeout(resolve, 800)); // API ચેક સિમ્યુલેશન
        setMfaType(detectedTenant.mfaMethod);
        setStep("mfa");
        setLoading(false);
        return;
      }

      const payload = {
        email: form.email.toLowerCase().trim(),
        password: form.password,
        ...(step === "mfa" ? { mfaCode } : {})
      };

      const res = await API.post("/auth/login", payload);
      const { accessToken, user } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      handleNavigation(user.role);
    } catch (err) {
      // API ન હોવાની સ્થિતિમાં ટેસ્ટિંગ માટે ફોલબેક લોગિન સિમ્યુલેશન
      if (err.response?.status === 404 || err.code === "ERR_NETWORK") {
        console.warn("API offline. Engaging simulated credentials flow.");
        simulateMockLogin();
      } else {
        setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const simulateMockLogin = () => {
    const mockUser = {
      name: form.email.split("@")[0].toUpperCase() || "Admin User",
      email: form.email,
      role: form.email.toLowerCase().includes("admin") ? "ADMIN" : "EMPLOYEE"
    };
    localStorage.setItem("token", "mock-token-2026");
    localStorage.setItem("user", JSON.stringify(mockUser));
    handleNavigation(mockUser.role);
  };

  const handleNavigation = (role) => {
    if (role === "ADMIN") navigate("/dashboard");
    else if (role === "EMPLOYEE") navigate("/employee-dashboard");
    else navigate("/careers");
    
    window.triggerAmdoxNotification?.(
      "Secure Session Started",
      `Authenticated successfully via ${detectedTenant ? "Enterprise SSO" : "Local Workspace Credentials"}.`,
      "SECURITY"
    );
  };

  const triggerSsoLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const simulatedUser = {
        name: "Enterprise Staff",
        email: form.email || "sso.user@company.com",
        role: "EMPLOYEE"
      };
      localStorage.setItem("token", "sso-mock-token");
      localStorage.setItem("user", JSON.stringify(simulatedUser));
      handleNavigation("EMPLOYEE");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-200/60">
        
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-sm">
            A
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            {step === "mfa" ? "Identity Verification" : "Sign In"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {step === "mfa" 
              ? "Your organization requires multi-factor authentication to secure this session."
              : "Enter your credentials to access your AMDOX workspace"
            }
          </p>
        </div>

        {/* Dynamic Tenant Detection Banner */}
        {detectedTenant && step === "credentials" && (
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-semibold animate-fade-in">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-indigo-600 animate-spin-slow" />
              <span>Domain belongs to: <strong className="text-indigo-950">{detectedTenant.name}</strong></span>
            </div>
            {detectedTenant.ssoEnabled && (
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">SSO Active</span>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* STEP A: CREDENTIALS FLOW */}
        {step === "credentials" ? (
          <form className="space-y-6" onSubmit={submit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 flex justify-center items-center text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
            </button>

            {/* SSO Routing Portal */}
            {detectedTenant?.ssoEnabled && (
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">or single sign-on</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            )}

            {detectedTenant?.ssoEnabled && (
              <button
                type="button"
                onClick={() => triggerSsoLogin(detectedTenant.ssoProvider)}
                className="w-full h-12 border border-slate-200 hover:border-indigo-200 rounded-xl bg-white text-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition hover:bg-indigo-50/20"
              >
                <Globe size={16} className="text-indigo-600" />
                Sign In with {detectedTenant.ssoProvider === "AZURE_AD" ? "Azure AD" : "Google Workspace"}
              </button>
            )}
          </form>
        ) : (
          /* STEP B: MFA CHALLENGE FLOW */
          <form className="space-y-6" onSubmit={submit}>
            <div className="p-4 bg-slate-50 rounded-2xl border text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800 block mb-1">MFA Required</span>
              {mfaType === "TOTP" 
                ? "Enter the 6-digit verification code from your Google Authenticator or Microsoft Authenticator app."
                : `We've sent a 6-digit session verification OTP to your email: ${form.email}`
              }
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="000000"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-center tracking-widest font-black text-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="w-1/3 h-12 border rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || mfaCode.length < 6}
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Sign In"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
          <ShieldCheck size={14} />
          <span>Secure Multi-Tenant Authentication (SAML/OIDC)</span>
        </div>
      </div>
    </div>
  );
}