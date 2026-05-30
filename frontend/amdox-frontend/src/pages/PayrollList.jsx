import { useEffect, useMemo, useState } from "react";
import { Receipt, Search, Loader2, Calendar } from "lucide-react";
import API from "../services/api";

export default function PayrollList() {
  const [payrolls, setPayrolls] = useState([]);
  const [employeesMap, setEmployeesMap] = useState({}); // 🔹 Employee ID અને User ID બંને મેપ કરવા માટે
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayrollsAndEmployees();
  }, []);

  const fetchPayrollsAndEmployees = async () => {
    try {
      setLoading(true);
      
      // 🔹 સમાંતર રીતે પેરોલ અને કર્મચારીઓની યાદી લોડ કરો
      const [payrollRes, empRes] = await Promise.all([
        API.get("/payroll").catch(() => ({ data: [] })),
        API.get("/hr/employees").catch(() => ({ data: [] }))
      ]);

      // 🔹 આઇડી સાથે નામનો સચોટ મલ્ટી-લેવલ મેપ તૈયાર કરો
      const map = {};
      const emps = empRes.data || [];
      
      emps.forEach((emp) => {
        // ૧. Employee ID થી નામ મેપ કરો
        if (emp._id) {
          map[String(emp._id)] = emp.userId?.name || emp.name || "";
        }
        // ૨. User ID થી નામ મેપ કરો (જેથી જો બેકએન્ડ યુઝર આઈડી રીટર્ન કરે તો પણ મેચ થાય)
        if (emp.userId?._id) {
          map[String(emp.userId._id)] = emp.userId.name || "";
        }
        if (emp.userId && typeof emp.userId === "string") {
          map[String(emp.userId)] = emp.name || "";
        }
      });
      setEmployeesMap(map);

      const rawList = payrollRes.data?.data || payrollRes.data || [];
      console.log("Debug - Payroll list data:", rawList);
      console.log("Debug - Employees map:", map);
      
      setPayrolls(Array.isArray(rawList) ? rawList : []);
    } catch (err) {
      console.error("Error loading payroll list:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 અલ્ટીમેટ નામ શોધક ફંક્શન (તમામ પ્રકારના બેકએન્ડ ડેટા સ્ટ્રક્ચરને સપોર્ટ કરશે)
  const resolveEmployeeName = (item) => {
    if (!item) return "Employee";

    // ૧. એમ્પ્લોયી આઈડી લુકઅપ
    const empId = item.employeeId?._id || item.employeeId;
    if (empId && employeesMap[String(empId)]) {
      return employeesMap[String(empId)];
    }

    // ૨. યુઝર આઈડી લુકઅપ
    const usrId = item.userId?._id || item.userId;
    if (usrId && employeesMap[String(usrId)]) {
      return employeesMap[String(usrId)];
    }

    // ૩. નેસ્ટેડ ઓબ્જેક્ટ ડાયરેક્ટ પ્રોપર્ટી લુકઅપ
    if (item.employeeId?.userId?.name) return item.employeeId.userId.name;
    if (item.employeeId?.name) return item.employeeId.name;
    if (item.userId?.name) return item.userId.name;
    if (item.employeeName) return item.employeeName;
    if (item.name) return item.name;
    if (item.employee) return item.employee;

    // ૪. ઈમેલ માંથી નામ મેળવવું
    const email = item.employeeId?.userId?.email || item.userId?.email || "";
    if (email) {
      return email.split("@")[0];
    }

    return "Employee";
  };

  // 🔹 સર્ચ અને ડાયનેમિક સોર્ટિંગ
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((item) => {
      const name = resolveEmployeeName(item).toLowerCase();
      const month = (item?.month || "").toLowerCase();
      return name.includes(search.toLowerCase()) || month.includes(search.toLowerCase());
    });
  }, [payrolls, employeesMap, search]);

  const sortedPayrolls = useMemo(() => {
    return [...filteredPayrolls].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      
      if (dateB - dateA === 0) {
        return (b.month || "").localeCompare(a.month || "");
      }
      return dateB - dateA;
    });
  }, [filteredPayrolls]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 rounded-3xl p-8 text-white shadow-md">
        <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
          <Receipt /> Payroll Records
        </h1>
        <p className="mt-2 text-purple-100 text-sm">Review, verify, and monitor compiled employee salary transactions.</p>
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
            className="w-full h-11 rounded-xl border pl-11 pr-4 outline-none focus:border-purple-500 text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b text-xs uppercase font-bold">
                <tr>
                  <th className="p-4 text-left">Employee</th>
                  <th className="p-4 text-left">Month</th>
                  <th className="p-4 text-left">Basic Salary</th>
                  <th className="p-4 text-left">Deductions</th>
                  <th className="p-4 text-left">Net Salary</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-slate-400">No payroll records compiled yet.</td>
                  </tr>
                ) : (
                  sortedPayrolls.map((item) => {
                    const empName = resolveEmployeeName(item);

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
                              {empName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{empName}</h4>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">ID: {item._id.slice(-6)}</span>
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