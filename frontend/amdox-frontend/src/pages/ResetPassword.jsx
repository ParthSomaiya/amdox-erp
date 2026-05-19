import {

  useState,

} from "react";

import {

  useParams,

  useNavigate,

} from "react-router-dom";

import api
from "../utils/axiosInstance";

export default function ResetPassword() {

  const {
    token,
  } = useParams();

  const navigate =
    useNavigate();

  const [password,
    setPassword] =
    useState("");

  const submit = async () => {

    try {

      await api.post(

        "/auth/reset-password",

        {
          token,
          password,
        }

      );

      alert(
        "Password updated"
      );

      navigate("/login");

    } catch (err) {

      alert(
        err.response.data.message
      );

    }

  };

  return (

    <div className="p-10">

      <h1 className="text-2xl mb-4">
        Reset Password
      </h1>

      <input

        type="password"

        placeholder="New Password"

        className="border p-2"

        onChange={(e) =>
          setPassword(e.target.value)
        }

      />

      <button

        onClick={submit}

        className="bg-green-500 text-white px-4 py-2 ml-2"

      >
        Reset Password
      </button>

    </div>

  );

}