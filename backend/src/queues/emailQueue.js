import { Queue } from "bullmq";
import IORedis from "ioredis";

// ================= REDIS CONNECTION =================

const connection = new IORedis({

  host: process.env.REDIS_HOST || "127.0.0.1",

  port: process.env.REDIS_PORT || 6379,

  maxRetriesPerRequest: null,

});

// ================= EMAIL QUEUE =================

export const emailQueue = new Queue(
  "emailQueue",
  {
    connection,
  }
);

export default emailQueue;