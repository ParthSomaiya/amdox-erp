import { useEffect, useState } from "react";
import axios from "axios";

export default function TenantManagement() {
  const [tenants, setTenants] = useState([]);
  const [name, setName] = useState("");

  const fetchTenants = async () => {
    const res = await axios.get("/api/admin/tenant");
    setTenants(res.data);
  };

  const createTenant = async () => {
    await axios.post("/api/admin/tenant", { name });
    setName("");
    fetchTenants();
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏢 Tenant Management</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tenant Name"
          className="border p-2 mr-2"
        />
        <button
          onClick={createTenant}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Tenant
        </button>
      </div>

      <div className="space-y-2">
        {tenants.map((t) => (
          <div
            key={t._id}
            className="p-3 bg-gray-100 rounded flex justify-between"
          >
            <span>{t.name}</span>
            <span>{t.active ? "🟢 Active" : "🔴 Inactive"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}