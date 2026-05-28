import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../../services/api";

import {
  Upload,
  FileText,
  Send,
} from "lucide-react";

export default function ApplyJob() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  // ================= STATE =================

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",
      email: "",

    });

  const [resume, setResume] =
    useState(null);

  // ================= CHANGE =================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  // ================= SUBMIT =================

  const submit =
    async (e) => {

      e.preventDefault();

      if (!resume) {

        return alert(
          "Please upload resume"
        );

      }

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "name",
          form.name
        );

        formData.append(
          "email",
          form.email
        );

        formData.append(
          "resume",
          resume
        );

        await API.post(

          `/jobs/apply/${id}`,

          formData,

          {

            headers: {

              "Content-Type":
                "multipart/form-data",

            },

          }

        );

        alert(
          "Application Submitted Successfully"
        );

        navigate("/careers");

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data
            ?.message ||
          "Failed to apply"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      className="
        min-h-screen
        bg-slate-100
        p-6
        flex
        items-center
        justify-center
      "
    >

      <div
        className="
          w-full
          max-w-3xl
          bg-white
          rounded-[40px]
          shadow-2xl
          overflow-hidden
        "
      >

        {/* TOP */}

        <div
          className="
            bg-gradient-to-r
            from-cyan-600
            via-blue-600
            to-indigo-700
            p-10
            text-white
          "
        >

          <h1
            className="
              text-5xl
              font-black
            "
          >

            Apply For Job

          </h1>

          <p
            className="
              mt-4
              text-cyan-100
              text-lg
            "
          >

            Submit your application
            professionally

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={submit}
          className="
            p-10
            space-y-8
          "
        >

          {/* NAME */}

          <div>

            <label
              className="
                block
                font-bold
                mb-3
                text-lg
              "
            >

              Full Name

            </label>

            <input

              type="text"

              name="name"

              value={form.name}

              onChange={handleChange}

              required

              placeholder="Enter your name"

              className="
                w-full
                h-16
                rounded-2xl
                border
                border-gray-300
                px-6
                text-lg
                outline-none
                focus:border-cyan-500
              "
            />

          </div>

          {/* EMAIL */}

          <div>

            <label
              className="
                block
                font-bold
                mb-3
                text-lg
              "
            >

              Email Address

            </label>

            <input

              type="email"

              name="email"

              value={form.email}

              onChange={handleChange}

              required

              placeholder="Enter your email"

              className="
                w-full
                h-16
                rounded-2xl
                border
                border-gray-300
                px-6
                text-lg
                outline-none
                focus:border-cyan-500
              "
            />

          </div>

          {/* RESUME */}

          <div>

            <label
              className="
                block
                font-bold
                mb-3
                text-lg
              "
            >

              Upload Resume

            </label>

            <label
              className="
                h-44
                border-2
                border-dashed
                border-cyan-400
                rounded-3xl
                flex
                flex-col
                items-center
                justify-center
                cursor-pointer
                hover:bg-cyan-50
                transition-all
              "
            >

              <Upload
                size={45}
                className="
                  text-cyan-600
                "
              />

              <p
                className="
                  mt-4
                  font-semibold
                  text-gray-700
                "
              >

                Click to upload resume

              </p>

              <p
                className="
                  text-gray-400
                  text-sm
                  mt-1
                "
              >

                PDF / DOC / DOCX

              </p>

              <input

                type="file"

                hidden

                accept=".pdf,.doc,.docx"

                onChange={(e) =>
                  setResume(
                    e.target.files[0]
                  )
                }

              />

            </label>

            {

              resume && (

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-3
                    bg-slate-100
                    rounded-2xl
                    p-4
                  "
                >

                  <FileText
                    className="
                      text-cyan-600
                    "
                  />

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {resume.name}

                  </span>

                </div>

              )

            }

          </div>

          {/* BUTTON */}

          <button

            type="submit"

            disabled={loading}

            className="
              w-full
              h-16
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-black
              text-lg
              flex
              items-center
              justify-center
              gap-3
              hover:scale-[1.02]
              transition-all
              duration-300
            "
          >

            <Send size={22} />

            {

              loading
                ? "Submitting..."
                : "Submit Application"

            }

          </button>

        </form>

      </div>

    </div>

  );

}