import { useState }
from "react";

import { useParams }
from "react-router-dom";

import API from "../services/api";

export default function ResetPassword() {

  const { token } =
    useParams();

  const [password, setPassword] =
    useState("");

  const handleReset =
    async () => {

      try {

        await api.post(

          `/auth/reset-password/${token}`,

          {
            password,
          }

        );

        alert(
          "Password reset successful"
        );

      } catch (err) {

        alert(
          "Reset failed"
        );

      }

    };

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-96">

        <h1 className="text-2xl font-bold mb-5">

          Reset Password

        </h1>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 mb-4"
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >

          Reset Password

        </button>

      </div>

    </div>

  );

}