import { useEffect, useState } from "react";
import { FileText, Eye, Loader2, ShieldAlert, Upload, X, Check } from "lucide-react";
import { createPortal } from "react-dom";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [resumeFile, setResumeFile] = useState(null); // 🔹 ઉમેરેલ: રિઝ્યુમ ફાઇલ સ્ટેટ
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = () => {
    setLoading(true);
    API.get("/hr/employees")
      .then((res) => setDocs(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const openUploadModal = (emp) => {
    setSelectedEmp(emp);
    setResumeFile(null); // રિસેટ કરો
    setAadhaarFile(null);
    setPanFile(null);
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile && !aadhaarFile && !panFile) {
      alert("Please select at least one document to upload.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      if (resumeFile) formData.append("resume", resumeFile); // 🔹 રિઝ્યુમ અપલોડ સપોર્ટ
      if (aadhaarFile) formData.append("aadhaar", aadhaarFile);
      if (panFile) formData.append("pan", panFile);

      await API.put(`/hr/employee/${selectedEmp._id}/docs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Documents uploaded successfully!");
      notifier.documentVerified(selectedEmp?.userId?.name, "Aadhaar/PAN/Resume");
      setShowUploadModal(false);
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <h1 className="text-3xl font-black flex items-center gap-2">📂 Employee Documents</h1>
        <p className="mt-2 text-indigo-100 text-sm">Secure terminal for employee resumes, Aadhaar cards, and PAN verification.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : docs.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border space-y-4">
          <ShieldAlert size={48} className="mx-auto text-slate-300" />
          <h3 className="text-lg font-bold text-slate-700">No Documents Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((d) => (
            <div key={d._id} className="bg-white border rounded-3xl p-6 shadow-sm space-y-5 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">{d.userId?.name || "Employee"}</h3>
                <p className="text-xs text-slate-400 mt-1">{d.position || "Staff Member"}</p>
              </div>

              <div className="space-y-2.5 pt-4 border-t">
                {/* Resume */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" /> Resume / CV
                  </span>
                  {d.resume ? (
                    <a
                      href={`http://localhost:5000/${d.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      <Eye size={12} /> View
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pending</span>
                  )}
                </div>

                {/* Aadhaar */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" /> Aadhaar Card
                  </span>
                  {d.aadhaar ? (
                    <a
                      href={`http://localhost:5000/${d.aadhaar}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      <Eye size={12} /> View
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pending</span>
                  )}
                </div>

                {/* PAN */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" /> PAN Card
                  </span>
                  {d.pan ? (
                    <a
                      href={`http://localhost:5000/${d.pan}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      <Eye size={12} /> View
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pending</span>
                  )}
                </div>
              </div>

              {/* Upload Action */}
              <button
                onClick={() => openUploadModal(d)}
                className="w-full h-10 mt-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Upload size={14} /> Upload Documents
              </button>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Upload size={20} className="text-indigo-600" /> Upload Verification Documents
              </h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400"><X size={18} /></button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* 🔹 નવું ઉમેરેલું: Resume / CV ફાઇલ ઇનપુટ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resume / CV (PDF / Image)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Aadhaar Card (PDF / Image)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setAadhaarFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">PAN Card (PDF / Image)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setPanFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}