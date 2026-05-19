import { useEffect, useState } from "react";
import API from "../../services/api";

export default function InventoryDashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    API.get("/inventory/dashboard").then((res) =>
      setData(res.data)
    );
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-4">

      <div className="bg-white p-4 shadow rounded">
        <h2>Total Products</h2>
        <h1 className="text-2xl font-bold">
          {data.totalProducts}
        </h1>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2>Total Stock</h2>
        <h1 className="text-2xl font-bold">
          {data.totalStock}
        </h1>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2>Low Stock</h2>
        <h1 className="text-2xl font-bold text-red-500">
          {data.lowStock}
        </h1>
      </div>

    </div>
  );
}