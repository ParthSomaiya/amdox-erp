import { useEffect, useState } from "react";
import API from "../services/api";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Analytics() {
    const [data, setData] = useState({
        employees: [],
        leaves: [],
        payroll: [],
    });
    const [month, setMonth] = useState("");

    useEffect(() => {
        API.get(`/analytics?month=${month}`)
            .then((res) => setData(res.data));
    }, [month]);

    return (
        <MainLayout>
            <h2 className="text-2xl font-bold mb-6">Analytics</h2>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Employees Growth */}
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="mb-3">Employee Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.employees}>
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Payroll */}
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="mb-3">Payroll Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.payroll}>
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Leaves Pie */}
                <div className="bg-white p-5 rounded shadow col-span-2">
                    <h3 className="mb-3">Leave Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.leaves}
                                dataKey="count"
                                nameKey="_id"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                            >
                                {data.leaves.map((entry, index) => (
                                    <Cell key={index} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </MainLayout>
    );
}