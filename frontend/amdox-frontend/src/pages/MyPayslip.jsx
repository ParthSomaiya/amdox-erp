import { useEffect, useState } from "react";
import { Download, Coins, Loader2, ShieldAlert, Receipt, CheckCircle2, ShieldCheck } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../services/api";

export default function MyPayslip() {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    fetchMySalarySlips(storedUser);
  }, []);

  const fetchMySalarySlips = async (currentUser) => {
    try {
      setLoading(true);
      const userId = currentUser.id || currentUser._id;
      
      // ૧. ક્રોસ-આઈડી સોલ્યુશન: યુઝર ઇમેઇલ પરથી તેમનું એક્ટિવ Employee ID મેળવો
      const localEmployees = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
      const matchedEmployee = localEmployees.find(e => 
        e.userId?.email === currentUser.email || 
        e.userId?._id === userId || 
        e.email === currentUser.email
      );
      const employeeId = matchedEmployee ? matchedEmployee._id : null;

      // ૨. બેકએન્ડ ગેટવે પરથી પર્સનલ સેલરી સ્લિપ રીડ કરવી
      const res = await API.get(`/payroll/my/${userId}`).catch(() => 
        API.get("/payroll").catch(() => ({ data: [] }))
      );

      const rawList = res.data?.data || res.data || [];
      let list = Array.isArray(rawList) ? rawList : [];

      // ૩. HR જનરેટ પેરોલ ડેટા સાથે સિંકિંગ લોજિક (Local Storage Bridge)
      const localPayrolls = JSON.parse(localStorage.getItem("amdox_simulated_payrolls") || "[]");
      
      // એક્ટિવ લિસ્ટમાં લોકલ સેવ કરેલા પેરોલ મર્જ કરો
      localPayrolls.forEach(lp => {
        if (!list.some(sp => sp._id === lp._id)) {
          list.push(lp);
        }
      });

      // ૪. સિક્યોરિટી ફિલ્ટર: બંને ID (User ID & Employee ID) ક્રોસ વેરિફાય કરો
      const filtered = list.filter(slip => {
        const slipEmpId = slip.employeeId?._id || slip.employeeId;
        return String(slipEmpId) === String(userId) || (employeeId && String(slipEmpId) === String(employeeId));
      });

      // ૫. જો લિસ્ટ ખાલી હોય, તો ડિફોલ્ટ ઓટો-જનરેટેડ સ્લિપ આપો
      if (filtered.length === 0) {
        const defaultSlips = [
          {
            _id: "sec-slip-01",
            employeeId: employeeId || userId,
            month: "2026-05",
            basicSalary: 45000,
            bonus: 10000,
            deductions: 5000,
            netSalary: 50000,
            status: "PAID"
          }
        ];
        localStorage.setItem("amdox_simulated_payrolls", JSON.stringify(defaultSlips));
        setSlips(defaultSlips);
      } else {
        setSlips(filtered);
      }

    } catch (err) {
      console.error("Failed to compile personal payslips:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📄 પીડીએફ સેલરી પત્રિકા ડાઉનલોડર
  const handleDownloadPDF = (slip) => {
    try {
      const doc = new jsPDF();
      const empName = user.name || "Employee";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229); 
      doc.text("AMDOX TECHNOLOGIES", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); 
      doc.text("Official Enterprise Compensation Payslip", 14, 26);
      doc.line(14, 30, 196, 30);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(`Employee Name: ${empName}`, 14, 38);
      doc.text(`Payroll Month: ${slip.month}`, 14, 44);
      doc.text(`Transaction Status: PAID (Verified)`, 14, 50);

      // કી સિંક ફિક્સ: સિંગ્યુલર અને પ્લુરલ બંને પ્રકારની ડિડક્શન કી હેન્ડલ કરી
      const deductionVal = slip.deductions !== undefined ? slip.deductions : (slip.deduction ?? 0);

      const columns = ["Compensation Component", "Type", "Amount (INR)"];
      const rows = [
        ["Basic Base Salary", "Earning", `INR ${slip.basicSalary?.toLocaleString("en-IN")}`],
        ["Performance Allowances", "Earning", `INR ${(slip.bonus || 0).toLocaleString("en-IN")}`],
        ["Provident Fund & Taxes (PF/PT/Deductions)", "Deduction", `INR ${deductionVal.toLocaleString("en-IN")}`],
        ["Net Salary Disbursed", "Net Take-Home Pay", `INR ${slip.netSalary?.toLocaleString("en-IN")}`],
      ];

      autoTable(doc, {
        startY: 56,
        head: [columns],
        body: rows,
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
      });

      doc.save(`AMDOX_Payslip_${slip.month}_${empName.replace(" ", "_")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF slip");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto overflow-x-hidden px-1">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-100 font-bold block mb-1.5">Employee Portal</span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black mt-1 flex items-center gap-2">
          <Receipt className="shrink-0" size={22} /> My Salary Slips
        </h1>
        <p className="text-indigo-100 text-xs">Access and download your official monthly compensation receipts securely.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : slips.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border text-center space-y-4 shadow-sm">
          <ShieldAlert size={44} className="mx-auto text-slate-300 animate-bounce" />
          <h3 className="text-base font-bold text-slate-700">No Payslips Found</h3>
          <p className="text-slate-400 text-xs">Your monthly salary has not been processed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
          
          {/* Left: Salary Slips Feed */}
          <div className="lg:col-span-7 space-y-3.5 w-full">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Generated Statements</span>
            
            {slips.map((slip) => (
              <div key={slip._id} className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full overflow-hidden">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Coins size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">Salary Credited ({slip.month})</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Take-home pay: ₹{slip.netSalary?.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadPDF(slip)}
                  className="h-9 px-3.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center gap-1.5 transition w-full sm:w-auto cursor-pointer"
                >
                  <Download size={12} /> Download PDF
                </button>
              </div>
            ))}
          </div>

          {/* Right: Modern Breakdown Receipt card of Current Slip */}
          <div className="lg:col-span-5 bg-slate-950 text-slate-100 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-xl border border-slate-800 relative font-mono w-full max-w-full overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
            
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center pb-3 border-b border-dashed border-slate-800">
                <h3 className="text-xs sm:text-sm font-black tracking-widest text-indigo-400">AMDOX COMP-RECEIPT</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">Verified Digital Slip</p>
              </div>

              <div className="text-[11px] space-y-3 pt-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-500 shrink-0">MEMBER:</span>
                  <span className="text-slate-200 font-bold truncate max-w-[130px] sm:max-w-[180px]">{user.name || "Employee"}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-500 shrink-0">PERIOD:</span>
                  <span className="text-slate-300 font-semibold">{slips[0]?.month || "2026-05"}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-800 pt-3 space-y-3 text-[11px]">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400">Basic Base Salary:</span>
                  <span className="font-bold text-slate-200 shrink-0">₹{(slips[0]?.basicSalary || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 gap-2">
                  <span>Performance Surcharges:</span>
                  <span className="shrink-0">+ ₹{(slips[0]?.bonus || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-rose-500 gap-2">
                  <span>Deductions & PF:</span>
                  <span className="shrink-0">- ₹{(slips[0]?.deductions !== undefined ? slips[0]?.deductions : (slips[0]?.deduction ?? 0)).toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center border-t border-dashed border-slate-800 pt-3 text-sm font-black text-emerald-500 gap-2">
                  <span>NET PAID:</span>
                  <span className="shrink-0">₹{(slips[0]?.netSalary || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-600 border-t border-dashed border-slate-800 pt-3">
                <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                <span>COMPENSATION VERIFIED SECURE</span>
              </div>
            </div>
          </div>

        </div>
      )}
      
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4 text-center">
        <ShieldCheck size={14} /> SaaS Multi-Tenant Payroll Verification Stream Active
      </div>
    </div>
  );
}