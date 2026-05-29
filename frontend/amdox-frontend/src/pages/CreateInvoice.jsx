import { useState } from "react";
import API from "../services/api";

export default function CreateInvoice() {
  const [amount, setAmount] = useState(0);
  const [gstRate, setGstRate] = useState(18);
  const [result, setResult] = useState({});

  const calculateGST = () => {
    const gst = (amount * gstRate) / 100;
    setResult({
      cgst: gst / 2,
      sgst: gst / 2,
      total: amount + gst,
    });
  };

  const createInvoice = async () => {
    try {
      await API.post("/finance/invoice", {
        amount: result.total,
      });
      alert("Invoice Created Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          className="border p-3 w-full rounded-xl"
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="GST %"
          className="border p-3 w-full rounded-xl"
          value={gstRate}
          onChange={(e) => setGstRate(Number(e.target.value))}
        />

        <button onClick={calculateGST} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold">
          Calculate GST
        </button>

        {result.total && (
          <div className="mt-4 p-4 bg-slate-50 border rounded-xl space-y-2 text-sm font-semibold">
            <p>CGST: ₹{result.cgst}</p>
            <p>SGST: ₹{result.sgst}</p>
            <p className="text-indigo-600">Total: ₹{result.total}</p>
          </div>
        )}

        <button
          onClick={createInvoice}
          className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold"
        >
          Create Invoice
        </button>
      </div>
    </div>
  );
}