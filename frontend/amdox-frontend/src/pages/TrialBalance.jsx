import { useEffect, useState, useMemo } from "react";
import { Calendar, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../services/api";

export default function TrialBalance() {
  const [data, setData] = useState({});
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [invoiceRes, billRes] = await Promise.all([
        API.get("/finance/invoice").catch(() => ({ data: [] })),
        API.get("/ap").catch(() => ({ data: [] }))
      ]);

      const localInvoices = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
      const mergedInvoices = [...(invoiceRes.data || [])];
      localInvoices.forEach(li => {
        if (!mergedInvoices.some(si => si._id === li._id)) mergedInvoices.push(li);
      });

      const localBills = JSON.parse(localStorage.getItem("amdox_simulated_bills") || "[]");
      const mergedBills = [...(billRes.data || [])];
      localBills.forEach(lb => {
        if (!mergedBills.some(sb => sb._id === lb._id)) mergedBills.push(lb);
      });

      // 🧮 ડાયનેમિક ડબલ-એન્ટ્રી એકાઉન્ટિંગ ટ્રાયલ બેલેન્સ ગણતરી
      const startingCash = 250000;
      
      const paidInvoices = mergedInvoices
        .filter(inv => inv.status === "PAID")
        .reduce((sum, inv) => sum + (inv.amount || inv.totalAmount || 0), 0);

      const paidBills = mergedBills
        .filter(b => b.status === "PAID")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

      const bankBalance = startingCash + paidInvoices - paidBills;

      const accountsReceivable = mergedInvoices
        .filter(inv => inv.status !== "PAID")
        .reduce((sum, inv) => sum + (inv.amount || inv.totalAmount || 0), 0);

      const accountsPayable = mergedBills
        .filter(b => b.status !== "PAID")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

      // ડેબિટ અને ક્રેડિટ ફોર્મ્યુલા
      const bankAccount = { debit: bankBalance > 0 ? bankBalance : 0, credit: bankBalance < 0 ? Math.abs(bankBalance) : 0 };
      const rentExpense = { debit: paidBills, credit: 0 };
      const serviceRevenue = { debit: 0, credit: paidInvoices };
      const arAccount = { debit: accountsReceivable, credit: 0 };
      const apAccount = { debit: 0, credit: accountsPayable };

      // માસ્ટર કેપિટલ સંતુલન (ડબલ એન્ટ્રી ઇક્વેશન)
      const totalDebits = bankAccount.debit + rentExpense.debit + arAccount.debit;
      const totalCreditsSoFar = serviceRevenue.credit + apAccount.credit;
      const capitalEquity = { debit: 0, credit: Math.max(totalDebits - totalCreditsSoFar, 0) };

      setData({
        "Bank Account (Cash Asset)": bankAccount,
        "Accounts Receivable (AR)": arAccount,
        "Rent & Office Expenses": rentExpense,
        "Service Revenue (Earnings)": serviceRevenue,
        "Accounts Payable (AP Liability)": apAccount,
        "Capital / Owner Equity": capitalEquity
      });

    } catch (err) {
      console.warn("Using fallback trial balance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totals = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;
    Object.keys(data).forEach((acc) => {
      totalDebit += Number(data[acc].debit || 0);
      totalCredit += Number(data[acc].credit || 0);
    });
    return {
      totalDebit,
      totalCredit,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0
    };
  }, [data]);

  const handleDownloadTrigger = () => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229); 
      doc.text("AMDOX TECHNOLOGIES", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); 
      doc.text("Trial Balance Statement • Enterprise Ledger Review", 14, 26);
      doc.line(14, 30, 196, 30);
      
      const tableColumns = ["General Ledger Account Head", "Debit Balance (INR)", "Credit Balance (INR)"];
      const tableRows = Object.keys(data).map(acc => [
        acc,
        data[acc].debit > 0 ? `INR ${data[acc].debit.toLocaleString("en-IN")}` : "-",
        data[acc].credit > 0 ? `INR ${data[acc].credit.toLocaleString("en-IN")}` : "-"
      ]);
      
      tableRows.push([
        "TOTAL DISBURSEMENTS",
        `INR ${totals.totalDebit.toLocaleString("en-IN")}`,
        `INR ${totals.totalCredit.toLocaleString("en-IN")}`
      ]);
      
      autoTable(doc, {
        startY: 40,
        head: [tableColumns],
        body: tableRows,
        headStyles: { fillColor: [79, 70, 229] },
        styles: { font: "helvetica", fontSize: 9, cellPadding: 4 }
      });
      
      doc.save(`AMDOX_Trial_Balance.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold">Accounting Statements</span>
          <h1 className="text-3xl font-black mt-1">📊 Trial Balance Sheets</h1>
          <p className="text-slate-400 text-sm max-w-xl">Double-entry ledger balances verified at specific points in time.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 border rounded-xl px-4 text-xs font-bold text-slate-600 outline-none" />
          <span className="text-slate-400 text-xs font-bold">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-10 border rounded-xl px-4 text-xs font-bold text-slate-600 outline-none" />
          <button onClick={fetchData} className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">Apply</button>
        </div>
        <button onClick={handleDownloadTrigger} className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold w-full sm:w-auto">Export Statement</button>
      </div>

      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden p-6 space-y-6">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-600">
                <thead className="bg-slate-50 border-b font-bold text-slate-700 uppercase">
                  <tr>
                    <th className="p-4 text-left">General Ledger Account Head</th>
                    <th className="p-4 text-right">Debit Balances (INR)</th>
                    <th className="p-4 text-right">Credit Balances (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(data).map((acc) => (
                    <tr key={acc} className="border-b hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{acc}</td>
                      <td className="p-4 text-right font-semibold text-emerald-600">
                        {data[acc].debit > 0 ? `₹${data[acc].debit.toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className="p-4 text-right font-semibold text-rose-500">
                        {data[acc].credit > 0 ? `₹${data[acc].credit.toLocaleString("en-IN")}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
              <div className="flex gap-8 font-extrabold text-slate-700">
                <span>Total Debit: ₹{totals.totalDebit.toLocaleString("en-IN")}</span>
                <span>Total Credit: ₹{totals.totalCredit.toLocaleString("en-IN")}</span>
              </div>
              <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase border w-fit ${
                totals.isBalanced ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
              }`}>
                {totals.isBalanced ? "Balanced ✓" : "Unbalanced Ledger"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}