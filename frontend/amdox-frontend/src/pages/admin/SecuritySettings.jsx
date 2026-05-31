import { useEffect, useState } from "react";
import { Shield, Lock, Save, Smartphone, KeyRound, Loader2, Globe, Server } from "lucide-react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState("policies"); // "policies", "sso"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Core Policies State
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [enable2FA, setEnable2FA] = useState(false);
  const [mfaMethod, setMfaMethod] = useState("EMAIL_OTP"); // EMAIL_OTP, TOTP
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginAttempts, setLoginAttempts] = useState(5);

  // Single Sign-On (SAML/OIDC) Configuration State
  const [ssoConfig, setSsoConfig] = useState({
    enabled: false,
    provider: "AZURE_AD", // AZURE_AD, GOOGLE_WORKSPACE, OKTA
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
      alert("Security and SSO configurations synchronized successfully.");
      notifier.settingsConfigured("Workspace Security Policies");
    } catch (err) {
      // API ઑફલાઇન હોય તો પણ બ્રાઉઝર મેમરીમાં સ્ટોર કરો
      localStorage.setItem("mock_security_settings", JSON.stringify({ passwordMinLength, enable2FA, mfaMethod, ssoConfig }));
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
      {/* Header Banner */}
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

      {/* 🔹 રિસ્પોન્સિવ ટાઇટલ ટેબ્સ */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none w-full">
        <button
          onClick={() => setActiveTab("policies")}
          className={`py-2.5 sm:py-3 px-4 sm:px-6 font-bold text-xs sm:text-sm border-b-2 transition-all shrink-0 ${
            activeTab === "policies" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
          }`}
        >
          Authorization Policies
        </button>
        <button
          onClick={() => setActiveTab("sso")}
          className={`py-2.5 sm:py-3 px-4 sm:px-6 font-bold text-xs sm:text-sm border-b-2 transition-all shrink-0 ${
            activeTab === "sso" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
          }`}
        >
          Single Sign-On (SAML / OIDC)
        </button>
      </div>

      {/* TAB 1: AUTHORIZATION POLICIES */}
      {activeTab === "policies" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
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
              <input
                type="number"
                min="6"
                max="32"
                value={passwordMinLength}
                onChange={(e) => setPasswordMinLength(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 px-3.5 bg-white outline-none focus:border-indigo-500 text-xs sm:text-sm text-slate-800 font-bold"
              />
            </div>

            <div className="border border-slate-100 bg-slate-50/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Smartphone className="text-indigo-600 shrink-0" size={18} />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Enforce MFA (Multi-Factor)</h3>
              </div>
              <div className="flex items-center justify-between mt-1 gap-4">
                <select
                  value={mfaMethod}
                  onChange={(e) => setMfaMethod(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-[11px] font-bold text-slate-700 outline-none"
                >
                  <option value="EMAIL_OTP">Email OTP Code</option>
                  <option value="TOTP">Authenticator App (TOTP)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setEnable2FA(!enable2FA)}
                  className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${enable2FA ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${enable2FA ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SINGLE SIGN-ON (SAML / OIDC) */}
      {activeTab === "sso" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Globe size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 truncate">Enterprise SSO Configuration</h2>
                <p className="text-[11px] text-slate-400 font-medium truncate">Configure corporate identity integrations</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setSsoConfig({ ...ssoConfig, enabled: !ssoConfig.enabled })}
              className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${ssoConfig.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${ssoConfig.enabled ? "left-5.5" : "left-0.5"}`} />
            </button>
          </div>

          {ssoConfig.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fade-in text-[10px] sm:text-xs font-bold text-slate-500">
              <div>
                <label className="block uppercase tracking-wider mb-1.5">SSO Provider Protocol</label>
                <select
                  value={ssoConfig.provider}
                  onChange={(e) => setSsoConfig({ ...ssoConfig, provider: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 outline-none font-bold text-slate-600 cursor-pointer"
                >
                  <option value="AZURE_AD">Azure Active Directory (OIDC)</option>
                  <option value="GOOGLE_WORKSPACE">Google Workspace (SAML 2.0)</option>
                  <option value="OKTA">Okta Identity Services</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1.5">Domain Whitelist (Auto-SSO Routing)</label>
                <input
                  type="text"
                  value={ssoConfig.domainWhitelist}
                  onChange={(e) => setSsoConfig({ ...ssoConfig, domainWhitelist: e.target.value })}
                  placeholder="e.g. company.com, corporate.in"
                  className="w-full h-10 border border-slate-200 rounded-xl px-3.5 outline-none focus:border-indigo-500 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block uppercase tracking-wider mb-1.5">Identity Provider (IdP) Metadata URL</label>
                <div className="relative">
                  <Server className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={ssoConfig.metadataUrl}
                    onChange={(e) => setSsoConfig({ ...ssoConfig, metadataUrl: e.target.value })}
                    placeholder="https://login.microsoftonline.com/tenant-id/v2.0/.well-known/openid-configuration"
                    className="block w-full h-10 pl-9 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-indigo-500 text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1.5">Application Client ID</label>
                <input
                  type="text"
                  value={ssoConfig.clientId}
                  onChange={(e) => setSsoConfig({ ...ssoConfig, clientId: e.target.value })}
                  placeholder="Paste Client / Application ID"
                  className="w-full h-10 border border-slate-200 rounded-xl px-3.5 outline-none focus:border-indigo-500 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1.5">Client Secret Key (RS256)</label>
                <input
                  type="password"
                  value={ssoConfig.clientSecret}
                  onChange={(e) => setSsoConfig({ ...ssoConfig, clientSecret: e.target.value })}
                  placeholder="••••••••••••••••"
                  className="w-full h-10 border border-slate-200 rounded-xl px-3.5 outline-none focus:border-indigo-500 text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end w-full">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition disabled:opacity-50 cursor-pointer w-full sm:w-auto"
        >
          {saving ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}