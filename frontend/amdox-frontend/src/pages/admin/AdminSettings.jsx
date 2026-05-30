import { useEffect, useState } from "react";
import { Building2, Mail, Phone, Globe, Save, Shield, Bell, Palette, Settings2, Loader2 } from "lucide-react";
import API from "../../services/api";
import notifier from "../utils/notifier";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    companySettings: {
      companyName: "",
      email: "",
      phone: "",
      website: "",
      address: "",
    },
    systemSettings: {
      maintenanceMode: false,
      emailNotifications: true,
      darkMode: false,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/settings");
      if (res.data) {
        setSettings({
          companySettings: {
            companyName: res.data?.companySettings?.companyName || "",
            email: res.data?.companySettings?.email || "",
            phone: res.data?.companySettings?.phone || "",
            website: res.data?.companySettings?.website || "",
            address: res.data?.companySettings?.address || "",
          },
          systemSettings: {
            maintenanceMode: res.data?.systemSettings?.maintenanceMode || false,
            emailNotifications: res.data?.systemSettings?.emailNotifications ?? true,
            darkMode: res.data?.systemSettings?.darkMode || false,
          },
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      companySettings: { ...prev.companySettings, [field]: value },
    }));
  };

  const handleToggle = (field) => {
    setSettings((prev) => ({
      ...prev,
      systemSettings: { ...prev.systemSettings, [field]: !prev.systemSettings[field] },
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await API.post("/admin/settings", settings);
      alert("Settings saved successfully");
      notifier.settingsConfigured("Company Profile Configuration");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 border-t-transparent animate-spin text-indigo-600 mx-auto" />
          <h2 className="text-xl font-bold mt-6 text-slate-700">Loading Workspace Settings...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Settings</h1>
            <p className="mt-2 text-indigo-100">Configure corporate workspace values and system behavior.</p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Settings2 size={28} />
          </div>
        </div>
      </div>

      {/* Company Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Company Profile</h2>
            <p className="text-sm text-slate-400 font-medium">Configure corporate identity details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
            <input
              type="text"
              value={settings.companySettings.companyName}
              onChange={(e) => handleCompanyChange("companyName", e.target.value)}
              placeholder="AMDOX ERP"
              className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Email</label>
            <input
              type="email"
              value={settings.companySettings.email}
              onChange={(e) => handleCompanyChange("email", e.target.value)}
              placeholder="info@amdoxerp.com"
              className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={settings.companySettings.phone}
              onChange={(e) => handleCompanyChange("phone", e.target.value)}
              placeholder="+91 9876543210"
              className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Website URL</label>
            <input
              type="text"
              value={settings.companySettings.website}
              onChange={(e) => handleCompanyChange("website", e.target.value)}
              placeholder="www.amdoxerp.com"
              className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
            <textarea
              rows={3}
              value={settings.companySettings.address}
              onChange={(e) => handleCompanyChange("address", e.target.value)}
              placeholder="Corporate headquarters address..."
              className="w-full rounded-2xl border border-slate-300 p-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50 resize-none"
            />
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">System Preferences</h2>
            <p className="text-sm text-slate-400 font-medium">Control workspace flags.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Maintenance Mode</h3>
              <p className="text-xs text-slate-400">Lock the workspace platform temporarily.</p>
            </div>
            <button
              onClick={() => handleToggle("maintenanceMode")}
              className={`relative h-7 w-12 rounded-full transition-colors ${settings.systemSettings.maintenanceMode ? "bg-rose-500" : "bg-slate-300"}`}
            >
              <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${settings.systemSettings.maintenanceMode ? "left-6" : "left-1"}`} />
            </button>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Email Notifications</h3>
              <p className="text-xs text-slate-400">Enable default background system mails.</p>
            </div>
            <button
              onClick={() => handleToggle("emailNotifications")}
              className={`relative h-7 w-12 rounded-full transition-colors ${settings.systemSettings.emailNotifications ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${settings.systemSettings.emailNotifications ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Save Trigger */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}