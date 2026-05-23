import { useState } from "react";
import API from "../../services/api";
import MainLayout from "../../layouts/MainLayout";

export default function SecuritySettings() {

  const [passwordMinLength,
    setPasswordMinLength] =
      useState(8);

  const [enable2FA,
    setEnable2FA] =
      useState(false);

  const save = async () => {

    await API.post(
      "/admin/settings",
      {
        securitySettings: {
          passwordMinLength,
          enable2FA,
        },
      }
    );

    alert("Security settings saved");

  };

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-5">
        Security Settings
      </h1>

      <div className="bg-white p-5 shadow rounded">

        <input
          type="number"
          value={passwordMinLength}
          onChange={(e) =>
            setPasswordMinLength(
              e.target.value
            )
          }
          className="border p-2 mb-4 w-full"
        />

        <label className="flex items-center gap-2 mb-4">

          <input
            type="checkbox"
            checked={enable2FA}
            onChange={(e) =>
              setEnable2FA(
                e.target.checked
              )
            }
          />

          Enable 2FA

        </label>

        <button
          onClick={save}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Save
        </button>

      </div>

    </MainLayout>
  );
}