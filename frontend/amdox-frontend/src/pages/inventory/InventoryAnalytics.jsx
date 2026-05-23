import { useEffect, useState } from "react";

import API from "../../services/api";

export default function InventoryAnalytics() {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    API.get("/inventory/product")
      .then((res) =>
        setData(res.data)
      );

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold">
        Inventory Analytics
      </h2>

      <p className="mt-4">
        Total Products:
        {data.length}
      </p>

    </div>

  );

}