import {
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";

export default function Login() {

  const navigate =
    useNavigate();

  // ================= STATE =================

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      email: "",
      password: "",

    });

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  // ================= SUBMIT =================

  const submit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res =
        await API.post(
          "/auth/login",
          {
            email:
              form.email.trim(),

            password:
              form.password,
          }
        );

      // ================= STORE =================

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

      // ================= ROLE REDIRECT =================

      const role =
        res.data.user.role;

      if (
        role === "EMPLOYEE"
      ) {

        navigate(
          "/employee-dashboard",
          {
            replace: true,
          }
        );

      } else {

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );

      }

    } catch (err) {

      console.log(err);

      alert(

        err.response?.data
          ?.message ||

        "Login Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#020617]
        relative
        overflow-hidden
        px-6
      "
    >

      {/* GLOW */}

      <div
        className="
          absolute
          w-[500px]
          h-[500px]
          bg-cyan-500/20
          blur-[120px]
          rounded-full
          -top-32
          -left-32
        "
      />

      <div
        className="
          absolute
          w-[500px]
          h-[500px]
          bg-blue-500/20
          blur-[120px]
          rounded-full
          bottom-0
          right-0
        "
      />

      {/* CARD */}

      <form

        onSubmit={submit}

        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[32px]
          bg-white/[0.05]
          border
          border-white/10
          backdrop-blur-2xl
          p-10
          shadow-2xl
        "
      >

        {/* LOGO */}

        <div className="mb-10">

          <h1
            className="
              text-5xl
              font-black
              text-white
            "
          >

            AMDOX

          </h1>

          <p
            className="
              text-slate-400
              mt-3
            "
          >

            Enterprise ERP Platform

          </p>

        </div>

        {/* FORM */}

        <div className="space-y-5">

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
            className="
              w-full
              h-14
              rounded-2xl
              bg-white/[0.05]
              border
              border-white/10
              px-5
              text-white
              outline-none
              placeholder:text-slate-500
              focus:border-cyan-500
            "
          />

          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
            className="
              w-full
              h-14
              rounded-2xl
              bg-white/[0.05]
              border
              border-white/10
              px-5
              text-white
              outline-none
              placeholder:text-slate-500
              focus:border-cyan-500
            "
          />

          {/* BUTTON */}

          <button

            type="submit"

            disabled={loading}

            className="
              w-full
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-bold
              text-lg
              hover:scale-[1.02]
              transition-all
              duration-300
            "
          >

            {
              loading
                ? "Authenticating..."
                : "Login To Dashboard"
            }

          </button>

          {/* FORGOT */}

          <div className="text-center pt-3">

            <Link

              to="/forgot-password"

              className="
                text-cyan-400
                hover:text-cyan-300
                text-sm
              "
            >

              Forgot Password ?

            </Link>

          </div>

        </div>

      </form>

    </div>

  );

}