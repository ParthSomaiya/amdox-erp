import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

export default function Careers() {

  const [jobs, setJobs] =
    useState([]);

  useEffect(() => {

    API.get("/jobs")
      .then((res) =>
        setJobs(res.data)
      );

  }, []);

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Careers
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {jobs.map((job) => (

          <div
            key={job._id}
            className="bg-white p-6 rounded shadow"
          >

            <h2 className="text-2xl font-bold">
              {job.title}
            </h2>

            <p className="mt-3 text-gray-600">
              {job.description}
            </p>

            <p className="mt-3">
              Salary:
              ₹{job.salary}
            </p>

            <a
              href={`/apply/${job._id}`}
              className="mt-5 inline-block bg-blue-600 text-white px-5 py-2 rounded"
            >
              Apply
            </a>

          </div>

        ))}

      </div>

    </div>

  );

}
