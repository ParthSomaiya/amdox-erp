import { useEffect, useState } from "react";
import API from "../services/api";

export default function Invoices() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/finance/invoice").then(res => setData(res.data));
  }, []);

  const markPaid = (id) => {
    API.post("/finance/invoice/paid", { invoiceId: id })
      .then(() => window.location.reload());
  };

  return (
    <div>
      <h2>Invoices</h2>

      {data.map(i => (
        <div key={i._id}>
          {i.clientName} - ₹{i.amount} - {i.status}

          {i.status !== "PAID" && (
            <button onClick={() => markPaid(i._id)}>
              Mark Paid
            </button>
          )}
        </div>
      ))}
    </div>
  );
}