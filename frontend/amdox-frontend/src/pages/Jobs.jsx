export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/jobs").then(res => setJobs(res.data));
  }, []);

  const apply = (id) => {
    API.post("/applications/apply", { jobId: id });
  };

  return (
    <div>
      <h2>Jobs</h2>
      {jobs.map(j => (
        <div key={j._id}>
          {j.title}
          <button onClick={() => apply(j._id)}>Apply</button>
        </div>
      ))}
    </div>
  );
}