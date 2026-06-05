import { useState, useEffect, useMemo } from "react";
import { Download, Sparkles, Loader2, FileSpreadsheet, ShieldCheck } from "lucide-react";
import API from "../../services/api";

export default function ReportBuilder() {
    const [invoices, setInvoices] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(["invoiceNumber", "clientName", "amount", "status"]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            setLoading(true);
            const res = await API.get("/finance/invoice");
            const serverInvs = res.data || [];

            const localInvs = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
            const merged = [...serverInvs];
            localInvs.forEach(li => {
                if (!merged.some(si => si._id === li._id)) merged.push(li);
            });
            setInvoices(merged);
        } catch (err) {
            console.warn("Using offline fallback invoices for Report Builder.");
            const localInvs = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
            setInvoices(localInvs.length > 0 ? localInvs : [
                { _id: "inv-101", invoiceNumber: "INV-00101", clientName: "AWS Cloud Services", amount: 45000, status: "PAID", createdAt: new Date().toISOString() },
                { _id: "inv-102", invoiceNumber: "INV-00102", clientName: "Oracle India Pvt Ltd", amount: 120000, status: "UNPAID", createdAt: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (invoices.length === 0) return;

        // CSV headers configuration
        const headers = selectedColumns.join(",");

        // CSV rows mapping
        const rows = invoices.map(row =>
            selectedColumns.map(col => {
                const val = col === "invoiceNumber" ? (row.invoiceNumber || `INV-${row._id?.slice(-5)}`) : row[col];
                return `"${String(val || "").replace(/"/g, '""')}"`;
            }).join(",")
        ).join("\n");

        const csvContent = "\ufeff" + headers + "\n" + rows;
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `AMDOX_Custom_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white border rounded-[32px] p-8 shadow-sm space-y-6 max-w-5xl mx-auto">
            <div className="pb-4 border-b flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                        <Sparkles className="text-indigo-600 animate-pulse" /> Live Report Builder Workspace
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Select columns to compile targeted executive ledger logs from active databases</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={loading || invoices.length === 0}
                    className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                    <FileSpreadsheet size={14} /> Export Custom CSV
                </button>
            </div>

            {loading ? (
                <div className="p-16 text-center">
                    <Loader2 className="animate-spin text-indigo-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold mt-3">Compiling database fields...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 items-start">
                    {/* Columns Selector (Left) */}
                    <div className="md:col-span-4 p-5 bg-slate-50 rounded-2xl border space-y-4">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Select Schema Columns</h4>
                        <div className="space-y-2 text-xs font-bold text-slate-600">
                            {[
                                { key: "invoiceNumber", label: "Invoice Number" },
                                { key: "clientName", label: "Customer Name" },
                                { key: "amount", label: "Amount (Base)" },
                                { key: "status", label: "Status" }
                            ].map(col => (
                                <label key={col.key} className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedColumns.includes(col.key)}
                                        onChange={() => {
                                            setSelectedColumns(prev =>
                                                prev.includes(col.key) ? prev.filter(c => c !== col.key) : [...prev, col.key]
                                            );
                                        }}
                                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 accent-indigo-600 cursor-pointer"
                                    />
                                    <span>{col.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Live Preview (Right) */}
                    <div className="md:col-span-8 p-5 bg-slate-50 rounded-2xl border space-y-4 overflow-hidden min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Live Compilation Preview</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[10px] text-slate-600 font-mono min-w-[400px]">
                                <thead className="bg-white border-b">
                                    <tr>
                                        {selectedColumns.map(col => (
                                            <th key={col} className="p-2.5 text-left capitalize">
                                                {col === "invoiceNumber" ? "Invoice No" : col === "clientName" ? "Customer" : col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((row, idx) => (
                                        <tr key={idx} className="border-b last:border-0">
                                            {selectedColumns.map(col => {
                                                const cellVal = col === "invoiceNumber" ? (row.invoiceNumber || `INV-${row._id?.slice(-5)}`) : row[col];
                                                return (
                                                    <td key={col} className="p-2.5 max-w-[150px] truncate font-semibold">
                                                        {col === "amount" ? `₹${cellVal?.toLocaleString()}` : String(cellVal || "-")}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}