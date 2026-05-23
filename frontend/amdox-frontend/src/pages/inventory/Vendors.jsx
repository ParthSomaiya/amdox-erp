import { useEffect, useState } from "react";

import API from "../../services/api";

export default function Vendors() {

  const [vendors, setVendors] =
    useState([]);

  useEffect(() => {

    API.get("/vendor")
      .then((res) =>
        setVendors(res.data)
      );

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-5">
        Vendors
      </h2>

      {vendors.map((v) => (

        <div
          key={v._id}
          className="bg-white p-4 shadow rounded mb-3"
        >

          <p>{v.name}</p>

          <p>{v.email}</p>

        </div>

      ))}

    </div>

  );

}