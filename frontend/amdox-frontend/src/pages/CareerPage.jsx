import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CareerPage() {
  const { companyId } = useParams();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/jobs/company/${companyId}`)
      .then(res => setJobs(res.data));
  }, [companyId]);

  return (
    <div>
      <h2>Company Careers</h2>

      {jobs.map(job => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>

          <a href={`/apply/${job._id}`}>Apply</a>
        </div>
      ))}
    </div>
  );
}

export default CareerPage;