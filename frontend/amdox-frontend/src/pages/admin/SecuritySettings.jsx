import { useState } from "react";

export default function SecuritySettings() {
  const [minLength, setMinLength] = useState(8);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔐 Security Settings</h1>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block font-semibold">Password Min Length</label>
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(e.target.value)}
            className="border p-2 w-40"
          />
        </div>

        <div>
          <label className="block font-semibold">Two Factor Auth</label>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`px-4 py-2 rounded ${
              twoFA ? "bg-green-600 text-white" : "bg-gray-400"
            }`}
          >
            {twoFA ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  );
}