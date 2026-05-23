import {
    useEffect,
    useState,
} from "react";

import API from "../services/api";

import {
    Calendar,
    momentLocalizer,
} from "react-big-calendar";

import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer =
    momentLocalizer(moment);

export default function InterviewCalendar() {

    const [events, setEvents] =
        useState([]);

    useEffect(() => {

        API.get(
            "/jobs/applicants"
        ).then((res) => {

            const mapped =
                res.data
                    .filter(
                        (a) =>
                            a.interviewDate
                    )
                    .map((a) => ({

                        title:
                            a.name,

                        start:
                            new Date(
                                a.interviewDate
                            ),

                        end:
                            new Date(
                                a.interviewDate
                            ),

                    }));

            setEvents(mapped);

        });

    }, []);

    return (

        <div className="p-6 h-screen">

            <h2 className="text-3xl font-bold mb-5">
                Interview Calendar
            </h2>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{
                    height: 700,
                }}
            />

        </div>

    );

}
