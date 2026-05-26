import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function JobRegister() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/register-job",
        form
      );

      alert(
        "Registration successful. Please login."
      );

      navigate("/login");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={submit}
        className="bg-white shadow p-8 rounded w-96 space-y-4"
      >

        <h2 className="text-2xl font-bold text-center">
          Job Seeker Register
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-3 w-full rounded"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full rounded"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full rounded"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button className="bg-green-600 text-white w-full py-3 rounded">
          Register
        </button>

      </form>

    </div>

  );

}