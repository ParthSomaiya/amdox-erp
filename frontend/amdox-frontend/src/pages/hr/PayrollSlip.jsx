import { useEffect, useState } from "react";
import { Download, Coins, Loader2, ShieldAlert } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../../services/api";

export default function PayrollSlip() {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/payroll")
      .then((res) => {
        const rawList = res.data?.data || res.data || [];
        setSlips(Array.isArray(rawList) ? rawList : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const downloadPayslip = (slip) => {
    const doc = new jsPDF();
    const empName = slip.employeeId?.userId?.name || slip.employeeId?.name || "Staff Member";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); 
    doc.text("AMDOX TECHNOLOGIES", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); 
    doc.text("Enterprise HR Suite • Official Salary Slip", 14, 26);
    doc.line(14, 30, 196, 30);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Employee Name: ${empName}`, 14, 38);
    doc.text(`Payroll Month: ${slip.month}`, 14, 44);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 50);

    const pf = slip.pf || Math.round(slip.basicSalary * 0.12);
    const pt = slip.pt || (slip.basicSalary > 10000 ? 200 : 0);
    const tds = slip.tds || 0;
    const leaveCut = slip.leaveDeduction || 0;

    const columns = ["Compensation Component", "Type", "Amount (INR)"];
    const rows = [
      ["Basic Salary", "Earning", `INR ${slip.basicSalary?.toLocaleString("en-IN")}`],
      ["Performance Bonus", "Earning", `INR ${slip.bonus?.toLocaleString("en-IN")}`],
      ["Employee Provident Fund (EPF)", "Statutory Deduction (12%)", `INR ${pf.toLocaleString("en-IN")}`],
      ["Professional Tax (PT)", "Statutory Deduction", `INR ${pt.toLocaleString("en-IN")}`],
      ["Income Tax (TDS)", "Statutory Deduction", `INR ${tds.toLocaleString("en-IN")}`],
      ["Approved Leave Deduction", "Leave Cut", `INR ${leaveCut.toLocaleString("en-IN")}`],
      ["Net Salary Credited", "Net Pay", `INR ${slip.netSalary?.toLocaleString("en-IN")}`],
    ];

    autoTable(doc, {
      startY: 56,
      head: [columns],
      body: rows,
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
    });

    doc.save(`AMDOX_Payslip_${slip.month}_${slip._id?.slice(-6)}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md">
        <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">🧾 Payroll Salary Slips</h1>
        <p className="mt-1.5 text-emerald-100 text-xs">Access, review, and print compiled monthly compensation slips.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-emerald-600 mx-auto" />
        </div>
      ) : slips.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border text-center space-y-4 shadow-sm">
          <ShieldAlert size={44} className="mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">No Generated Slips Found</h3>
        </div>
      ) : (
        <div className="space-y-3.5 w-full max-w-full overflow-hidden">
          {slips.map((s) => {
            const empName = s.employeeId?.userId?.name || s.employeeId?.name || "Staff Member";
            return (
              <div key={s._id} className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition w-full max-w-full overflow-hidden">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Coins size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">
                      Salary Slip • {empName} ({s.month})
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Net Compensation Credited</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                  <span className="font-black text-emerald-600 text-sm sm:text-base">₹{s.netSalary?.toLocaleString("en-IN")}</span>
                  <button
                    onClick={() => downloadPayslip(s)}
                    className="h-9 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-100 text-teal-600 font-bold text-xs flex items-center gap-1 transition cursor-pointer shrink-0"
                  >
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}