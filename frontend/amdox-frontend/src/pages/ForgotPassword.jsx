import { useState }
from "react";

import api
from "../utils/axiosInstance";

export default function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const submit = async () => {

    try {

      await api.post(

        "/auth/forgot-password",

        { email }

      );

      alert(
        "Reset email sent"
      );

    } catch (err) {

      alert(
        err.response.data.message
      );

    }

  };

  return (

    <div className="p-10">

      <h1 className="text-2xl mb-4">
        Forgot Password
      </h1>

      <input

        type="email"

        placeholder="Email"

        className="border p-2"

        onChange={(e) =>
          setEmail(e.target.value)
        }

      />

      <button

        onClick={submit}

        className="bg-blue-500 text-white px-4 py-2 ml-2"

      >
        Send Reset Link
      </button>

    </div>

  );

}