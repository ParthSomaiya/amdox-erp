import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      email: "",
      password: "",

    });

  // ================= LOGIN =================

  const submit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post(

        "/auth/login",

        form

      );

      // ================= SAVE =================

      localStorage.setItem(

        "token",

        res.data.accessToken

      );

      localStorage.setItem(

        "refreshToken",

        res.data.refreshToken

      );

      localStorage.setItem(

        "user",

        JSON.stringify(
          res.data.user
        )

      );

      // ================= ROLE =================

      const role =
        res.data.user.role;

      // ADMIN
      if (role === "ADMIN") {

        navigate("/dashboard");

      }

      // HR
      else if (role === "HR") {

        navigate("/employees");

      }

      // FINANCE
      else if (role === "FINANCE") {

        navigate("/payroll-dashboard");

      }

      // EMPLOYEE
      else if (role === "EMPLOYEE") {

        navigate("/employee-dashboard");

      }

      // JOB SEEKER
      else if (role === "JOB_SEEKER") {

        navigate("/careers");

      }

      else {

        navigate("/");

      }

    } catch (err) {

      console.log(err);

      alert(

        err.response?.data?.message ||

        "Login Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-slate-900">

      <form

        onSubmit={submit}

        className="bg-slate-800 p-8 rounded-2xl shadow-lg w-[400px]"

      >

        <h2 className="text-3xl font-bold text-white text-center mb-6">

          Login

        </h2>

        <input

          type="email"

          placeholder="Email"

          className="w-full p-3 rounded bg-slate-700 text-white mb-4 outline-none"

          value={form.email}

          onChange={(e) =>

            setForm({

              ...form,

              email:
                e.target.value,

            })

          }

        />

        <input

          type="password"

          placeholder="Password"

          className="w-full p-3 rounded bg-slate-700 text-white mb-5 outline-none"

          value={form.password}

          onChange={(e) =>

            setForm({

              ...form,

              password:
                e.target.value,

            })

          }

        />

        <button

          type="submit"

          disabled={loading}

          className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all text-white py-3 rounded-xl font-bold"

        >

          {

            loading

              ? "Logging in..."

              : "Login"

          }

        </button>

      </form>

    </div>

  );

}