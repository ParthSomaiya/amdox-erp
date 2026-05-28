import { Queue } from "bullmq";
import IORedis from "ioredis";

// ==============================
// 🔌 REDIS CONNECTION (PRODUCTION SAFE)
// ==============================

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,

  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// ==============================
// 📧 EMAIL QUEUE (PRODUCTION CONFIG)
// ==============================

export const emailQueue = new Queue("emailQueue", {
  connection,

  defaultJobOptions: {
    attempts: 3, // retry 3 times
    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: {
      count: 1000, // keep last 1000 successful jobs
    },

    removeOnFail: {
      count: 500, // keep last failed jobs for debugging
    },
  },
});

// ==============================
// 🧪 CONNECTION LOG
// ==============================

connection.on("connect", () => {
  console.log("📦 Redis connected for email queue");
});

connection.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

// ==============================
// EXPORT DEFAULT
// ==============================

export default emailQueue;