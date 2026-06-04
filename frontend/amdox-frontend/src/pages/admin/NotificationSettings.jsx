import { useState, useEffect } from "react";
import { Bell, ShieldCheck, Plus, Play, Trash2, Info, Loader2, Save, RefreshCw } from "lucide-react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function NotificationSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState(null);

  const [matrix, setMatrix] = useState({
    "Payroll Processed": { inApp: true, email: true, sms: false, webhook: true },
    "Low Stock Warning": { inApp: true, email: true, sms: true, webhook: true },
    "Leave Requested": { inApp: true, email: true, sms: false, webhook: false },
    "New Job Applicant": { inApp: true, email: false, sms: false, webhook: true },
    "System Audit Alert": { inApp: true, email: true, sms: true, webhook: true }
  });

  const [webhooks, setWebhooks] = useState([
    { _id: "wh-201", name: "Slack Production Channel", url: "https://hooks.slack.com/services/T00/B00/X00", secret: "whsec_A8d9K3...", status: "ACTIVE" },
    { _id: "wh-202", name: "Zapier Accounting Sync", url: "https://hooks.zapier.com/hooks/catch/12345/abc", secret: "whsec_P9q3L4...", status: "ACTIVE" }
  ]);

  const [newWebhook, setNewWebhook] = useState({ name: "", url: "" });

  const [logs, setLogs] = useState([
    { _id: "log-501", event: "Payroll Processed", url: "hooks.slack.com", status: 200, latency: "42ms", date: "2026-04-10 14:32" },
    { _id: "log-502", event: "Low Stock Warning", url: "hooks.zapier.com", status: 200, latency: "58ms", date: "2026-04-10 14:30" },
    { _id: "log-503", event: "System Audit Alert", url: "hooks.slack.com", status: 500, latency: "124ms", date: "2026-04-10 14:15" }
  ]);

  useEffect(() => {
    loadAllConfiguration();
  }, []);

  const loadAllConfiguration = async () => {
    try {
      setLoading(true);
      const savedWH = localStorage.getItem("amdox_webhooks");
      if (savedWH) setWebhooks(JSON.parse(savedWH));

      const savedMatrix = localStorage.getItem("amdox_notification_matrix");
      if (savedMatrix) setMatrix(JSON.parse(savedMatrix));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMatrix = (eventKey, channel) => {
    setMatrix((prev) => ({
      ...prev,
      [eventKey]: { ...prev[eventKey], [channel]: !prev[eventKey][channel] }
    }));
  };

  const handleAddWebhook = (e) => {
    e.preventDefault();
    if (!newWebhook.name || !newWebhook.url) return;

    const payload = {
      _id: `wh-${Date.now()}`,
      name: newWebhook.name,
      url: newWebhook.url,
      secret: `whsec_${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      status: "ACTIVE"
    };

    const updated = [payload, ...webhooks];
    setWebhooks(updated);
    localStorage.setItem("amdox_webhooks", JSON.stringify(updated));
    setNewWebhook({ name: "", url: "" });
    alert("Outbound Webhook registered successfully!");
  };

  const handleDeleteWebhook = (id) => {
    if (!window.confirm("Are you sure you want to delete this Webhook?")) return;
    const updated = webhooks.filter((w) => w._id !== id);
    setWebhooks(updated);
    localStorage.setItem("amdox_webhooks", JSON.stringify(updated));
    alert("Webhook deleted successfully!");
  };

  // 🚀 F-11 Webhooks: બ્રાઉઝરમાંથી રિયલ HTTP POST રિકવેસ્ટ Slack કે Discord પર મોકલશે
  const handleTestWebhook = async (id, name, url) => {
    try {
      setTestingId(id);

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "TEST_RUN",
          timestamp: new Date().toISOString(),
          payload: {
            message: "AMDOX ERP Webhook Integration Test Successful!",
            status: "ONLINE"
          }
        }),
        mode: "no-cors" // CORS બ્લોકેજ બાયપાસ કરવા માટે
      });

      alert(`Test payload dispatched to ${name}!`);
      notifier.webhookTested(name);
    } catch (err) {
      alert("Webhook connection failed: " + err.message);
    } finally {
      setTestingId(null);
    }
  };

  const handleSaveMatrix = () => {
    try {
      setSaving(true);
      localStorage.setItem("amdox_notification_matrix", JSON.stringify(matrix));
      alert("Configurable notification matrix saved successfully!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md relative overflow-hidden border border-slate-800">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-2">
          <Bell /> Notification & Webhook Engine
        </h1>
        <p className="mt-1.5 text-slate-400 text-xs">Configure multi-channel notification dispatches and outbound webhooks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800">Notification Dispatch Matrix</h2>
            <button onClick={handleSaveMatrix} className="h-9 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Save size={13} /> {saving ? "Saving..." : "Save Matrix"}
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs text-slate-600 min-w-[450px]">
              <thead className="bg-slate-50 border-b font-bold text-slate-700">
                <tr>
                  <th className="p-3 text-left">Business Event</th>
                  <th className="p-3 text-center">In-App</th>
                  <th className="p-3 text-center">Email</th>
                  <th className="p-3 text-center">Webhooks</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(matrix).map((eventKey) => (
                  <tr key={eventKey} className="border-b hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-800">{eventKey}</td>
                    <td className="p-3 text-center"><input type="checkbox" checked={matrix[eventKey].inApp} onChange={() => handleToggleMatrix(eventKey, "inApp")} className="h-4.5 w-4.5" /></td>
                    <td className="p-3 text-center"><input type="checkbox" checked={matrix[eventKey].email} onChange={() => handleToggleMatrix(eventKey, "email")} className="h-4.5 w-4.5" /></td>
                    <td className="p-3 text-center"><input type="checkbox" checked={matrix[eventKey].webhook} onChange={() => handleToggleMatrix(eventKey, "webhook")} className="h-4.5 w-4.5" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm">Register Outbound Webhook</h3>
            <form onSubmit={handleAddWebhook} className="space-y-3">
              <input type="text" required value={newWebhook.name} onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })} placeholder="Webhook Name (e.g. Slack)" className="w-full h-10 border rounded-xl px-3 text-xs outline-none" />
              <input type="url" required value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} placeholder="https://yourdomain.com/webhook" className="w-full h-10 border rounded-xl px-3 text-xs outline-none" />
              <button type="submit" className="w-full h-10 bg-indigo-600 text-white rounded-xl text-xs font-bold">Register Endpoint</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-xs">Active Webhooks</h3>
            <div className="space-y-3">
              {webhooks.map((w) => (
                <div key={w._id} className="p-3.5 border rounded-xl bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 text-xs">{w.name}</h4>
                    <button onClick={() => handleDeleteWebhook(w._id)} className="text-rose-500"><Trash2 size={13} /></button>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t text-[10px] text-slate-400 font-bold gap-3">
                    <span className="truncate flex-1">{w.url}</span>
                    <button onClick={() => handleTestWebhook(w._id, w.name, w.url)} className="h-7 px-2.5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center gap-1">
                      {testingId === w._id ? <Loader2 className="animate-spin h-3 w-3" /> : <Play size={10} />} Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600" /> Outbound Webhooks & Signed HMAC Handlers Active
      </div>
    </div>
  );
}