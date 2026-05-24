import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

export default function ProductDetails() {

  const [product,
    setProduct] =
    useState(null);

  useEffect(() => {

    loadProduct();

  }, []);

  const loadProduct =
    async () => {

      const res =
        await API.get(
          "/products/1"
        );

      setProduct(
        res.data
      );

    };

  if (!product)
    return null;

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-5">

        {product.name}

      </h1>

      <img
        src={product.qrCode}
        alt="QR"
        className="w-52"
      />

    </div>

  );

}