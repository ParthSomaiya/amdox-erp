import { FileText, Layers, Loader2 } from "lucide-react";
import { useState } from "react";
import { jsPDF } from "jspdf";

// 🔹 મોર્ડન ઇમ્પોર્ટ: autoTable ફંક્શનને સીધું જ ઇમ્પોર્ટ કર્યું
import autoTable from "jspdf-autotable";

export default function ReportExportButtons({ invoices = [] }) {
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  // 📄 ૧. પ્રીમિયમ કોર્પોરેટ ડિઝાઇન સાથે PDF જનરેટર
  const handleExportPDF = () => {
    try {
      setExportingPDF(true);
      const doc = new jsPDF();

      // કંપની લાઈવ બ્રાન્ડિંગ હેડર
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229); // Indigo-600 કલર
      doc.text("AMDOX TECHNOLOGIES", 14, 20);

      // સબ-હેડર
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text("Enterprise Financial Suite • Consolidated Invoice Report", 14, 26);

      // ડેકોરેટિવ બોર્ડર લાઇન
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.line(14, 30, 196, 30);

      // રિપોર્ટ મેટાડેટા વિગતો
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 38);
      doc.text(`Total Records: ${invoices.length} Invoices`, 14, 44);

      // ટેબલ કોલમ્સ
      const tableColumns = ["Invoice Number", "Customer Name", "Total Amount (INR)", "Status"];

      // ટેબલ ડેટા રોઝ
      const tableRows = invoices.map((inv) => [
        inv.invoiceNumber || `INV-${inv._id?.slice(-6) || "N/A"}`,
        inv.clientName || "Walk-in Customer",
        `INR ${inv.amount?.toLocaleString("en-IN") || 0}`,
        inv.status || "UNPAID"
      ]);

      // 🔹 ફિક્સ: autoTable ફંક્શનને ડાયરેક્ટ કોલ કર્યું
      autoTable(doc, {
        startY: 50,
        head: [tableColumns],
        body: tableRows,
        headStyles: {
          fillColor: [79, 70, 229], // Indigo હેડર બેકગ્રાઉન્ડ
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // લાઇટ ગ્રે વૈકલ્પિક આડી લાઇનો
        },
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 4
        }
      });

      // ફાઈલ સેવ પ્રક્રિયા
      doc.save(`AMDOX_Invoices_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert("Failed to compile PDF Report: " + err.message);
    } finally {
      setExportingPDF(false);
    }
  };

  // 📊 ૨. MS Excel કમ્પેટિબલ સ્પ્રેડશીટ ડાઉનલોડર
  const handleExportExcel = () => {
    try {
      setExportingExcel(true);

      // એક્સેલ માટે કોલમ્સ હેડર્સ
      let csvContent = "\ufeffInvoice Number,Customer Name,Amount (INR),Status,Date Created\n";

      // ડેટા લાઈન કમ્પાઈલેશન
      invoices.forEach((inv) => {
        const invNo = inv.invoiceNumber || `INV-${inv._id?.slice(-6) || "N/A"}`;
        const client = inv.clientName || "Walk-in Customer";
        const amt = inv.amount || 0;
        const status = inv.status || "UNPAID";
        const date = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("en-IN") : "N/A";

        csvContent += `"${invNo}","${client}",${amt},"${status}","${date}"\n`;
      });

      // બ્રાઉઝર ફાઈલ ડાઉનલોડ ટ્રિગર
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `AMDOX_Invoices_Sheet_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV Export failed:", err);
      alert("Failed to compile Spreadsheet");
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h4 className="font-bold text-slate-800 text-sm">Download Consolidated Financial Reports</h4>
        <p className="text-xs text-slate-400">Generate secure PDF accounts spreadsheets for audits</p>
      </div>

      <div className="flex gap-3">
        {/* PDF Button */}
        <button
          onClick={handleExportPDF}
          disabled={exportingPDF || invoices.length === 0}
          className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
        >
          {exportingPDF ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <FileText size={14} />}
          PDF Report
        </button>

        {/* Excel Button */}
        <button
          onClick={handleExportExcel}
          disabled={exportingExcel || invoices.length === 0}
          className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
        >
          {exportingExcel ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Layers size={14} />}
          Excel Spreadsheet
        </button>
      </div>
    </div>
  );
}