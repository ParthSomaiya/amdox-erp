import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    API.get("/hr")
      .then((res) => setEmployees(res.data))
      .catch(() => console.log("Error"));
  }, []);

  return (
    <div>
      <h2>Employees</h2>

      <Link to="/add-employee">+ Add Employee</Link>

      {employees.map((e) => (
        <div key={e._id}>
          {e.userId?.name} - {e.position}
        </div>
      ))}
    </div>
  );
}