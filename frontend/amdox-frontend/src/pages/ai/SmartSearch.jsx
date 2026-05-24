import { useState } from "react";
import API from "../../services/api";

export default function SmartSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const search = async () => {
    const res = await API.post("/ai/chat", {
      message: `Search ERP data: ${query}`,
    });

    setResult(res.data.reply);
  };

  return (
    <div className="p-4">
      <input
        className="border p-2 w-full"
        placeholder="Smart search..."
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={search} className="bg-green-600 text-white px-4 py-2 mt-2">
        Search
      </button>

      <div className="mt-4">{result}</div>
    </div>
  );
}