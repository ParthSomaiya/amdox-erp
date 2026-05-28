
import {
  useEffect,
  useState,
} from "react";

import {
  Shield,
  Lock,
  Save,
  Smartphone,
  KeyRound,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import API from "../../services/api";

import MainLayout from "../../layouts/MainLayout";

export default function SecuritySettings() {

  // ================= STATE =================

  const [passwordMinLength,
    setPasswordMinLength] =
      useState(8);

  const [enable2FA,
    setEnable2FA] =
      useState(false);

  const [sessionTimeout,
    setSessionTimeout] =
      useState(30);

  const [loginAttempts,
    setLoginAttempts] =
      useState(5);

  const [loading,
    setLoading] =
      useState(true);

  const [saving,
    setSaving] =
      useState(false);

  // ================= FETCH SETTINGS =================

  useEffect(() => {

    fetchSettings();

  }, []);

  const fetchSettings =
    async () => {

      try {

        const res =
          await API.get(
            "/admin/settings"
          );

        const security =
          res.data
            ?.securitySettings;

        if (security) {

          setPasswordMinLength(
            security.passwordMinLength || 8
          );

          setEnable2FA(
            security.enable2FA || false
          );

          setSessionTimeout(
            security.sessionTimeout || 30
          );

          setLoginAttempts(
            security.loginAttempts || 5
          );

        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= SAVE SETTINGS =================

  const saveSettings =
    async () => {

      try {

        setSaving(true);

        await API.post(
          "/admin/settings",
          {
            securitySettings: {

              passwordMinLength:
                Number(passwordMinLength),

              enable2FA,

              sessionTimeout:
                Number(sessionTimeout),

              loginAttempts:
                Number(loginAttempts),

            },
          }
        );

        alert(
          "Security settings saved successfully"
        );

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data?.message ||
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

            <Loader2
              size={50}
              className="
                animate-spin
                text-indigo-600
                mx-auto
              "
            />

            <h2
              className="
                mt-5
                text-2xl
                font-black
              "
            >

              Loading Security Settings...

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
            from-indigo-700
            via-purple-700
            to-blue-700
            rounded-[32px]
            p-10
            text-white
            shadow-2xl
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
                h-20
                w-20
                rounded-3xl
                bg-white/20
                backdrop-blur-lg
                flex
                items-center
                justify-center
              "
            >

              <Shield size={40} />

            </div>

            <div>

              <h1
                className="
                  text-5xl
                  font-black
                "
              >

                Security Settings

              </h1>

              <p
                className="
                  text-indigo-100
                  mt-3
                  text-lg
                "
              >

                Configure platform security,
                authentication and protection settings

              </p>

            </div>

          </div>

        </div>

        {/* SETTINGS CARD */}

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-xl
            p-8
            border
            border-gray-100
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
                from-indigo-500
                to-purple-600
                flex
                items-center
                justify-center
                text-white
              "
            >

              <Lock size={30} />

            </div>

            <div>

              <h2
                className="
                  text-3xl
                  font-black
                "
              >

                Authentication & Security

              </h2>

              <p className="text-gray-500 mt-1">

                Manage password rules,
                session protection and
                two-factor authentication

              </p>

            </div>

          </div>

          {/* FORM GRID */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-8
            "
          >

            {/* PASSWORD LENGTH */}

            <div
              className="
                border
                border-gray-200
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-5
                "
              >

                <div
                  className="
                    h-12
                    w-12
                    rounded-2xl
                    bg-indigo-100
                    text-indigo-600
                    flex
                    items-center
                    justify-center
                  "
                >

                  <KeyRound size={22} />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-black
                    "
                  >

                    Password Policy

                  </h3>

                  <p className="text-gray-500 text-sm">

                    Minimum required password length

                  </p>

                </div>

              </div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-3
                "
              >

                Minimum Password Length

              </label>

              <input

                type="number"

                min="6"

                max="32"

                value={passwordMinLength}

                onChange={(e) =>
                  setPasswordMinLength(
                    e.target.value
                  )
                }

                className="
                  w-full
                  h-14
                  border
                  border-gray-300
                  rounded-2xl
                  px-5
                  outline-none
                  focus:border-indigo-500
                "

              />

            </div>

            {/* 2FA */}

            <div
              className="
                border
                border-gray-200
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-5
                "
              >

                <div
                  className="
                    h-12
                    w-12
                    rounded-2xl
                    bg-green-100
                    text-green-600
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Smartphone size={22} />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-black
                    "
                  >

                    Two-Factor Authentication

                  </h3>

                  <p className="text-gray-500 text-sm">

                    Add extra security layer

                  </p>

                </div>

              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mt-8
                "
              >

                <div>

                  <h4 className="font-bold">

                    Enable 2FA

                  </h4>

                  <p className="text-sm text-gray-500">

                    Users must verify login
                    with OTP authentication

                  </p>

                </div>

                <button

                  type="button"

                  onClick={() =>
                    setEnable2FA(
                      !enable2FA
                    )
                  }

                  className={`
                    relative
                    w-16
                    h-9
                    rounded-full
                    transition-all
                    ${
                      enable2FA
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }
                  `}
                >

                  <span
                    className={`
                      absolute
                      top-1
                      h-7
                      w-7
                      rounded-full
                      bg-white
                      transition-all
                      ${
                        enable2FA
                          ? "left-8"
                          : "left-1"
                      }
                    `}
                  />

                </button>

              </div>

            </div>

            {/* SESSION TIMEOUT */}

            <div
              className="
                border
                border-gray-200
                rounded-3xl
                p-6
              "
            >

              <h3
                className="
                  text-xl
                  font-black
                  mb-5
                "
              >

                Session Timeout

              </h3>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-3
                "
              >

                Auto Logout (Minutes)

              </label>

              <input

                type="number"

                min="5"

                max="240"

                value={sessionTimeout}

                onChange={(e) =>
                  setSessionTimeout(
                    e.target.value
                  )
                }

                className="
                  w-full
                  h-14
                  border
                  border-gray-300
                  rounded-2xl
                  px-5
                  outline-none
                  focus:border-indigo-500
                "

              />

            </div>

            {/* LOGIN ATTEMPTS */}

            <div
              className="
                border
                border-gray-200
                rounded-3xl
                p-6
              "
            >

              <h3
                className="
                  text-xl
                  font-black
                  mb-5
                "
              >

                Login Protection

              </h3>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-3
                "
              >

                Max Failed Login Attempts

              </label>

              <input

                type="number"

                min="1"

                max="10"

                value={loginAttempts}

                onChange={(e) =>
                  setLoginAttempts(
                    e.target.value
                  )
                }

                className="
                  w-full
                  h-14
                  border
                  border-gray-300
                  rounded-2xl
                  px-5
                  outline-none
                  focus:border-indigo-500
                "

              />

            </div>

          </div>

          {/* SECURITY NOTICE */}

          <div
            className="
              mt-10
              bg-indigo-50
              border
              border-indigo-100
              rounded-3xl
              p-6
              flex
              gap-4
            "
          >

            <CheckCircle2
              size={28}
              className="
                text-indigo-600
                mt-1
              "
            />

            <div>

              <h3
                className="
                  text-lg
                  font-black
                  text-indigo-900
                "
              >

                Security Recommendation

              </h3>

              <p
                className="
                  text-indigo-700
                  mt-2
                  leading-7
                "
              >

                Enable Two-Factor Authentication
                and maintain strong password
                policies to improve account security
                across your organization.

              </p>

            </div>

          </div>

          {/* SAVE BUTTON */}

          <div className="mt-10">

            <button

              onClick={saveSettings}

              disabled={saving}

              className="
                h-14
                px-10
                rounded-2xl
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                text-white
                font-bold
                text-lg
                flex
                items-center
                gap-3
                hover:scale-[1.02]
                transition-all
                duration-300
                disabled:opacity-50
              "

            >

              {

                saving ? (

                  <>

                    <Loader2
                      size={22}
                      className="animate-spin"
                    />

                    Saving Settings...

                  </>

                ) : (

                  <>

                    <Save size={22} />

                    Save Security Settings

                  </>

                )

              }

            </button>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}