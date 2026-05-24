import { Worker } from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";

// ================= REDIS =================

const connection = new IORedis({

  host: process.env.REDIS_HOST || "127.0.0.1",

  port: process.env.REDIS_PORT || 6379,

  maxRetriesPerRequest: null,

});

// ================= MAIL TRANSPORT =================

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

// ================= WORKER =================

const worker = new Worker(

  "emailQueue",

  async (job) => {

    const {

      to,
      subject,
      html,

    } = job.data;

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to,

      subject,

      html,

    });

    console.log(
      "✅ Email Sent:",
      to
    );

  },

  {
    connection,
  }

);

worker.on("completed", () => {

  console.log(
    "✅ Email Job Completed"
  );

});

worker.on("failed", (job, err) => {

  console.log(
    "❌ Email Job Failed"
  );

  console.log(err.message);

});