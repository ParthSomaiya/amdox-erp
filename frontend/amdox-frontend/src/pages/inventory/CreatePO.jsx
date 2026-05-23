import { useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function CreatePO() {

  const [vendor, setVendor] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const createPO = async () => {

    try {

      await API.post("/inventory/purchase-order", {

        vendor,
        product,
        quantity,

      });

      alert("Purchase Order Created");

      setVendor("");
      setProduct("");
      setQuantity("");

    } catch (err) {

      console.log(err);

      alert("Error creating PO");

    }

  };

  return (

    <MainLayout>

      <div className="p-6 bg-white rounded shadow">

        <h2 className="text-2xl font-bold mb-5">
          Create Purchase Order
        </h2>

        <input
          value={vendor}
          onChange={(e) =>
            setVendor(e.target.value)
          }
          placeholder="Vendor"
          className="border p-2 w-full mb-3"
        />

        <input
          value={product}
          onChange={(e) =>
            setProduct(e.target.value)
          }
          placeholder="Product"
          className="border p-2 w-full mb-3"
        />

        <input
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          placeholder="Quantity"
          type="number"
          className="border p-2 w-full mb-3"
        />

        <button
          onClick={createPO}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create PO
        </button>

      </div>

    </MainLayout>

  );

}