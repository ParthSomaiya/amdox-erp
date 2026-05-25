import { useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../../services/api";

export default function EmployeeRegister() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({

    name: "",
    email: "",
    password: "",

  });

  const submit = async (e) => {

    e.preventDefault();

    try {

      // =========================
      // INVITE REGISTER
      // =========================

      if (token) {

        await API.post(

          `/auth/register-invite/${token}`,

          {
            name: form.name,
            password: form.password,
          }

        );

        alert("Employee account created");

      }

      // =========================
      // NORMAL REGISTER
      // =========================

      else {

        await API.post(

          "/auth/register-user",

          {
            name: form.name,
            email: form.email,
            password: form.password,
          }

        );

        alert("Employee Registered");

      }

      navigate("/login");

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={submit}
        className="bg-white shadow p-8 rounded w-96 space-y-4"
      >

        <h2 className="text-2xl font-bold text-center">

          {token
            ? "Complete Employee Invite"
            : "Employee Register"}

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

        {/* EMAIL ONLY NORMAL REGISTER */}

        {!token && (

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

        )}

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

        <button
          className="bg-blue-600 text-white w-full py-3 rounded"
        >

          {token
            ? "Create Account"
            : "Register"}

        </button>

      </form>

    </div>

  );

}