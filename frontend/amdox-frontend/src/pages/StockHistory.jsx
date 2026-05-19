import { useEffect, useState } from "react";
import API from "../services/api";

export default function StockHistory() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    try {

      const res =
        await API.get("/inventory/history");

      setHistory(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        📦 Stock History
      </h1>

      <div className="space-y-4">

        {history.map((item) => (

          <div
            key={item._id}
            className="bg-white p-4 rounded shadow"
          >

            <h2 className="font-bold">
              {item.productName}
            </h2>

            <p>
              Quantity:
              {" "}
              {item.quantity}
            </p>

            <p>
              Type:
              {" "}
              {item.type}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}