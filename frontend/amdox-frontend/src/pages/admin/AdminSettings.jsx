import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    API.get("/admin/settings").then((res) => {
      setSettings(res.data);
    });
  }, []);

  const updateSetting = async (key, value) => {
    await API.post("/admin/settings", { key, value });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">⚙️ Admin Settings</h1>

      {settings.map((s) => (
        <div key={s._id} className="mt-4">
          <label>{s.key}</label>

          <input
            className="border p-2 ml-2"
            defaultValue={s.value}
            onBlur={(e) =>
              updateSetting(s.key, e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
}