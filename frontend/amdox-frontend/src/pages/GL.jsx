import { useEffect, useState } from "react";
import API from "../services/api";

export default function GL() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    API.get("/gl").then((res) => setEntries(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">General Ledger</h2>

      {entries.map((e) => (
        <div key={e._id} className="bg-white p-4 mb-3 shadow rounded">
          <p className="font-semibold">{e.description}</p>
          {e.entries.map((item, i) => (
            <div key={i} className="text-sm flex justify-between">
              <span>{item.account}</span>
              <span>
                {item.debit} / {item.credit}
              </span>
            </div>
          ))}
        </div>
      ))}
    </MainLayout>
  );
}