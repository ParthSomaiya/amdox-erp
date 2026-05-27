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

  const submit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/login",
        form
      );

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

      navigate("/dashboard");

    } catch (err) {

      alert(
        err.response?.data?.message ||
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
        relative
        overflow-hidden
        px-6
      "
    >

      {/* BACKGROUND */}

      <div
        className="
          absolute
          w-[500px]
          h-[500px]
          bg-blue-500/20
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
          bg-purple-500/20
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
          glass
          w-full
          max-w-md
          rounded-[32px]
          p-10
          relative
          z-10
        "
      >

        <div className="mb-10">

          <h1
            className="
              text-5xl
              font-black
              gradient-text
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

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Enter Email"
            className="premium-input"
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
            placeholder="Enter Password"
            className="premium-input"
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
            className="
              primary-btn
              w-full
              py-4
              text-white
              font-bold
              text-lg
            "
          >

            {
              loading
                ? "Authenticating..."
                : "Login To Dashboard"
            }

          </button>

        </div>

      </form>

    </div>

  );

}