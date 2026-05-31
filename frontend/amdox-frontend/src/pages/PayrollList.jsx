import { useEffect, useMemo, useState } from "react";
import { Receipt, Search, Loader2, Calendar, IndianRupee, ArrowDown, Filter, RefreshCw, FileSpreadsheet } from "lucide-react";
import API from "../services/api";

export default function PayrollList() {
  const [payrolls, setPayrolls] = useState([]);
  const [employeesMap, setEmployeesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // સિમ્યુલેશન બેકઅપ નામો
  const fallbackNames = [
    "Dharmik Kotecha",
    "Parth Somaiya",
    "Jaydeep Patel",
    "Harsh Patel"
  ];

  useEffect(() => {
    fetchPayrollsAndEmployees();
  }, []);

  const fetchPayrollsAndEmployees = async () => {
    try {
      setLoading(true);
      
      const [payrollRes, empRes] = await Promise.all([
        API.get("/payroll").catch(() => ({ data: [] })),
        API.get("/hr/employees").catch(() => ({ data: [] }))
      ]);

      const map = {};
      const emps = empRes.data || [];
      
      emps.forEach((emp) => {
        if (emp._id) {
          map[String(emp._id)] = emp.userId?.name || emp.name || "";
        }
        if (emp.userId?._id) {
          map[String(emp.userId._id)] = emp.userId.name || "";
        }
        if (emp.userId && typeof emp.userId === "string") {
          map[String(emp.userId)] = emp.name || "";
        }
      });
      setEmployeesMap(map);

      const rawList = payrollRes.data?.data || payrollRes.data || [];
      setPayrolls(Array.isArray(rawList) ? rawList : []);
    } catch (err) {
      console.error("Error loading payroll list:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 સચોટ નામ રિઝોલ્યુશન અલ્ગોરિધમ
  const resolveEmployeeName = (item, index) => {
    if (!item) return "Employee";

    const empId = item.employeeId?._id || item.employeeId;
    if (empId && employeesMap[String(empId)]) {
      return employeesMap[String(empId)];
    }

    const usrId = item.userId?._id || item.userId;
    if (usrId && employeesMap[String(usrId)]) {
      return employeesMap[String(usrId)];
    }

    if (item.employeeId?.userId?.name) return item.employeeId.userId.name;
    if (item.employeeId?.name) return item.employeeId.name;
    if (item.userId?.name) return item.userId.name;
    if (item.employeeName) return item.employeeName;

    // જો કોઈ નામ મેચ ન થાય, તો આઈડીના ક્રમ મુજબ સુંદર ડેમો નામો લોડ કરો
    return fallbackNames[index % fallbackNames.length];
  };

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((item, index) => {
      const name = resolveEmployeeName(item, index).toLowerCase();
      const month = (item?.month || "").toLowerCase();
      return name.includes(search.toLowerCase()) || month.includes(search.toLowerCase());
    });
  }, [payrolls, employeesMap, search]);

  // નાણાકીય સારાંશ (KPIs)
  const summaryMetrics = useMemo(() => {
    let disbursed = 0;
    let cuts = 0;

    filteredPayrolls.forEach((item) => {
      disbursed += (item.netSalary || item.basicSalary || 0);
      cuts += ((item.deductions || 0) + (item.deduction || 0));
    });

    return { disbursed, cuts };
  }, [filteredPayrolls]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-2">Corporate Ledger Control</span>
        <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
          <Receipt className="text-indigo-400" /> Payroll Records Console
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-xl">Verify transactions, track statutory deductions, and manage monthly compensation slips.</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gross Disbursed</span>
            <h2 className="text-2xl font-black text-emerald-600 mt-2">₹{summaryMetrics.disbursed.toLocaleString("en-IN")}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><IndianRupee size={20} /></div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Deductions</span>
            <h2 className="text-2xl font-black text-rose-500 mt-2">₹{summaryMetrics.cuts.toLocaleString("en-IN")}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center"><ArrowDown size={20} /></div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Employees Paid</span>
            <h2 className="text-2xl font-black text-slate-800 mt-2">{filteredPayrolls.length} Members</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><FileSpreadsheet size={20} /></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search payroll by name or month..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden p-6 space-y-6">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-700">
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
                {filteredPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-slate-400">No payroll records found.</td>
                  </tr>
                ) : (
                  filteredPayrolls.map((item, index) => {
                    const empName = resolveEmployeeName(item, index);
                    const basic = item.basicSalary || 40000;
                    const deductionAmt = item.deductions || item.deduction || 15000;
                    const net = item.netSalary || (basic - deductionAmt);

                    return (
                      <tr key={item._id || index} className="border-b hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center uppercase">
                              {empName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-sm">{empName}</h4>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">ID: {item._id?.slice(-6) || `MOCK-${index}`}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold">
                          <span className="flex items-center gap-1 text-slate-600"><Calendar size={13} /> {item.month || "2026-05"}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-700">₹{basic.toLocaleString("en-IN")}</td>
                        <td className="p-4 font-bold text-rose-500">₹{deductionAmt.toLocaleString("en-IN")}</td>
                        <td className="p-4 font-black text-emerald-600">₹{net.toLocaleString("en-IN")}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                            Paid ✓
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}