import axios from "axios";
import { useState } from "react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const runBackup = async () => {
    try {
      setLoading(true);
      await axios.post("/api/admin/backup");
      setMsg("✅ Backup triggered successfully");
    } catch (err) {
      setMsg("❌ Backup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚙️ Admin Settings</h1>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <button
          onClick={runBackup}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Running..." : "Run Backup Now"}
        </button>

        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}