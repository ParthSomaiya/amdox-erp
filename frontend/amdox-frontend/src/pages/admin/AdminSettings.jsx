import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  Mail,
  Phone,
  Globe,
  Save,
  Shield,
  Bell,
  Palette,
  Settings2,
} from "lucide-react";

import API from "../../services/api";

import MainLayout from "../../layouts/MainLayout";

export default function AdminSettings() {

  // ================= STATE =================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [settings, setSettings] =
    useState({

      companySettings: {

        companyName: "",
        email: "",
        phone: "",
        website: "",
        address: "",

      },

      systemSettings: {

        maintenanceMode: false,
        emailNotifications: true,
        darkMode: false,

      },

    });

  // ================= FETCH SETTINGS =================

  useEffect(() => {

    fetchSettings();

  }, []);

  const fetchSettings =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/admin/settings"
          );

        if (res.data) {

          setSettings({

            companySettings: {

              companyName:
                res.data
                  ?.companySettings
                  ?.companyName || "",

              email:
                res.data
                  ?.companySettings
                  ?.email || "",

              phone:
                res.data
                  ?.companySettings
                  ?.phone || "",

              website:
                res.data
                  ?.companySettings
                  ?.website || "",

              address:
                res.data
                  ?.companySettings
                  ?.address || "",

            },

            systemSettings: {

              maintenanceMode:
                res.data
                  ?.systemSettings
                  ?.maintenanceMode || false,

              emailNotifications:
                res.data
                  ?.systemSettings
                  ?.emailNotifications ?? true,

              darkMode:
                res.data
                  ?.systemSettings
                  ?.darkMode || false,

            },

          });

        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= HANDLE INPUT =================

  const handleCompanyChange =
    (field, value) => {

      setSettings((prev) => ({

        ...prev,

        companySettings: {

          ...prev.companySettings,

          [field]: value,

        },

      }));

    };

  // ================= HANDLE TOGGLE =================

  const handleToggle =
    (field) => {

      setSettings((prev) => ({

        ...prev,

        systemSettings: {

          ...prev.systemSettings,

          [field]:
            !prev.systemSettings[field],

        },

      }));

    };

  // ================= SAVE SETTINGS =================

  const saveSettings =
    async () => {

      try {

        setSaving(true);

        await API.post(
          "/admin/settings",
          settings
        );

        alert(
          "Settings saved successfully"
        );

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data
            ?.message ||
          "Failed to save settings"
        );

      } finally {

        setSaving(false);

      }

    };

  // ================= LOADING =================

  if (loading) {

    return (

      <MainLayout>

        <div
          className="
            min-h-[70vh]
            flex
            items-center
            justify-center
          "
        >

          <div className="text-center">

            <div
              className="
                h-16
                w-16
                border-4
                border-blue-500
                border-t-transparent
                rounded-full
                animate-spin
                mx-auto
              "
            />

            <h2
              className="
                text-2xl
                font-black
                mt-6
              "
            >

              Loading Settings...

            </h2>

          </div>

        </div>

      </MainLayout>

    );

  }

  return (

    <MainLayout>

      <div className="space-y-8">

        {/* HERO */}

        <div
          className="
            bg-gradient-to-r
            from-indigo-600
            via-blue-600
            to-cyan-500
            rounded-[32px]
            p-10
            text-white
            shadow-2xl
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-6
            "
          >

            <div>

              <h1
                className="
                  text-5xl
                  font-black
                  tracking-tight
                "
              >

                Admin Settings

              </h1>

              <p
                className="
                  mt-4
                  text-cyan-100
                  text-lg
                "
              >

                Configure company profile
                and system preferences

              </p>

            </div>

            <div
              className="
                h-24
                w-24
                rounded-[28px]
                bg-white/10
                backdrop-blur-xl
                flex
                items-center
                justify-center
                border
                border-white/20
              "
            >

              <Settings2 size={45} />

            </div>

          </div>

        </div>

        {/* COMPANY SETTINGS */}

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-xl
            p-10
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
              mb-10
            "
          >

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-gradient-to-r
                from-blue-500
                to-cyan-500
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Building2 size={30} />

            </div>

            <div>

              <h2
                className="
                  text-3xl
                  font-black
                "
              >

                Company Settings

              </h2>

              <p className="text-gray-500">

                Update organization information

              </p>

            </div>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-8
            "
          >

            {/* COMPANY NAME */}

            <div>

              <label
                className="
                  block
                  font-semibold
                  mb-3
                  text-gray-700
                "
              >

                Company Name

              </label>

              <div className="relative">

                <Building2
                  size={20}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input

                  type="text"

                  value={
                    settings
                      .companySettings
                      .companyName
                  }

                  onChange={(e) =>
                    handleCompanyChange(
                      "companyName",
                      e.target.value
                    )
                  }

                  placeholder="AMDOX ERP"

                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-gray-300
                    pl-14
                    pr-5
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "

                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label
                className="
                  block
                  font-semibold
                  mb-3
                  text-gray-700
                "
              >

                Company Email

              </label>

              <div className="relative">

                <Mail
                  size={20}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input

                  type="email"

                  value={
                    settings
                      .companySettings
                      .email
                  }

                  onChange={(e) =>
                    handleCompanyChange(
                      "email",
                      e.target.value
                    )
                  }

                  placeholder="info@amdoxerp.com"

                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-gray-300
                    pl-14
                    pr-5
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "

                />

              </div>

            </div>

            {/* PHONE */}

            <div>

              <label
                className="
                  block
                  font-semibold
                  mb-3
                  text-gray-700
                "
              >

                Phone Number

              </label>

              <div className="relative">

                <Phone
                  size={20}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input

                  type="text"

                  value={
                    settings
                      .companySettings
                      .phone
                  }

                  onChange={(e) =>
                    handleCompanyChange(
                      "phone",
                      e.target.value
                    )
                  }

                  placeholder="+91 9876543210"

                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-gray-300
                    pl-14
                    pr-5
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "

                />

              </div>

            </div>

            {/* WEBSITE */}

            <div>

              <label
                className="
                  block
                  font-semibold
                  mb-3
                  text-gray-700
                "
              >

                Website

              </label>

              <div className="relative">

                <Globe
                  size={20}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input

                  type="text"

                  value={
                    settings
                      .companySettings
                      .website
                  }

                  onChange={(e) =>
                    handleCompanyChange(
                      "website",
                      e.target.value
                    )
                  }

                  placeholder="www.amdoxerp.com"

                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-gray-300
                    pl-14
                    pr-5
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "

                />

              </div>

            </div>

            {/* ADDRESS */}

            <div className="md:col-span-2">

              <label
                className="
                  block
                  font-semibold
                  mb-3
                  text-gray-700
                "
              >

                Company Address

              </label>

              <textarea

                rows={5}

                value={
                  settings
                    .companySettings
                    .address
                }

                onChange={(e) =>
                  handleCompanyChange(
                    "address",
                    e.target.value
                  )
                }

                placeholder="Enter company address..."

                className="
                  w-full
                  rounded-3xl
                  border
                  border-gray-300
                  p-5
                  outline-none
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  resize-none
                "

              />

            </div>

          </div>

        </div>

        {/* SYSTEM SETTINGS */}

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-xl
            p-10
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
              mb-10
            "
          >

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-gradient-to-r
                from-purple-500
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Shield size={30} />

            </div>

            <div>

              <h2
                className="
                  text-3xl
                  font-black
                "
              >

                System Preferences

              </h2>

              <p className="text-gray-500">

                Configure application behavior

              </p>

            </div>

          </div>

          <div className="space-y-6">

            {/* MAINTENANCE */}

            <div
              className="
                flex
                items-center
                justify-between
                bg-slate-50
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-5
                "
              >

                <div
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    bg-red-100
                    text-red-600
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Shield size={24} />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Maintenance Mode

                  </h3>

                  <p className="text-gray-500">

                    Temporarily disable platform access

                  </p>

                </div>

              </div>

              <button

                onClick={() =>
                  handleToggle(
                    "maintenanceMode"
                  )
                }

                className={`
                  relative
                  h-8
                  w-16
                  rounded-full
                  transition-all
                  ${
                    settings.systemSettings
                      .maintenanceMode
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }
                `}
              >

                <div
                  className={`
                    absolute
                    top-1
                    h-6
                    w-6
                    rounded-full
                    bg-white
                    transition-all
                    ${
                      settings.systemSettings
                        .maintenanceMode
                        ? "left-9"
                        : "left-1"
                    }
                  `}
                />

              </button>

            </div>

            {/* EMAIL NOTIFICATIONS */}

            <div
              className="
                flex
                items-center
                justify-between
                bg-slate-50
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-5
                "
              >

                <div
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Bell size={24} />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Email Notifications

                  </h3>

                  <p className="text-gray-500">

                    Enable automated email alerts

                  </p>

                </div>

              </div>

              <button

                onClick={() =>
                  handleToggle(
                    "emailNotifications"
                  )
                }

                className={`
                  relative
                  h-8
                  w-16
                  rounded-full
                  transition-all
                  ${
                    settings.systemSettings
                      .emailNotifications
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }
                `}
              >

                <div
                  className={`
                    absolute
                    top-1
                    h-6
                    w-6
                    rounded-full
                    bg-white
                    transition-all
                    ${
                      settings.systemSettings
                        .emailNotifications
                        ? "left-9"
                        : "left-1"
                    }
                  `}
                />

              </button>

            </div>

            {/* DARK MODE */}

            <div
              className="
                flex
                items-center
                justify-between
                bg-slate-50
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-5
                "
              >

                <div
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    bg-indigo-100
                    text-indigo-600
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Palette size={24} />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Dark Mode

                  </h3>

                  <p className="text-gray-500">

                    Enable dark appearance mode

                  </p>

                </div>

              </div>

              <button

                onClick={() =>
                  handleToggle(
                    "darkMode"
                  )
                }

                className={`
                  relative
                  h-8
                  w-16
                  rounded-full
                  transition-all
                  ${
                    settings.systemSettings
                      .darkMode
                      ? "bg-indigo-500"
                      : "bg-gray-300"
                  }
                `}
              >

                <div
                  className={`
                    absolute
                    top-1
                    h-6
                    w-6
                    rounded-full
                    bg-white
                    transition-all
                    ${
                      settings.systemSettings
                        .darkMode
                        ? "left-9"
                        : "left-1"
                    }
                  `}
                />

              </button>

            </div>

          </div>

        </div>

        {/* SAVE BUTTON */}

        <div
          className="
            flex
            justify-end
          "
        >

          <button

            onClick={saveSettings}

            disabled={saving}

            className="
              h-16
              px-10
              rounded-3xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              font-bold
              text-lg
              shadow-xl
              flex
              items-center
              gap-3
              hover:scale-[1.02]
              transition-all
              duration-300
              disabled:opacity-50
            "

          >

            <Save size={22} />

            {

              saving
                ? "Saving Settings..."
                : "Save Settings"

            }

          </button>

        </div>

      </div>

    </MainLayout>

  );

}