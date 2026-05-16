import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", { email, password });

            const token = res.data.token;
            localStorage.setItem("token", token);

            const decoded = jwtDecode(token);

            // 🔥 MAIN LOGIC
            if (decoded.role === "JOB_SEEKER") {
                navigate("/jobs");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

                <input
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="w-full border p-2 mb-4"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    Login
                </button>
            </div>
        </div>
    );
}