import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

export default function Login() {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    // =========================
    // LOGIN
    // =========================

    const submit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post(
                "/auth/login",
                form
            );

            const user = res.data.user;

            // =========================
            // SAVE TOKENS
            // =========================

            localStorage.setItem(
                "token",
                res.data.accessToken
            );

            localStorage.setItem(
                "refreshToken",
                res.data.refreshToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // =========================
            // ROLE WISE REDIRECT
            // =========================

            if (user.role === "ADMIN") {

                navigate("/dashboard");

            }

            else if (user.role === "HR") {

                navigate("/employees");

            }

            else if (user.role === "FINANCE") {

                navigate("/finance");

            }

            else if (user.role === "EMPLOYEE") {

                navigate("/employee-dashboard");

            }

            else if (user.role === "JOB_SEEKER") {

                navigate("/careers");

            }

            else {

                navigate("/");

            }

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Login Failed"
            );

        }

    };

    return (

        <div className="flex items-center justify-center h-screen bg-gray-100">

            <form
                onSubmit={submit}
                className="bg-white p-8 rounded shadow w-80"
            >

                <h2 className="text-2xl font-bold mb-4 text-center">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3 rounded"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4 rounded"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value,
                        })
                    }
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    Login
                </button>

                <a
                    href="http://localhost:5000/api/auth/google"
                    className="bg-red-500 text-white px-4 py-2 rounded block text-center mt-4"
                >
                    Login with Google
                </a>

            </form>

        </div>

    );

}
