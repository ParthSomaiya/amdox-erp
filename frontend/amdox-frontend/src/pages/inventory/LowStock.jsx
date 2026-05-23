import { useEffect, useState } from "react";

import API from "../../services/api";

export default function LowStock() {

  const [products, setProducts] =
    useState([]);

  useEffect(() => {

    API.get(
      "/inventory/low-stock"
    ).then((res) =>
      setProducts(res.data)
    );

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold text-red-600 mb-5">
        Low Stock Alerts
      </h2>

      {products.map((p) => (

        <div
          key={p._id}
          className="bg-red-100 p-4 rounded mb-3"
        >

          <p>{p.name}</p>

          <p>
            Remaining:
            {p.stock}
          </p>

        </div>

      ))}

    </div>

  );

}