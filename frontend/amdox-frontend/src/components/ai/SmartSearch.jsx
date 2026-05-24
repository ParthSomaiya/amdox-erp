import {
  useState,
} from "react";

export default function SmartSearch() {

  const [query,
    setQuery] =
    useState("");

  return (

    <div className="bg-white p-4 rounded shadow">

      <input
        type="text"
        placeholder="Smart Search..."
        value={query}
        onChange={(e) =>
          setQuery(
            e.target.value
          )
        }
        className="w-full border p-3 rounded"
      />

    </div>

  );

}