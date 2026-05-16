import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Products() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/products").then(res => setData(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl mb-4">Products</h2>

      {data.map(p => (
        <div key={p._id} className="bg-white p-4 mb-2 shadow">
          {p.name} - Qty: {p.quantity}
        </div>
      ))}
    </MainLayout>
  );
}