import { useEffect, useState } from "react";
import { Shield, Lock, Save, Smartphone, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import API from "../../services/api";

export default function SecuritySettings() {
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [enable2FA, setEnable2FA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginAttempts, setLoginAttempts] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get("/admin/settings");
      const security = res.data?.securitySettings;
      if (security) {
        setPasswordMinLength(security.passwordMinLength || 8);
        setEnable2FA(security.enable2FA || false);
        setSessionTimeout(security.sessionTimeout || 30);
        setLoginAttempts(security.loginAttempts || 5);
      }
    } catch (err) {
      console.error("Failed to load security settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await API.post("/admin/settings", {
        securitySettings: {
          passwordMinLength: Number(passwordMinLength),
          enable2FA,
          sessionTimeout: Number(sessionTimeout),
          loginAttempts: Number(loginAttempts),
        },
      });
      alert("Security configuration saved successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save security settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <h2 className="text-xl font-bold mt-6 text-slate-700">Loading Security Configuration...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 rounded-3xl p-8 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Security Settings</h1>
            <p className="mt-1 text-indigo-100">Configure security parameters, session locks, and policies.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Workspace Authorization Policies</h2>
            <p className="text-sm text-slate-400 font-medium">Protect active systems and users.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password Limit */}
          <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <KeyRound className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-800 text-sm">Min Password Length</h3>
            </div>
            <input
              type="number"
              min="6"
              max="32"
              value={passwordMinLength}
              onChange={(e) => setPasswordMinLength(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-white outline-none focus:border-indigo-500 text-sm text-slate-800 font-medium"
            />
          </div>

          {/* 2FA Option */}
          <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-800 text-sm">Two-Factor Auth (2FA)</h3>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-400 font-medium">Enforce OTP validations</span>
              <button
                type="button"
                onClick={() => setEnable2FA(!enable2FA)}
                className={`relative h-7 w-12 rounded-full transition-colors ${enable2FA ? "bg-emerald-500" : "bg-slate-300"}`}
              >
                <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${enable2FA ? "left-6" : "left-1"}`} />
              </button>
            </div>
          </div>

          {/* Session Limit */}
          <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Session Expiry Lockout</h3>
            <label className="block text-xs text-slate-400 mb-2 font-medium">Auto Logout (Minutes)</label>
            <input
              type="number"
              min="5"
              max="240"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-white outline-none focus:border-indigo-500 text-sm text-slate-800 font-medium"
            />
          </div>

          {/* Lockout Attempts */}
          <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Account Protection</h3>
            <label className="block text-xs text-slate-400 mb-2 font-medium">Max Failed Login Attempts</label>
            <input
              type="number"
              min="1"
              max="10"
              value={loginAttempts}
              onChange={(e) => setLoginAttempts(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-white outline-none focus:border-indigo-500 text-sm text-slate-800 font-medium"
            />
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex gap-3 text-slate-700">
          <CheckCircle2 className="text-indigo-600 shrink-0 mt-0.5" size={18} />
          <div className="text-xs space-y-1">
            <p className="font-bold text-indigo-900">Recommended Security Settings</p>
            <p className="text-slate-500 leading-normal">
              Activate 2FA and define a minimum length of 8 characters for your workspace users.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}