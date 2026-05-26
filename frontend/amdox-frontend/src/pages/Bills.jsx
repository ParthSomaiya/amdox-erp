import { useEffect, useState } from "react";
import API from "../services/api";

export default function Bills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    API.get("/ap").then((res) => setBills(res.data));
  }, []);

  const payBill = async (id) => {
    await API.put("/ap/pay", { id });
    window.location.reload();
  };

  return (
    <MainLayout>
      <h2 className="text-xl mb-4">Bills</h2>

      {bills.map((b) => (
        <div key={b._id} className="bg-white p-4 mb-2 shadow rounded">
          <p>{b.vendorId?.name}</p>
          <p>₹{b.amount}</p>

          {b.status === "UNPAID" && (
            <button
              onClick={() => payBill(b._id)}
              className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
            >
              Pay
            </button>
          )}
        </div>
      ))}
    </MainLayout>
  );
}