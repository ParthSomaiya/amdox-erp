import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/po").then((res) => setOrders(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">Purchase Orders</h2>

      {orders.map((o) => (
        <div key={o._id} className="bg-white p-4 shadow mb-3">
          Vendor: {o.vendorId?.name} <br />
          Total: ₹{o.total}
        </div>
      ))}
    </MainLayout>
  );
}