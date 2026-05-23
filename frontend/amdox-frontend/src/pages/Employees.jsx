import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    API.get(
      `/hr/search?search=${search}`
    ).then((res) =>
      setEmployees(res.data)
    );

  }, [search]);

  useEffect(() => {
    API.get("/hr").then((res) => setEmployees(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-semibold mb-4">Employees</h2>

      <input
        placeholder="Search employee"
        className="border p-2 mb-4 w-full"
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="bg-white shadow rounded">
        {employees.map((e) => (
          <div
            key={e._id}
            className="border-b p-4 flex justify-between"
          >
            <span>{e.userId?.name}</span>
            <span className="text-gray-500">{e.position}</span>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}