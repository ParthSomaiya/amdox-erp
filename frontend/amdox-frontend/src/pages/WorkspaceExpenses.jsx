import { useEffect, useState, useMemo } from "react";
import { DollarSign, Plus, FileText, CheckCircle2, XCircle, Loader2, Wallet, ArrowUpRight, TrendingUp, Percent, PieChart as PieIcon, RefreshCw, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import API from "../services/api";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#f43f5e"];

export default function TeamChat() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [form, setForm] = useState({
    merchant: "",
    category: "SaaS / Software",
    amount: "",
    description: ""
  });

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return { name: "Dharmik Kotecha", role: "EMPLOYEE", _id: "emp-101" };
    }
  }, []);

  const isAdminOrFinance = user?.role === "ADMIN" || user?.role === "FINANCE";

  useEffect(() => {
    fetchExpenseClaims();
  }, []);

  // 🔄 રીઅલ-ટાઇમ એક્સપેન્સ સિંક્રોનાઇઝર
  const fetchExpenseClaims = async () => {
    try {
      setLoading(true);
      const res = await API.get("/finance/expense").catch(() => null);
      if (res?.data) {
        setClaims(res.data);
      } else {
        loadFallbackClaims();
      }
    } catch (err) {
      loadFallbackClaims();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackClaims = () => {
    const saved = localStorage.getItem("amdox_expense_claims");
    if (saved) {
      setClaims(JSON.parse(saved));
    } else {
      // પ્રારંભિક સીડ ડેટા (પરીક્ષણ માટે)
      const defaultClaims = [
        { _id: "c-101", employeeName: "Parth Somaiya", merchant: "AWS Cloud Infrastructure", category: "SaaS / Software", amount: 15000, description: "Monthly cloud billing node cost", status: "PENDING" },
        { _id: "c-102", employeeName: "Jaydeep Patel", merchant: "GitHub Enterprise Suite", category: "SaaS / Software", amount: 4800, description: "Agile taskboards licenses", status: "APPROVED" },
        { _id: "c-103", employeeName: "Dharmik Kotecha", merchant: "Uber Business Travel", category: "Travel / Transport", amount: 1200, description: "Client onsite visit travel fare", status: "REJECTED" }
      ];
      localStorage.setItem("amdox_expense_claims", JSON.stringify(defaultClaims));
      setClaims(defaultClaims);
    }
  };

  const saveToLocalRegistry = (updatedList) => {
    localStorage.setItem("amdox_expense_claims", JSON.stringify(updatedList));
    setClaims(updatedList);
  };

  // ૧. કર્મચારી દ્વારા નવો ખર્ચ ક્લેઇમ ફાઇલ કરવો
  const handleFileClaim = async (e) => {
    e.preventDefault();
    if (!form.merchant || !form.amount) return;

    try {
      setSubmitting(true);
      const newClaim = {
        _id: `claim-${Date.now()}`,
        employeeName: user.name || "Dharmik Kotecha",
        merchant: form.merchant,
        category: form.category,
        amount: Number(form.amount),
        description: form.description || "General business operation expense",
        status: "PENDING"
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      const updated = [newClaim, ...claims];
      saveToLocalRegistry(updated);

      // લાઈવ સિસ્ટમ સિક્યોરિટી અને ફાઈનાન્સ નોટિફિકેશન ટ્રિગર
      window.triggerAmdoxNotification?.(
        "Expense Claim Filed",
        `New reimbursement request of ₹${newClaim.amount.toLocaleString()} filed for ${newClaim.merchant} by ${newClaim.employeeName}.`,
        "FINANCE"
      );

      alert("Reimbursement claim submitted to Finance Audit Desk!");
      setForm({ merchant: "", category: "SaaS / Software", amount: "", description: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ૨. એડમિન/ફાઇનાન્સ ઓડિટર દ્વારા સ્ટેટસ અપડેટ કરવું (Approve / Reject)
  const handleUpdateStatus = async (id, status) => {
    try {
      setActionId(id);
      await new Promise(resolve => setTimeout(resolve, 400));

      const updated = claims.map(c => c._id === id ? { ...c, status } : c);
      saveToLocalRegistry(updated);

      const targetClaim = claims.find(c => c._id === id);
      window.triggerAmdoxNotification?.(
        "Expense Claim Resolved",
        `Claim of ₹${targetClaim?.amount?.toLocaleString()} for ${targetClaim?.merchant} has been ${status.toLowerCase()}.`,
        "FINANCE"
      );

      alert(`Claim status updated to ${status}!`);
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  // 🧠 ડાયનેમિક કેલ્ક્યુલેટેડ ફિલ્ટર્સ (કર્મચારીને માત્ર પોતાના જ ક્લેઇમ દેખાશે)
  const visibleClaims = useMemo(() => {
    if (isAdminOrFinance) return claims; // એડમિન બધા જ જોઈ શકે
    return claims.filter(c => c.employeeName === user.name); // કર્મચારી માત્ર પોતાના જ જોઈ શકે
  }, [claims, user, isAdminOrFinance]);

  // 📊 એનાલિટિક્સ ચાર્ટ અને KPIs કેલ્ક્યુલેશન્સ
  const stats = useMemo(() => {
    let approvedTotal = 0;
    let pendingTotal = 0;
    const categoryTotals = {};

    visibleClaims.forEach(c => {
      if (c.status === "APPROVED") {
        approvedTotal += c.amount;
        categoryTotals[c.category] = (categoryTotals[c.category] || 0) + c.amount;
      } else if (c.status === "PENDING") {
        pendingTotal += c.amount;
      }
    });

    const chart = Object.keys(categoryTotals).map(cat => ({
      name: cat,
      value: categoryTotals[cat]
    }));

    return { approvedTotal, pendingTotal, chart };
  }, [visibleClaims]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "REJECTED": return "bg-rose-50 text-rose-700 border border-rose-100";
      default: return "bg-amber-50 text-amber-700 border border-amber-100";
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-2">Financial Control Hub</span>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Wallet className="text-indigo-400" /> Expense Reimbursements
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-xl">File business cost claims, upload invoices, and manage finance audits dynamically.</p>
      </div>

      {/* KPI Cards Grid - Automatically Syncs and Updates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Reimbursed Amount</span>
            <h2 className="text-2xl font-black text-emerald-600 mt-2">₹{stats.approvedTotal.toLocaleString("en-IN")}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Pending Audit Pool</span>
            <h2 className="text-2xl font-black text-amber-500 mt-2">₹{stats.pendingTotal.toLocaleString("en-IN")}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">My Total Claims</span>
            <h2 className="text-2xl font-black text-slate-800 mt-2">{visibleClaims.length} Vouchers</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText size={22} />
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Submit Claim Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border rounded-[30px] p-6 shadow-sm space-y-5">
            <div className="pb-4 border-b">
              <h3 className="font-extrabold text-slate-800 text-sm">File Business Expense Claim</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Submit transaction voucher for audit review</p>
            </div>

            <form onSubmit={handleFileClaim} className="space-y-4 text-xs font-semibold text-slate-600">
              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Merchant / Vendor</label>
                <input
                  type="text"
                  required
                  value={form.merchant}
                  onChange={(e) => setForm({ ...form, merchant: e.target.value })}
                  placeholder="e.g. AWS Cloud / Uber"
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 uppercase tracking-wider">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase tracking-wider">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-11 border rounded-xl px-3 bg-slate-50/50 outline-none text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="SaaS / Software">SaaS / Software</option>
                    <option value="Travel / Transport">Travel / Transport</option>
                    <option value="Hardware / Asset">Hardware / Asset</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Expense Reason / Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Specify project context..."
                  className="w-full rounded-xl border p-4 text-xs font-medium bg-slate-50/50 outline-none resize-none focus:border-indigo-500 focus:bg-white text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus size={14} />}
                Submit Expense Claim
              </button>
            </form>
          </div>

          {/* Dynamic Recharts Category Distribution Card */}
          <div className="bg-white border rounded-[30px] p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Approved Category Share</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Allocation breakdown of reimbursed vouchers</p>
            </div>

            <div className="h-64 flex items-center justify-center">
              {stats.chart.length === 0 ? (
                <p className="text-xs text-slate-400">No approved data compiled for allocation chart.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.chart}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      paddingAngle={4}
                    >
                      {stats.chart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Audit Desk Feed */}
        <div className="lg:col-span-7 bg-white border rounded-[30px] p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Expense Audit Desk</h3>
              <p className="text-xs text-slate-400 mt-0.5">All corporate cost claims pending/processed</p>
            </div>
            <button onClick={fetchExpenseClaims} className="text-slate-400 hover:text-slate-600">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-10 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
            ) : visibleClaims.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">No reimbursement claims filed.</p>
            ) : (
              visibleClaims.map((c) => (
                <div key={c._id} className="p-4 bg-slate-50 border rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">{c.merchant}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Filed By: {c.employeeName}</p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-normal">{c.description}</p>

                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-black text-indigo-600">₹{c.amount?.toLocaleString("en-IN")}</span>
                    
                    {/* Admin/Finance Approval triggers */}
                    {c.status === "PENDING" && isAdminOrFinance ? (
                      <div className="flex gap-2">
                        <button
                          disabled={actionId === c._id}
                          onClick={() => handleUpdateStatus(c._id, "APPROVED")}
                          className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1"
                        >
                          Approve
                        </button>
                        <button
                          disabled={actionId === c._id}
                          onClick={() => handleUpdateStatus(c._id, "REJECTED")}
                          className="h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] flex items-center gap-1"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Audit Completed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> Persistent Enterprise Budget & Cost Control Ledger Active
      </div>
    </div>
  );
}