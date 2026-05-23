import { useEffect, useState }
from "react";

import API
from "../services/api";

export default function BillingReports() {

  const [reports, setReports] =
    useState([]);

  useEffect(() => {

    API.get("/finance/reports")
      .then((res) =>
        setReports(res.data)
      );

  }, []);

  return (

    <div>

      <h2>Billing Reports</h2>

      {reports.map((r) => (

        <div key={r._id}>

          {r.month}
          -
          ₹{r.total}

        </div>

      ))}

    </div>

  );

}