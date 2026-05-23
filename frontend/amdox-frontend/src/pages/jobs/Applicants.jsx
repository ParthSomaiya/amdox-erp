import { useEffect, useState } from "react";

import API from "../../services/api";

export default function Applicants() {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    API.get(
      "/jobs/applicants"
    ).then((res) =>
      setData(res.data)
    );

  }, []);

  const updateStatus =
    async (id, status) => {

      await API.put(
        `/jobs/applicant/${id}`,
        { status }
      );

      window.location.reload();

    };

  return (

    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6">
        Applicants
      </h2>

      <div className="space-y-4">

        {data.map((a) => (

          <div
            key={a._id}
            className="bg-white p-5 rounded shadow"
          >

            <h3 className="text-xl font-bold">
              {a.name}
            </h3>

            <p>{a.email}</p>

            <p>
              Applied For:
              {" "}
              {a.jobId?.title}
            </p>

            <p>
              Status:
              {" "}
              {a.status}
            </p>

            <a
              href={`http://localhost:5000/${a.resume}`}
              target="_blank"
              className="text-blue-600"
            >
              View Resume
            </a>

            <div className="flex gap-2 mt-4">

              <button
                onClick={() =>
                  updateStatus(
                    a._id,
                    "SHORTLISTED"
                  )
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Shortlist
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    a._id,
                    "INTERVIEW"
                  )
                }
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Interview
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    a._id,
                    "HIRED"
                  )
                }
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Hire
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}