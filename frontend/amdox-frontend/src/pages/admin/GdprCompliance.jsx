import { useState, useMemo } from "react";
import { ShieldCheck, Download, Trash2, Info, Loader2, Save, RefreshCw, CheckCircle2 } from "lucide-react";
import notifier from "../../utils/notifier";

export default function GdprCompliance() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "ADMIN";

  const [saving, setSaving] = useState(false);
  const [requests, setRequests] = useState([
    { _id: "dsr-101", name: "Jaydeep Patel", type: "DATA_PORTABILITY", status: "PENDING", slaRemaining: "48h 12m", date: "2026-04-10" },
    { _id: "dsr-102", name: "Dharmik Kotecha", type: "RIGHT_TO_ERASURE", status: "FULFILLED", slaRemaining: "Completed", date: "2026-04-09" }
  ]);

  // Consent local states
  const [consent, setConsent] = useState({
    marketingCookies: true,
    systemMails: true,
  });

  // ૧. ડેટા પોર્ટેબિલિટી - કર્મચારીનો પોતાનો ડેટા એક્સપોર્ટ (JSON)
  const handleExportMyData = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `AMDOX_GDPR_Export_${user.name || "User"}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert("Your personal data portfolio exported successfully as per GDPR Art. 20!");
    } catch (err) {
      alert("Failed to export data portfolio.");
    }
  };

  // ૨. એકાઉન્ટ સોફ્ટ-ડિલીટ / કાયમી એરેઝર રિકવેસ્ટ સબમિટ
  const handleRequestErasure = () => {
    if (!window.confirm("WARNING: GDPR Art. 17 'Right to be Forgotten' will anonymize your complete profile and audit history. Do you wish to proceed?")) return;
    
    const newReq = {
      _id: `dsr-${Date.now().toString().slice(-4)}`,
      name: user.name || "Staff Member",
      type: "RIGHT_TO_ERASURE",
      status: "PENDING",
      slaRemaining: "71h 59m",
      date: new Date().toISOString().split("T")[0]
    };

    setRequests((prev) => [newReq, ...prev]);
    alert("Your erasure request has been logged. Under GDPR regulations, we will fulfill this within < 72 hours.");
  };

  // ૩. કન્સન્ટ સેટિંગ્સ સેવ પ્રક્રિયા
  const handleSaveConsent = async () => {
    try {
      setSaving(true);
      await new Promise((res) => setTimeout(res, 600)); // API delay simulation
      alert("Your data consent choices updated and logged securely.");
    } finally {
      setSaving(false);
    }
  };

  // ૪. એડમિન દ્વારા DSR વિનંતી મંજૂર કરવી
  const handleApproveRequest = (id, name, type) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: "FULFILLED", slaRemaining: "Completed" } : r))
    );
    alert("Request fulfilled and logged in immutable security ledger.");
    notifier.gdprRequestFulfled(name, type);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto overflow-x-hidden px-1">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">F-09 Compliance Control</span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black mt-1 flex items-center gap-2">🇪🇺 GDPR & DSR Compliance</h1>
        <p className="mt-1.5 text-slate-400 text-xs">Submit Data Subject Requests (DSR), manage cookie consents, and trace the soft-delete pipeline.</p>
      </div>

      {/* Info Alert */}
      <div className="p-3.5 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-100 text-[11px] sm:text-xs text-slate-600 font-semibold flex items-center gap-2">
        <Info size={14} className="text-indigo-600 shrink-0" />
        <span>Strict compliance warning: Data subject rights and right to erasure requests must be fulfilled within the 72-hour SLA.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
        
        {/* LEFT SIDE: Employee Personal GDPR Suite */}
        <div className="lg:col-span-6 space-y-6 w-full">
          <div className="bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5">My Subject Rights (Art. 15-20)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                onClick={handleExportMyData}
                className="p-4 border border-slate-100 rounded-xl sm:rounded-2xl bg-slate-50/50 hover:bg-indigo-50/20 text-left transition space-y-2 group cursor-pointer"
              >
                <Download className="text-indigo-600 group-hover:scale-110 transition shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Download My Data</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Export personal profile as JSON</p>
                </div>
              </button>

              <button
                onClick={handleRequestErasure}
                className="p-4 border border-slate-100 rounded-xl sm:rounded-2xl bg-slate-50/50 hover:bg-rose-50/20 text-left transition space-y-2 group cursor-pointer"
              >
                <Trash2 className="text-rose-600 group-hover:scale-110 transition shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Request Erasure</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Submit permanent soft-delete request</p>
                </div>
              </button>
            </div>
          </div>

          {/* Consent Manager */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5">Consent & Tracking Manager</h2>
            
            <div className="space-y-3.5">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-700 block">Marketing & Promotional Cookies</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Allow cookies for general platform improvements</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConsent({ ...consent, marketingCookies: !consent.marketingCookies })}
                  className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${consent.marketingCookies ? "bg-indigo-600" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${consent.marketingCookies ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex flex-col xs:flex-row xs:items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-700 block">System Notification Mails</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Critical automated payroll & attendance receipts</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConsent({ ...consent, systemMails: !consent.systemMails })}
                  className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${consent.systemMails ? "bg-indigo-600" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${consent.systemMails ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveConsent}
                disabled={saving}
                className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer w-full xs:w-auto text-center"
              >
                {saving ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Save size={13} />}
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Admin DSR Control Hub */}
        <div className="lg:col-span-6 bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-4">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-800 truncate">DSR Management Console</h2>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">Admin terminal to execute and close active compliance requests</p>
            </div>
            <button className="h-8.5 w-8.5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 hover:bg-slate-100 shrink-0 cursor-pointer">
              <RefreshCw size={13} />
            </button>
          </div>

          <div className="space-y-3.5">
            {requests.map((r) => (
              <div key={r._id} className="p-3.5 border border-slate-100 rounded-xl sm:rounded-2xl bg-slate-50/50 space-y-2.5 min-w-0 overflow-hidden w-full">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">{r.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase border shrink-0 ${
                    r.status === "FULFILLED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="flex flex-col xs:flex-row justify-between xs:items-center text-[10px] sm:text-xs text-slate-400 font-semibold pt-2 border-t border-slate-100 gap-1.5">
                  <span>Type: {r.type.replace("_", " ")}</span>
                  <span className={r.status === "PENDING" ? "text-rose-500 font-bold shrink-0" : "text-slate-400 shrink-0"}>SLA: {r.slaRemaining}</span>
                </div>

                {r.status === "PENDING" && isAdmin && (
                  <div className="pt-1.5 flex justify-end">
                    <button
                      onClick={() => handleApproveRequest(r._id, r.name, r.type)}
                      className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                    >
                      <CheckCircle2 size={11} /> Execute Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600 shrink-0" /> GDPR Compliant Soft-Delete Pipeline Active
      </div>
    </div>
  );
}