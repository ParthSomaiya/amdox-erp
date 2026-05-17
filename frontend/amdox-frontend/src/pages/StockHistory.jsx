import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function StockHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/stock/history").then((res) => setData(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">Stock Movement</h2>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>Product</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Warehouse</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d._id}>
              <td>{d.productId?.name}</td>
              <td>{d.type}</td>
              <td>{d.quantity}</td>
              <td>{d.warehouseId?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}