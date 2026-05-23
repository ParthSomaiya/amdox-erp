import { useState } from "react";
import API from "../services/api";

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/hr/add", { name, email, position });
      alert("Employee Added");
    } catch (err) {
      alert("Error adding employee");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded">

      <h2 className="text-2xl font-bold mb-5">
        Add Employee
      </h2>

      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Name"
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Position"
        onChange={(e) =>
          setPosition(e.target.value)
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Add Employee
      </button>

    </div>
  );
}