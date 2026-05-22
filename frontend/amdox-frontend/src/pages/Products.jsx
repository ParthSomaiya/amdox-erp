import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">Products</h2>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}