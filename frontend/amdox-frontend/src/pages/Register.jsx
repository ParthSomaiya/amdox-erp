import { useState } from "react";
import API from "../services/api";

export default function Register() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1);

    const sendOtp = async () => {
        await API.post("/auth/send-otp", { email });
        setStep(2);
    };

    const verifyOtp = async () => {
        await API.post("/auth/verify-otp", {
            email,
            otp,
            password,
            role: "EMPLOYEE",
        });

        alert("Registered");
    };

    return (
        <div className="flex flex-col items-center mt-20 gap-6">
            <h2 className="text-2xl font-bold">Join Amdox</h2>

            <button
                onClick={() => navigate("/register/employee")}
                className="bg-blue-600 text-white px-6 py-3 rounded"
            >
                Join as Employee
            </button>

            <button
                onClick={() => navigate("/register/job")}
                className="bg-green-600 text-white px-6 py-3 rounded"
            >
                Find a Job
            </button>

            <button onClick={() => navigate("/login")}>
                Join as Employee
            </button>
        </div>
    );
}