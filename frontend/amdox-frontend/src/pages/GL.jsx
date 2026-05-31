import { useEffect, useState, useMemo } from "react";
import { 
  BookOpen, RefreshCw, Loader2, ArrowUpRight, ArrowDownLeft, 
  ShieldCheck, Plus, Trash2, Lock, Unlock, DollarSign, Euro 
} from "lucide-react";
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

  const [fxRates] = useState({ USD: 83.45, EUR: 89.60 });

  const [accounts, setAccounts] = useState([
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

  const addLine = () => {
    setEntryLines([...entryLines, { accountCode: "1010", debit: "", credit: "" }]);
  };

  const removeLine = (index) => {
    if (entryLines.length <= 2) return;
    setEntryLines(entryLines.filter((_, idx) => idx !== index));
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black">👑 General Ledger Control Room</h1>
        <p className="text-slate-400 text-sm mt-1">Manage Chart of accounts, balance ledgers, and override period lock values.</p>
      </div>

      <div className="flex border-b text-sm">
        <button onClick={() => setActiveTab("ledger")} className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === "ledger" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>Post Journal</button>
        <button onClick={() => setActiveTab("coa")} className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === "coa" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>Chart of Accounts</button>
        <button onClick={() => setActiveTab("period-close")} className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === "period-close" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>Period Closing</button>
      </div>

      {activeTab === "ledger" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl border p-6 shadow-sm space-y-6">
            <form onSubmit={handlePostJournalEntry} className="space-y-4">
              <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Monthly Rent Expense Adjustment" className="w-full h-11 border rounded-xl px-4 text-xs" />
              {entryLines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2">
                  <select value={line.accountCode} onChange={(e) => handleLineChange(idx, "accountCode", e.target.value)} className="col-span-6 h-10 border rounded-xl px-2 text-xs">
                    {accounts.map(acc => <option key={acc.code} value={acc.code}>{acc.name}</option>)}
                  </select>
                  <input type="number" placeholder="Debit" value={line.debit} onChange={(e) => handleLineChange(idx, "debit", e.target.value)} className="col-span-3 h-10 border rounded-xl text-xs text-right" />
                  <input type="number" placeholder="Credit" value={line.credit} onChange={(e) => handleLineChange(idx, "credit", e.target.value)} className="col-span-3 h-10 border rounded-xl text-xs text-right" />
                </div>
              ))}
              <div className="p-4 bg-slate-50 border rounded-2xl text-xs flex justify-between font-bold">
                <span>Debit Total: ₹{totals.totalDebit}</span>
                <span>Credit Total: ₹{totals.totalCredit}</span>
              </div>
              <button type="submit" disabled={saving || !totals.isBalanced} className="w-full h-11 bg-indigo-600 text-white rounded-xl font-bold text-xs disabled:opacity-50">Post Transaction</button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-white border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Ledger Entries Log</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries.map(e => (
                <div key={e._id} className="p-3 bg-slate-50 border rounded-xl text-xs">
                  <h4 className="font-bold">{e.description}</h4>
                  {e.entries?.map((line, i) => (
                    <p key={i} className="text-[10px] text-slate-500">{line.account}: {line.debit > 0 ? `Db: ₹${line.debit}` : `Cr: ₹${line.credit}`}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "coa" && (
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <table className="w-full text-xs text-slate-600">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Account Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.code} className="border-b">
                  <td className="p-3 font-bold text-indigo-600">{acc.code}</td>
                  <td className="p-3 font-bold">{acc.name}</td>
                  <td className="p-3">{acc.type}</td>
                  <td className="p-3 text-right font-black">₹{acc.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "period-close" && (
        <div className="bg-white border rounded-3xl p-8 max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-lg font-bold">Lock Workspace Financial Ledger</h2>
          <div className="p-6 bg-slate-50 rounded-2xl border flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">Period Closing Lock:</span>
            {isAdminOrFinance && (
              <button onClick={togglePeriodLock} className={`h-10 px-5 rounded-xl font-bold text-xs text-white ${isPeriodLocked ? "bg-rose-600" : "bg-emerald-600"}`}>
                {isPeriodLocked ? "Unlock Period" : "Lock Period"}
              </button>
            )}
          </div>
          {isPeriodLocked && (
            <div className="flex justify-between items-center p-4 bg-slate-50 border rounded-2xl">
              <span className="text-xs font-bold">Override Status:</span>
              <button onClick={() => setOverrideActive(!overrideActive)} className={`relative h-6 w-11 rounded-full transition-colors ${overrideActive ? "bg-rose-500" : "bg-slate-300"}`}>
                <div className={`h-5 w-5 bg-white rounded-full transition-all ${overrideActive ? "translate-x-5" : ""}`} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}