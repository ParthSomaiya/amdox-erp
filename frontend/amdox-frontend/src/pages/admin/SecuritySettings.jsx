import { useState } from "react";

export default function SecuritySettings() {
  const [minLength, setMinLength] = useState(8);
  const [twoFA, setTwoFA] = useState(false);
  const [jwtExpiry, setJwtExpiry] = useState(15);
  const [loginLimit, setLoginLimit] = useState(5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        🔐 Security Settings
      </h1>

      <div className="bg-white p-4 rounded shadow space-y-5">

        {/* PASSWORD POLICY */}
        <div>
          <label className="block font-semibold">
            Password Min Length
          </label>
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(e.target.value)}
            className="border p-2 w-40"
          />
        </div>

        {/* JWT EXPIRY */}
        <div>
          <label className="block font-semibold">
            JWT Expiry (minutes)
          </label>
          <input
            type="number"
            value={jwtExpiry}
            onChange={(e) => setJwtExpiry(e.target.value)}
            className="border p-2 w-40"
          />
        </div>

        {/* 2FA */}
        <div>
          <label className="block font-semibold">
            Two Factor Auth
          </label>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`px-4 py-2 rounded ${
              twoFA ? "bg-green-600 text-white" : "bg-gray-400"
            }`}
          >
            {twoFA ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* LOGIN LIMIT */}
        <div>
          <label className="block font-semibold">
            Login Attempt Limit
          </label>
          <input
            type="number"
            value={loginLimit}
            onChange={(e) => setLoginLimit(e.target.value)}
            className="border p-2 w-40"
          />
        </div>

      </div>
    </div>
  );
}