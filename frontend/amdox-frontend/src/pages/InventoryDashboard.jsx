import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function InventoryDashboard() {
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    API.get("/products/low-stock").then((res) => setLowStock(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">Inventory Dashboard</h2>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="mb-2 font-semibold text-red-500">Low Stock Alerts</h3>

        {lowStock.map((p) => (
          <div key={p._id} className="border-b py-2">
            {p.name} - Stock: {p.stock}
          </div>
        ))}
      </div>
    </MainLayout>
  );
}