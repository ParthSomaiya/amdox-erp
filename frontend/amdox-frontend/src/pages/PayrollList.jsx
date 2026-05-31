import { useEffect, useMemo, useState } from "react";
import { Receipt, Search, Loader2, Calendar } from "lucide-react";
import API from "../services/api";

export default function PayrollList() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      // સર્વરના રિસ્પોન્સ ઇન્વેલપ (res.data.data) ને સચોટ રીતે રીડ કરો
      const res = await API.get("/payroll");
      const list = res.data?.data || res.data || [];
      setPayrolls(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Using local storage fallback.");
      const saved = JSON.parse(localStorage.getItem("amdox_simulated_payrolls") || "[]");
      setPayrolls(saved);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  // 🧠 પોપ્યુલેટેડ નેસ્ટેડ ઓબ્જેક્ટમાંથી નામ મેળવવાનો સચોટ રસ્તો
  const resolveEmployeeName = (item) => {
    if (!item) return "Employee";

    // ૧. જો employeeId ની અંદર userId ઓબ્જેક્ટ પોપ્યુલેટેડ હોય
    if (item.employeeId && typeof item.employeeId === "object") {
      if (item.employeeId.userId && typeof item.employeeId.userId === "object") {
        if (item.employeeId.userId.name) return item.employeeId.userId.name;
      }
      if (item.employeeId.name) return item.employeeId.name;
    }

    // ૨. બેકઅપ પ્રોપર્ટીઝ
    if (item.employeeName) return item.employeeName;
    if (item.name) return item.name;

    return "Employee";
  };

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((item) => {
      const name = resolveEmployeeName(item).toLowerCase();
      const month = (item?.month || "").toLowerCase();
      return name.includes(search.toLowerCase()) || month.includes(search.toLowerCase());
    });
  }, [payrolls, search]);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 rounded-3xl p-8 text-white shadow-md">
        <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
          <Receipt /> Payroll Records
        </h1>
        <p className="mt-2 text-purple-100 text-sm">Review, verify, and monitor compiled employee salary transactions.</p>
      </div>

      <div className="bg-white rounded-3xl border p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search payroll by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border pl-11 pr-4 outline-none focus:border-purple-500 text-sm bg-slate-50/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b text-xs uppercase font-bold">
                <tr>
                  <th className="p-4 text-left">Employee Name</th>
                  <th className="p-4 text-left">Month</th>
                  <th className="p-4 text-left">Basic Salary</th>
                  <th className="p-4 text-left">Deductions</th>
                  <th className="p-4 text-left">Net Salary</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.map((item) => {
                  const name = resolveEmployeeName(item);
                  
                  const totalDeductions = 
                    (item.deductions || 0) + 
                    (item.deduction || 0) + 
                    (item.leaveDeduction || 0) + 
                    (item.pf || 0) + 
                    (item.pt || 0) + 
                    (item.tds || 0);

                  return (
                    <tr key={item._id} className="border-b hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center uppercase">
                            {name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
                            <span className="text-[10px] text-slate-400 font-bold">ID: {item._id?.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-slate-600 font-semibold"><Calendar size={13} /> {item.month}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-700">₹{item.basicSalary?.toLocaleString("en-IN")}</td>
                      <td className="p-4 font-bold text-rose-500">₹{totalDeductions?.toLocaleString("en-IN") || 0}</td>
                      <td className="p-4 font-black text-emerald-600 text-sm">₹{item.netSalary?.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                          Paid ✓
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}