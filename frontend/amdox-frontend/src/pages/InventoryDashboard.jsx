import { useEffect, useState } from "react";
import API from "../services/api";

export default function InventoryDashboard() {

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const res =
        await API.get("/inventory/dashboard");

      setStats(res.data);

    } catch (err) {

      console.log(err);

    }

  };

   return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        📦 Inventory Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4 mt-6">

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold">
            Total Products
          </h2>

          <p className="text-3xl mt-2">
            120
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold">
            Low Stock
          </h2>

          <p className="text-3xl mt-2 text-red-500">
            8
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold">
            Total Value
          </h2>

          <p className="text-3xl mt-2 text-green-600">
            ₹5,40,000
          </p>
        </div>

      </div>
    </div>
  );
}