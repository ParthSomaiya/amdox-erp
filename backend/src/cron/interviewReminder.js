import cron from "node-cron";

import Applicant
    from "../models/Applicant.js";

import {
    sendInterviewMail,
} from "../utils/sendInterviewMail.js";

cron.schedule(
    "0 9 * * *",

    async () => {

        const tomorrow =
            new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const applicants =
            await Applicant.find({

                interviewDate: {

                    $gte: tomorrow,

                },

            });

        for (const a of applicants) {

            await sendInterviewMail(

                a.email,

                a.interviewDate

            );

        }

    }
);
