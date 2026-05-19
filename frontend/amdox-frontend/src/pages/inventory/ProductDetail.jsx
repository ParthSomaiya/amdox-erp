import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ProductDetail({ id }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/inventory/product/${id}`).then((res) =>
      setProduct(res.data)
    );
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">
        {product.name}
      </h1>

      <p>SKU: {product.sku}</p>
      <p>Price: ₹{product.price}</p>

      <p className="text-green-600 font-bold">
        Stock: {product.stock}
      </p>
    </div>
  );
}