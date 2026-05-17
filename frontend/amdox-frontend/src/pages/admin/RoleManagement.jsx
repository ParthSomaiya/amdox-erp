import { useEffect, useState } from "react";
import axios from "axios";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/roles").then(res => {
      setRoles(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Role Management</h1>

      {roles.map(role => (
        <div key={role._id} className="mb-4 border p-3">
          <h2 className="font-bold">{role.name}</h2>

          <ul>
            {role.permissions.map(p => (
              <li key={p._id}>✔ {p.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}