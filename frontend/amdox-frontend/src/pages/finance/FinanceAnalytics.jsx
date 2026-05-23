import { useEffect, useState } from "react";
import API from "../../services/api";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function FinanceAnalytics() {
    const [data, setData] = useState([]);

    useEffect(() => {
        API.get("/finance/analytics")
            .then((res) => setData(res.data));
    }, []);

    // 🔥 Chart Data
    const barData = [
        { name: "Revenue", value: data.revenue },
        { name: "Expense", value: data.expense },
    ];

    const pieData = [
        { name: "Expense", value: data.expense },
        { name: "Profit", value: data.profit },
    ];

    const lineData = [
        { name: "Profit", value: data.profit },
    ];

    const expenses = data.map((d) => ({
        month: d.month,
        amount: d.expense,
    }));

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">
                Monthly Finance Analytics
            </h2>

            {/* 📊 Revenue Bar Chart */}
            <div className="bg-white p-5 rounded shadow">
                <h3 className="mb-3">
                    Revenue Chart
                </h3>

                <BarChart
                    width={700}
                    height={300}
                    data={data}
                >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" />
                </BarChart>
            </div>

            {/* 💸 Expense Chart */}
            <div className="bg-white p-5 rounded shadow">
                <h3 className="mb-3">
                    Expense Chart
                </h3>

                <BarChart
                    width={600}
                    height={300}
                    data={expenses}
                >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" />
                </BarChart>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* 📈 Revenue Trend */}
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="mb-3">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="revenue" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 📉 Expense Trend */}
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="mb-3">Expense Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="expense" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 📊 Profit Comparison */}
                <div className="bg-white p-5 rounded shadow col-span-2">
                    <h3 className="mb-3">Profit Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="profit" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}