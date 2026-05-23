import { useState } from "react";

import API from "../../services/api";

export default function AddProduct() {

  const [form, setForm] =
    useState({

      name: "",
      price: "",
      stock: "",

    });

  const submit = async () => {

    await API.post(
      "/inventory/product",
      form
    );

    alert("Product Added");

  };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-5">
        Add Product
      </h2>

      <input
        placeholder="Product Name"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        placeholder="Price"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            price: e.target.value,
          })
        }
      />

      <input
        placeholder="Stock"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            stock: e.target.value,
          })
        }
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Product
      </button>

    </div>

  );

}