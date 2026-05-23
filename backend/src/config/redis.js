import { createClient } from "redis";

const redisClient =
  createClient({

    url:
      "redis://127.0.0.1:6379",

  });

redisClient.connect();

export default redisClient;