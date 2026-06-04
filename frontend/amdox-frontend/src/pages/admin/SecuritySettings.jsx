import { useEffect, useState } from "react";
import { Shield, Lock, Save, Smartphone, KeyRound, Loader2, Globe, Server } from "lucide-react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

// 🚀 DYNAMIC AXIOS INTERCEPTOR: દરેક રિકવેસ્ટ વખતે તાજું ટોકન જ મોકલશે
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 🛡️ SAFEST LOCAL STORAGE DECORATOR (Wipe-out protection on logout)
const originalClear = localStorage.clear;
localStorage.clear = function() {
  const employees = localStorage.getItem("amdox_employees");
  const leaves = localStorage.getItem("amdox_applied_leaves");
  const attendance = localStorage.getItem("amdox_simulated_attendance");
  const payrolls = localStorage.getItem("amdox_simulated_payrolls");
  const webhooks = localStorage.getItem("amdox_webhooks");
  const security = localStorage.getItem("amdox_security_settings");
  const gdpr = localStorage.getItem("amdox_gdpr_requests");

  originalClear.call(localStorage);

  if (employees) localStorage.setItem("amdox_employees", employees);
  if (leaves) localStorage.setItem("amdox_applied_leaves", leaves);
  if (attendance) localStorage.setItem("amdox_simulated_attendance", attendance);
  if (payrolls) localStorage.setItem("amdox_simulated_payrolls", payrolls);
  if (webhooks) localStorage.setItem("amdox_webhooks", webhooks);
  if (security) localStorage.setItem("amdox_security_settings", security);
  if (gdpr) localStorage.setItem("amdox_gdpr_requests", gdpr);
};

export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState("policies");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [enable2FA, setEnable2FA] = useState(false);
  const [mfaMethod, setMfaMethod] = useState("EMAIL_OTP");
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginAttempts, setLoginAttempts] = useState(5);

  const [ssoConfig, setSsoConfig] = useState({
    enabled: false,
    provider: "AZURE_AD",
    metadataUrl: "",
    clientId: "",
    clientSecret: "",
    domainWhitelist: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/settings");
      const security = res.data?.securitySettings;
      if (security) {
        setPasswordMinLength(security.passwordMinLength || 8);
        setEnable2FA(security.enable2FA || false);
        setMfaMethod(security.mfaMethod || "EMAIL_OTP");
        setSessionTimeout(security.sessionTimeout || 30);
        setLoginAttempts(security.loginAttempts || 5);
      }
      
      const sso = res.data?.ssoSettings;
      if (sso) {
        setSsoConfig({
          enabled: sso.enabled || false,
          provider: sso.provider || "AZURE_AD",
          metadataUrl: sso.metadataUrl || "",
          clientId: sso.clientId || "",
          clientSecret: sso.clientSecret || "",
          domainWhitelist: sso.domainWhitelist || "",
        });
      }
    } catch (err) {
      console.warn("Using local configuration mock parameters.");
      const saved = localStorage.getItem("amdox_security_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPasswordMinLength(parsed.passwordMinLength || 8);
        setEnable2FA(parsed.enable2FA || false);
        setMfaMethod(parsed.mfaMethod || "EMAIL_OTP");
        setSessionTimeout(parsed.sessionTimeout || 30);
        setLoginAttempts(parsed.loginAttempts || 5);
        if (parsed.ssoConfig) setSsoConfig(parsed.ssoConfig);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const payload = {
        securitySettings: {
          passwordMinLength: Number(passwordMinLength),
          enable2FA,
          mfaMethod,
          sessionTimeout: Number(sessionTimeout),
          loginAttempts: Number(loginAttempts),
        },
        ssoSettings: ssoConfig,
      };

      await API.post("/admin/settings", payload);
      localStorage.setItem("amdox_security_settings", JSON.stringify({
        passwordMinLength, enable2FA, mfaMethod, sessionTimeout, loginAttempts, ssoConfig
      }));
      alert("Security and SSO configurations synchronized successfully.");
      notifier.settingsConfigured("Workspace Security Policies");
    } catch (err) {
      localStorage.setItem("amdox_security_settings", JSON.stringify({
        passwordMinLength, enable2FA, mfaMethod, sessionTimeout, loginAttempts, ssoConfig
      }));
      alert("Configurations saved in offline local workspace.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <h2 className="text-base font-bold mt-4 text-slate-700">Loading Security Configuration...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto overflow-x-hidden px-1">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight">Security & SSO Center</h1>
            <p className="mt-0.5 text-xs text-slate-300">Set identity compliance, multi-factor logins, and enterprise authentication.</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none w-full">
        <button onClick={() => setActiveTab("policies")} className={`py-2.5 sm:py-3 px-4 sm:px-6 font-bold text-xs sm:text-sm border-b-2 transition ${activeTab === "policies" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}>Authorization Policies</button>
        <button onClick={() => setActiveTab("sso")} className={`py-2.5 sm:py-3 px-4 sm:px-6 font-bold text-xs sm:text-sm border-b-2 transition ${activeTab === "sso" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}>Single Sign-On (SAML / OIDC)</button>
      </div>

      {activeTab === "policies" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Lock size={18} /></div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">Password & Session Safeguards</h2>
              <p className="text-[11px] text-slate-400 font-medium">Configure access limits and brute-force protections</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="border border-slate-100 bg-slate-50/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <div className="flex items-center gap-2.5 mb-3">
                <KeyRound className="text-indigo-600 shrink-0" size={18} />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Minimum Password Length</h3>
              </div>
              <input type="number" min="6" max="32" value={passwordMinLength} onChange={(e) => setPasswordMinLength(e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 bg-white outline-none focus:border-indigo-500 text-xs sm:text-sm text-slate-800 font-bold" />
            </div>

            <div className="border border-slate-100 bg-slate-50/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Smartphone className="text-indigo-600 shrink-0" size={18} />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Enforce MFA (Multi-Factor)</h3>
              </div>
              <div className="flex items-center justify-between mt-1 gap-4">
                <select value={mfaMethod} onChange={(e) => setMfaMethod(e.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-[11px] font-bold text-slate-700 outline-none">
                  <option value="EMAIL_OTP">Email OTP Code</option>
                  <option value="TOTP">Authenticator App (TOTP)</option>
                </select>
                <button type="button" onClick={() => setEnable2FA(!enable2FA)} className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${enable2FA ? "bg-emerald-500" : "bg-slate-300"}`}><div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${enable2FA ? "left-5.5" : "left-0.5"}`} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "sso" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Globe size={18} /></div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 truncate">Enterprise SSO Configuration</h2>
                <p className="text-[11px] text-slate-400 font-medium truncate">Configure corporate identity integrations</p>
              </div>
            </div>
            <button type="button" onClick={() => setSsoConfig({ ...ssoConfig, enabled: !ssoConfig.enabled })} className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${ssoConfig.enabled ? "bg-emerald-500" : "bg-slate-300"}`}><div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${ssoConfig.enabled ? "left-5.5" : "left-0.5"}`} /></button>
          </div>
        </div>
      )}

      <div className="flex justify-end w-full">
        <button onClick={saveSettings} className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md">Save Configuration</button>
      </div>
    </div>
  );
}