import { useParams } from "react-router-dom";
import axios from "axios";

export default function ApplyJob() {
  const { id } = useParams();

  const handleApply = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("jobId", id);
    formData.append("resume", e.target.resume.files[0]);

    await axios.post(
      "http://localhost:5000/api/applications/apply",
      formData,
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    alert("Applied!");
  };

  return (
    <form onSubmit={handleApply}>
      <input type="file" name="resume" required />
      <button>Apply</button>
    </form>
  );
}