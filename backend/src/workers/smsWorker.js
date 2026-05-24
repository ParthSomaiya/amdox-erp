import { Worker } from "bullmq";

import Redis from "ioredis";

import twilio from "twilio";

const connection =
  new Redis({

    host:
      process.env.REDIS_HOST,

    port:
      process.env.REDIS_PORT,

  });

const client =
  twilio(

    process.env.TWILIO_SID,

    process.env.TWILIO_AUTH

  );

new Worker(

  "smsQueue",

  async (job) => {

    const {

      to,
      message,

    } = job.data;

    await client.messages.create({

      body: message,

      from:
        process.env.TWILIO_PHONE,

      to,

    });

    console.log(
      "✅ SMS Sent"
    );

  },

  {
    connection,
  }

);