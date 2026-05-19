import Bull from "bull";

export const notificationQueue = new Bull("notificationQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});