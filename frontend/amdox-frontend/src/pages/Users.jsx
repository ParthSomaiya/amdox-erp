import { useEffect, useState } from "react";
import API from "../services/api";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {

    const res = await API.get("/admin/users");

    setUsers(res.data);

  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {

    await API.delete(`/admin/users/${id}`);

    loadUsers();

  };

  const suspendUser = async (id) => {

    await API.put(
      `/admin/users/${id}/suspend`
    );

    loadUsers();

  };

  const activateUser = async (id) => {

    await API.put(
      `/admin/users/${id}/activate`
    );

    loadUsers();

  };

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-5">
        Users Management
      </h1>

      <input
        placeholder="Search user..."
        className="border p-2 mb-4 w-full"
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <table className="w-full bg-white shadow">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {users
            .filter((u) =>
              u.name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )
            .map((u) => (

              <tr key={u._id}>

                <td>{u.name}</td>

                <td>{u.email}</td>

                <td>{u.role}</td>

                <td>
                  {u.isActive
                    ? "🟢 Active"
                    : "🔴 Suspended"}
                </td>

                <td className="space-x-2">

                  <button
                    onClick={() =>
                      deleteUser(u._id)
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>

                  {u.isActive ? (
                    <button
                      onClick={() =>
                        suspendUser(u._id)
                      }
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        activateUser(u._id)
                      }
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Activate
                    </button>
                  )}

                </td>

              </tr>

            ))}

        </tbody>

      </table>

    </MainLayout>
  );
}