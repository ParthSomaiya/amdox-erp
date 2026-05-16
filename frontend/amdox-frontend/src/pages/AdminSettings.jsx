import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function AdminSettings() {
  const handleBackup = async () => {
    await API.get("/admin/backup");
    alert("Backup started");
  };

  return (
    <MainLayout>
      <h2 className="text-xl mb-4">Admin Settings</h2>

      <button
        onClick={handleBackup}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Backup Database
      </button>
    </MainLayout>
  );
}