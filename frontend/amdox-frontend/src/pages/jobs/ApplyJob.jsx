import { useState } from "react";

import API from "../../services/api";

import { useParams }
from "react-router-dom";

export default function ApplyJob() {

  const { id } =
    useParams();

  const [form, setForm] =
    useState({

      name: "",
      email: "",
      phone: "",

    });

  const [resume, setResume] =
    useState(null);

  const submit =
    async (e) => {

      e.preventDefault();

      const data =
        new FormData();

      data.append(
        "name",
        form.name
      );

      data.append(
        "email",
        form.email
      );

      data.append(
        "phone",
        form.phone
      );

      data.append(
        "resume",
        resume
      );

      await API.post(
        `/jobs/apply/${id}`,
        data
      );

      alert(
        "Application Submitted"
      );

    };

  return (

    <div className="p-6 max-w-xl mx-auto">

      <h2 className="text-3xl font-bold mb-6">
        Apply Job
      </h2>

      <form
        onSubmit={submit}
        className="space-y-4"
      >

        <input
          placeholder="Full Name"
          className="border p-3 w-full rounded"
          onChange={(e) =>
            setForm({
              ...form,
              name:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          className="border p-3 w-full rounded"
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Phone"
          className="border p-3 w-full rounded"
          onChange={(e) =>
            setForm({
              ...form,
              phone:
                e.target.value,
            })
          }
        />

        <input
          type="file"
          onChange={(e) =>
            setResume(
              e.target.files[0]
            )
          }
        />

        <button
          className="bg-blue-600 text-white px-5 py-3 rounded"
        >
          Submit
        </button>

      </form>

    </div>

  );

}