import { useState } from "react";
import API from "../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function Login() {

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const navigate =
        useNavigate();

    const handleLogin = async () => {

        try {

            console.log("Sending login...");

            const res =
                await fetch(

                    "http://localhost:5000/api/auth/login",

                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({

                            email,
                            password,

                        }),

                    }

                );

            const data =
                await res.json();

            console.log(data);

            if (!res.ok) {

                alert(
                    data.message ||
                    "Login failed"
                );

                return;

            }

            localStorage.setItem(
                "token",
                data.accessToken
            );

            localStorage.setItem(
                "refreshToken",
                data.refreshToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            window.location.href =
                "/dashboard";

        } catch (err) {

            console.log(err);

            alert(
                "Server connection failed"
            );

        }

    };

    return (

        <div className="flex items-center justify-center h-screen bg-gray-100">

            <div className="bg-white p-8 rounded shadow w-80">

                <h2 className="text-2xl font-bold mb-4 text-center">
                    Login
                </h2>

                <input
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="w-full border p-2 mb-4"
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    onClick={handleLogin}
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

            </div>

        </div>

    );

}