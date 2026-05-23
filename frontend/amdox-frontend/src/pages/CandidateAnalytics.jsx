import {
    useEffect,
    useState,
} from "react";

import API from "../services/api";

import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function CandidateAnalytics() {

    const [data, setData] =
        useState([]);

    useEffect(() => {

        API.get(
            "/jobs/applicants"
        ).then((res) => {

            const grouped = {};

            res.data.forEach((a) => {

                grouped[a.status] =
                    (grouped[a.status] || 0)
                \+ 1;

            });

            const arr =
                Object.keys(grouped).map(
                    (k) => ({
                        name: k,
                        value: grouped[k],
                    })
                );

            setData(arr);

        });

    }, []);

    return (

        <div className="p-6">

            <h2 className="text-3xl font-bold mb-5">
                Candidate Analytics
            </h2>

            <ResponsiveContainer
                width="100%"
                height={400}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                    />

                    <Tooltip />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}