import { useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

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
    await API.post("/finance/invoice", {
      amount: result.total,
    });
    alert("Invoice Created");
  };

  return (
    <MainLayout>

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-2xl font-bold mb-4">
          Create Invoice
        </h2>

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 mb-2"
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="GST %"
          className="border p-2 mb-2"
          value={gstRate}
          onChange={(e) => setGstRate(Number(e.target.value))}
        />

        <button onClick={calculateGST} className="bg-blue-500 text-white px-4 py-2">
          Calculate GST
        </button>

        {result.total && (
          <div className="mt-4">
            <p>CGST: ₹{result.cgst}</p>
            <p>SGST: ₹{result.sgst}</p>
            <p>Total: ₹{result.total}</p>
          </div>
        )}

        <button
          onClick={createInvoice}
          className="bg-green-600 text-white px-4 py-2 mt-4"
        >
          Create Invoice
        </button>
      </div>
    </MainLayout>
  );
}