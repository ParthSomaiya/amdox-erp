import { useEffect, useState } from "react";
import API from "../services/api";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    API.get("/finance/invoices").then((res) =>
      setInvoices(res.data)
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧾 Invoices</h1>

      <div className="grid gap-4">
        {invoices.map((inv) => (
          <div
            key={inv._id}
            className="bg-white p-4 shadow rounded flex justify-between"
          >
            <div>
              <p className="font-bold">{inv.clientName}</p>
              <p>Amount: ₹{inv.amount}</p>
              <p>GST: {inv.gst}%</p>
            </div>

            <div className="text-green-600 font-bold">
              ₹{inv.amount + (inv.amount * inv.gst) / 100}
            </div>
          </div>
        ))}
      </div>

      {/* EXPORT BUTTONS */}
      <div className="mt-6">
        <a
          href="http://localhost:5000/api/finance/report/pdf"
          target="_blank"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          📄 Export PDF
        </a>

        <a
          href="http://localhost:5000/api/finance/report/excel"
          className="bg-green-600 text-white px-4 py-2 rounded ml-2"
        >
          📊 Export Excel
        </a>
      </div>
    </div>
  );
}