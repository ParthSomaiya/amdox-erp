import { useEffect, useState } from "react";

import API from "../../services/api";

import { Link } from "react-router-dom";

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

    <div className="p-6">

      <h2 className="text-4xl font-bold mb-8">
        🚀 Careers
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {jobs.map((job) => (

          <div
            key={job._id}
            className="bg-white p-6 rounded shadow"
          >

            <h3 className="text-2xl font-bold">
              {job.title}
            </h3>

            <p className="mt-2">
              {job.description}
            </p>

            <p className="mt-3 text-gray-500">
              📍 {job.location}
            </p>

            <p className="mt-2 font-bold">
              ₹ {job.salary}
            </p>

            <Link
              to={`/jobs/apply/${job._id}`}
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Apply Now
            </Link>

          </div>

        ))}

      </div>

    </div>

  );

}