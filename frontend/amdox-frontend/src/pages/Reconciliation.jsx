import { useEffect, useState } from "react";
import API from "../services/api";

export default function Reconciliation() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/reconciliation").then((res) => setData(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl mb-4">Bank Reconciliation</h2>

      {data.map((t) => (
        <div key={t._id} className="bg-white p-4 mb-2 shadow rounded">
          <p>Amount: ₹{t.amount}</p>
          <p>Status: {t.matched ? "Matched ✅" : "Pending ❌"}</p>
        </div>
      ))}
    </MainLayout>
  );
}