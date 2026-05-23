import { useState } from "react";

import API from "../../services/api";

export default function CreateProject() {

  const [form, setForm] =
    useState({

      name: "",
      description: "",

    });

  const submit =
    async () => {

      await API.post(
        "/projects",
        form
      );

      alert(
        "Project Created"
      );

    };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-5">
        Create Project
      </h2>

      <input
        placeholder="Project Name"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            name:
              e.target.value,
          })
        }
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            description:
              e.target.value,
          })
        }
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create
      </button>

    </div>

  );

}