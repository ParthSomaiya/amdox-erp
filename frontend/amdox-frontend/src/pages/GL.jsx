import { useEffect, useState, useMemo } from "react";
import { BookOpen, RefreshCw, Loader2, ArrowUpRight, ArrowDownLeft, ShieldCheck, Plus, Trash2, Lock, Unlock } from "lucide-react";
import API from "../services/api";

export default function GL() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdminOrFinance = user.role === "ADMIN" || user.role === "FINANCE";

  const [activeTab, setActiveTab] = useState("ledger");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isPeriodLocked, setIsPeriodLocked] = useState(false);
  const [overrideActive, setOverrideActive] = useState(false);

  const [accounts] = useState([
    { code: "1010", name: "Cash & Cash Equivalents", type: "ASSET", balance: 150000 },
    { code: "1200", name: "Accounts Receivable", type: "ASSET", balance: 45000 },
    { code: "2010", name: "Accounts Payable", type: "LIABILITY", balance: 32000 },
    { code: "3010", name: "Retained Earnings", type: "EQUITY", balance: 100000 },
    { code: "4010", name: "Sales Revenue", type: "REVENUE", balance: 120000 },
    { code: "5010", name: "Office Expenses", type: "EXPENSE", balance: 1500 }
  ]);

  const [description, setDescription] = useState("");
  const [entryLines, setEntryLines] = useState([
    { accountCode: "1010", debit: "", credit: "" },
    { accountCode: "4010", debit: "", credit: "" }
  ]);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const res = await API.get("/gl");
      setEntries(res.data || []);
    } catch (err) {
      const savedGL = localStorage.getItem("amdox_simulated_gl");
      if (savedGL) setEntries(JSON.parse(savedGL));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
    const lockedState = localStorage.getItem("amdox_period_locked");
    if (lockedState) setIsPeriodLocked(JSON.parse(lockedState));
  }, []);

  const totals = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;
    entryLines.forEach(line => {
      totalDebit += Number(line.debit || 0);
      totalCredit += Number(line.credit || 0);
    });
    return {
      totalDebit: Number(totalDebit.toFixed(2)),
      totalCredit: Number(totalCredit.toFixed(2)),
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0
    };
  }, [entryLines]);

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...entryLines];
    updatedLines[index][field] = value;
    if (field === "debit" && value > 0) updatedLines[index]["credit"] = "";
    if (field === "credit" && value > 0) updatedLines[index]["debit"] = "";
    setEntryLines(updatedLines);
  };

  const handlePostJournalEntry = async (e) => {
    e.preventDefault();
    if (!totals.isBalanced) return;

    if (isPeriodLocked && !overrideActive) {
      alert("Period Close Lock is active. Adjustment cannot be recorded.");
      return;
    }

    try {
      setSaving(true);
      const newEntryPayload = {
        description,
        createdAt: new Date().toISOString(),
        entries: entryLines.map(line => {
          const matchedAcc = accounts.find(a => a.code === line.accountCode);
          return {
            account: matchedAcc?.name || "Suspense",
            debit: Number(line.debit || 0),
            credit: Number(line.credit || 0)
          };
        })
      };

      await API.post("/gl", newEntryPayload).catch(() => {
        const existingGL = JSON.parse(localStorage.getItem("amdox_simulated_gl") || "[]");
        const updatedGL = [{ ...newEntryPayload, _id: `sim-${Date.now()}` }, ...existingGL];
        localStorage.setItem("amdox_simulated_gl", JSON.stringify(updatedGL));
        setEntries(updatedGL);
      });

      window.triggerAmdoxNotification?.(
        "Journal Entry Posted", 
        `Double-entry adjustment recognized for: ${description}`, 
        "FINANCE"
      );

      alert("Journal Entry posted successfully!");
      setDescription("");
      setEntryLines([
        { accountCode: "1010", debit: "", credit: "" },
        { accountCode: "4010", debit: "", credit: "" }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const togglePeriodLock = () => {
    const nextState = !isPeriodLocked;
    setIsPeriodLocked(nextState);
    localStorage.setItem("amdox_period_locked", JSON.stringify(nextState));
    if (!nextState) setOverrideActive(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto overflow-x-hidden px-1">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black">👑 General Ledger Control Room</h1>
        <p className="text-slate-400 text-xs mt-1.5">Manage Chart of accounts, balance ledgers, and override period lock values.</p>
      </div>

      {/* 🔹 રાયપ્રેસિવ હોરિઝોન્ટલ સ્ક્રોલેબલ ટેબ્સ */}
      <div className="flex border-b text-xs sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-none w-full border-slate-200">
        <button onClick={() => setActiveTab("ledger")} className={`px-4 sm:px-6 py-2.5 sm:py-3 font-bold border-b-2 transition shrink-0 ${activeTab === "ledger" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>Post Journal</button>
        <button onClick={() => setActiveTab("coa")} className={`px-4 sm:px-6 py-2.5 sm:py-3 font-bold border-b-2 transition shrink-0 ${activeTab === "coa" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>Chart of Accounts</button>
        <button onClick={() => setActiveTab("period-close")} className={`px-4 sm:px-6 py-2.5 sm:py-3 font-bold border-b-2 transition shrink-0 ${activeTab === "period-close" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>Period Closing</button>
      </div>

      {activeTab === "ledger" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
          {/* Post Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full">
            <form onSubmit={handlePostJournalEntry} className="space-y-4">
              <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Monthly Rent Expense Adjustment" className="w-full h-11 border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 outline-none focus:border-indigo-500 focus:bg-white text-xs" />
              
              <div className="space-y-2.5">
                {entryLines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-1.5 sm:gap-2 items-center w-full min-w-0">
                    <select value={line.accountCode} onChange={(e) => handleLineChange(idx, "accountCode", e.target.value)} className="col-span-6 h-9 sm:h-10 border border-slate-200 bg-white rounded-xl px-2 text-[11px] sm:text-xs">
                      {accounts.map(acc => <option key={acc.code} value={acc.code}>{acc.name}</option>)}
                    </select>
                    <input type="number" placeholder="Debit" value={line.debit} onChange={(e) => handleLineChange(idx, "debit", e.target.value)} className="col-span-3 h-9 sm:h-10 border border-slate-200 bg-slate-50/50 rounded-xl text-[11px] sm:text-xs text-right px-1.5" />
                    <input type="number" placeholder="Credit" value={line.credit} onChange={(e) => handleLineChange(idx, "credit", e.target.value)} className="col-span-3 h-9 sm:h-10 border border-slate-200 bg-slate-50/50 rounded-xl text-[11px] sm:text-xs text-right px-1.5" />
                  </div>
                ))}
              </div>

              <div className="p-3 sm:p-4 bg-slate-50 border rounded-xl text-xs flex justify-between font-bold text-slate-700">
                <span>Debit Total: ₹{totals.totalDebit}</span>
                <span>Credit Total: ₹{totals.totalCredit}</span>
              </div>
              <button type="submit" disabled={saving || !totals.isBalanced} className="w-full h-10 sm:h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs disabled:opacity-50 transition cursor-pointer">Post Transaction</button>
            </form>
          </div>

          {/* Logs Panel */}
          <div className="lg:col-span-5 bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 w-full max-w-full overflow-hidden">
            <h3 className="font-bold text-slate-800 text-sm">Ledger Entries Log</h3>
            <div className="space-y-3 max-h-[300px] sm:max-h-96 overflow-y-auto pr-0.5">
              {entries.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">No journal logs recorded.</p>
              ) : (
                entries.map(e => (
                  <div key={e._id} className="p-3 bg-slate-50 border rounded-xl text-xs space-y-1">
                    <h4 className="font-bold text-slate-800">{e.description}</h4>
                    {e.entries?.map((line, i) => (
                      <p key={i} className="text-[10px] text-slate-500 font-medium">
                        {line.account}: {line.debit > 0 ? `Db: ₹${line.debit}` : `Cr: ₹${line.credit}`}
                      </p>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "coa" && (
        // 🔹 ટેબલ હોરિઝોન્ટલ સ્ક્રોલ ગાર્ડ
        <div className="bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden w-full max-w-full">
          <div className="w-full overflow-x-auto scrollbar-none">
            <table className="w-full text-xs text-slate-600 min-w-[520px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Account Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-indigo-600">{acc.code}</td>
                    <td className="p-3 font-bold text-slate-800">{acc.name}</td>
                    <td className="p-3 font-semibold text-slate-500">{acc.type}</td>
                    <td className="p-3 text-right font-black text-slate-800">₹{acc.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "period-close" && (
        <div className="bg-white border rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-xl mx-auto text-center space-y-4 w-full">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Lock Workspace Financial Ledger</h2>
          <div className="p-4 sm:p-5 bg-slate-50 rounded-xl sm:rounded-2xl border flex justify-between items-center gap-4">
            <span className="text-xs font-bold text-slate-700">Period Closing Lock:</span>
            {isAdminOrFinance && (
              <button onClick={togglePeriodLock} className={`h-9 px-4 rounded-xl font-bold text-xs text-white cursor-pointer ${isPeriodLocked ? "bg-rose-600" : "bg-emerald-600"}`}>
                {isPeriodLocked ? "Unlock Period" : "Lock Period"}
              </button>
            )}
          </div>
          {isPeriodLocked && (
            <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 border rounded-xl sm:rounded-2xl">
              <span className="text-xs font-bold text-slate-700">Override Status:</span>
              <button onClick={() => setOverrideActive(!overrideActive)} className={`relative h-6 w-11 rounded-full transition-colors ${overrideActive ? "bg-rose-500" : "bg-slate-300"}`}>
                <div className={`h-5 w-5 bg-white rounded-full transition-all ${overrideActive ? "translate-x-5" : ""}`} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600 shrink-0" /> SaaS Multi-Tenant Ledger Compliance Engine Active
      </div>
    </div>
  );
}