import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Package, Users, Receipt, ShieldCheck, Sparkles } from "lucide-react";
import API from "../../services/api";

export default function SmartSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const loadSearchDB = async () => {
      try {
        setLoading(true);
        const [empRes, prodRes, invRes] = await Promise.all([
          API.get("/hr/employees").catch(() => ({ data: [] })),
          API.get("/inventory/product").catch(() => ({ data: [] })),
          API.get("/finance/invoice").catch(() => ({ data: [] }))
        ]);
        setEmployees(empRes.data || []);
        setProducts(prodRes.data || []);
        setInvoices(invRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSearchDB();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const matches = [];

    employees.forEach(emp => {
      const name = emp.userId?.name || emp.name || "";
      const position = emp.position || "";
      if (name.toLowerCase().includes(lowerQuery) || position.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: "EMPLOYEE", title: name, desc: position, key: emp._id });
      }
    });

    products.forEach(prod => {
      const name = prod.name || "";
      if (name.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: "PRODUCT", title: name, desc: `Stock: ${prod.quantity || prod.stock || 0} Units remaining`, key: prod._id });
      }
    });

    invoices.forEach(inv => {
      const client = inv.clientName || "";
      if (client.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: "INVOICE", title: `Invoice for ${client}`, desc: `Amount: ₹${inv.amount} (${inv.status || "UNPAID"})`, key: inv._id });
      }
    });

    return matches;
  }, [query, employees, products, invoices]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold">Spotlight Search</span>
        <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
          <Sparkles className="text-indigo-400" /> Smart Command Search
        </h1>
        <p className="mt-2 text-slate-400 text-sm">Semantically lookup employee profiles, warehouse stocks, or sales invoices instantly.</p>
      </div>

      {/* Spotlight Bar */}
      <div className="bg-white rounded-3xl border p-4 shadow-sm relative">
        <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search employees, products, or invoices..."
          className="w-full h-12 pl-12 pr-4 rounded-xl border bg-slate-50/50 outline-none focus:bg-white text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
        />
      </div>

      {/* Results Panel */}
      {loading ? (
        <div className="p-12 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
      ) : query && results.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm font-bold bg-white rounded-3xl border">
          No records found matching "{query}"
        </div>
      ) : query ? (
        <div className="bg-white rounded-3xl border shadow-sm divide-y">
          {results.map((r) => (
            <div key={r.key} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition">
              <div className="flex items-center gap-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                  r.type === "EMPLOYEE" ? "bg-indigo-50 text-indigo-600" :
                  r.type === "PRODUCT" ? "bg-emerald-50 text-emerald-600" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  {r.type === "EMPLOYEE" && <Users size={20} />}
                  {r.type === "PRODUCT" && <Package size={20} />}
                  {r.type === "INVOICE" && <Receipt size={20} />}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{r.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{r.desc}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${
                r.type === "EMPLOYEE" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                r.type === "PRODUCT" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                "bg-amber-50 text-amber-700 border-amber-100"
              }`}>
                {r.type}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> Global Command Semantic Search Hub Active
      </div>
    </div>
  );
}