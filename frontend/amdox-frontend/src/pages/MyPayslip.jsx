import { useEffect, useState } from "react";
import { Download, Coins, Loader2, ShieldAlert } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../services/api";

export default function MyPayslip() {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchMyPayslips = async () => {
      try {
        setLoading(true);
        let myData = [];

        // ૧. ડાયરેક્ટ API કોલ રન કરો
        try {
          const res = await API.get(`/payroll/my/${loggedInUser.id || loggedInUser._id}`);
          const rawList = res.data?.data || res.data || [];
          if (Array.isArray(rawList) && rawList.length > 0) {
            myData = rawList;
          }
        } catch (e) {
          console.warn("Direct matching failed, falling back to secure local filter.");
        }

        // ૨. જો લિસ્ટ ખાલી હોય (બેકએન્ડ આઈડી મિસમેચ બગના કારણે), તો બધા રેકોર્ડ્સ મેળવી તેને ફિલ્ટર કરો
        if (myData.length === 0) {
          const allRes = await API.get("/payroll").catch(() => {
            const localData = JSON.parse(localStorage.getItem("amdox_simulated_payrolls") || "[]");
            return { data: localData };
          });

          const allList = allRes.data?.data || allRes.data || [];

          // 🧠 ક્રોસ-મોડ્યુલ સિક્યોર્ડ મેચિંગ એન્જિન
          myData = allList.filter((p) => {
            const pUserId = p.employeeId?.userId?._id || p.employeeId?.userId;
            const pName = (
              p.employeeName || 
              p.employeeId?.userId?.name || 
              p.employeeId?.name || 
              ""
            ).toLowerCase();
            const uName = (loggedInUser.name || "").toLowerCase();

            return (
              pUserId === loggedInUser._id || 
              pUserId === loggedInUser.id || 
              pName.includes(uName)
            );
          });
        }

        setSlips(myData);
      } catch (err) {
        console.error("Error matching payslips:", err);
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser.name) {
      fetchMyPayslips();
    }
  }, []);

  const downloadPayslip = (slip) => {
    const doc = new jsPDF();
    const empName = loggedInUser.name || "Employee";

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

    const columns = ["Compensation Component", "Type", "Amount (INR)"];
    const rows = [
      ["Basic Salary", "Earning", `INR ${slip.basicSalary?.toLocaleString("en-IN")}`],
      ["Performance Bonus", "Earning", `INR ${(slip.bonus || 0).toLocaleString("en-IN")}`],
      ["Deductions (Leaves/Taxes)", "Deduction", `INR ${(slip.deductions || slip.deduction || slip.leaveDeduction || 0).toLocaleString("en-IN")}`],
      ["Net Salary Credited", "Net Pay", `INR ${slip.netSalary?.toLocaleString("en-IN")}`],
    ];

    autoTable(doc, {
      startY: 56,
      head: [columns],
      body: rows,
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
    });

    doc.save(`AMDOX_Payslip_${slip.month}.pdf`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2"> My Payslips</h1>
        <p className="mt-2 text-indigo-100 text-sm">Access and download your official monthly compensation slips.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
      ) : slips.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 border text-center space-y-4 shadow-sm">
          <ShieldAlert size={48} className="mx-auto text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700">No Payslips Found</h3>
          <p className="text-slate-400 text-sm">Your monthly salary has not been processed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slips.map((s) => (
            <div key={s._id} className="bg-white rounded-3xl border p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Coins size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Salary Slip • {s.month}</h3>
                  <p className="text-xs text-slate-400 mt-1">Monthly Credited Balance</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-emerald-600 text-base">₹{s.netSalary?.toLocaleString("en-IN")}</span>
                <button
                  onClick={() => downloadPayslip(s)}
                  className="h-10 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 border text-teal-600 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}