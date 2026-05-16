import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Receivables() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/ar").then((res) => setData(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl mb-4">Receivables</h2>

      {data.map((i) => (
        <div key={i._id} className="bg-white p-4 mb-2 shadow rounded">
          <p>{i.customerName}</p>
          <p>₹{i.amount}</p>
        </div>
      ))}
    </MainLayout>
  );
}