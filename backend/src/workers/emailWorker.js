import { Worker }
from "bullmq";

import connection
from "../config/redis.js";

import transporter
from "../config/mail.js";

new Worker(

  "emailQueue",

  async (job) => {

    const {
      to,
      subject,
      html,
    } = job.data;

    await transporter.sendMail({

      from:
        process.env.EMAIL_USER,

      to,
      subject,
      html,

    });

    console.log(
      "✅ Email sent:",
      to
    );

  },

  {
    connection,
  }

);