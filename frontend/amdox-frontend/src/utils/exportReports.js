import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportPDF =
  (data) => {

    const doc = new jsPDF();

    autoTable(doc, {
      body: data,
    });

    doc.save("report.pdf");

};

export const exportExcel =
  (data) => {

    const ws =
      XLSX.utils.json_to_sheet(data);

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Reports"
    );

    XLSX.writeFile(
      wb,
      "report.xlsx"
    );

};