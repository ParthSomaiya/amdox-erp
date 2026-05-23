import { useEffect, useState } from "react";
import API from "../../services/api";
import MainLayout from "../../layouts/MainLayout";

export default function AdminSettings() {

  const [settings, setSettings] =
    useState({
      companySettings: {},
    });

  useEffect(() => {

    API.get("/admin/settings")
      .then((res) => {
        if (res.data) {
          setSettings(res.data);
        }
      });

  }, []);

  const save = async () => {

    await API.post(
      "/admin/settings",
      settings
    );

    alert("Settings saved");

  };

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-5">
        Admin Settings
      </h1>

      <input
        placeholder="Company Name"
        className="border p-2 w-full mb-3"
        value={
          settings.companySettings
            ?.companyName || ""
        }
        onChange={(e) =>
          setSettings({
            ...settings,
            companySettings: {
              ...settings.companySettings,
              companyName:
                e.target.value,
            },
          })
        }
      />

      <button
        onClick={save}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Save Settings
      </button>

    </MainLayout>
  );
}