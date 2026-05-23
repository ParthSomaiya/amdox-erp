import { useEffect, useState } from "react";

import API from "../../services/api";

export default function Documents() {

  const [docs, setDocs] =
    useState([]);

  useEffect(() => {

    API.get("/employees")
      .then((res) =>
        setDocs(res.data)
      );

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Employee Documents
      </h2>

      <div className="grid md:grid-cols-3 gap-5">

        {docs.map((d) => (

          <div
            key={d._id}
            className="bg-white rounded shadow p-4"
          >

            <h3 className="font-bold mb-3">
              {d.userId?.name}
            </h3>

            {d.resume && (

              <a
                href={`http://localhost:5000/${d.resume}`}
                target="_blank"
                className="text-blue-600 block"
              >
                View Resume
              </a>

            )}

            {d.aadhaar && (

              <a
                href={`http://localhost:5000/${d.aadhaar}`}
                target="_blank"
                className="text-blue-600 block"
              >
                View Aadhaar
              </a>

            )}

            {d.pan && (

              <a
                href={`http://localhost:5000/${d.pan}`}
                target="_blank"
                className="text-blue-600 block"
              >
                View PAN
              </a>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}