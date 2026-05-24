import redis from "../config/redis.js";

export const cacheAnalytics =
  async (
    key,
    data
  ) => {

    await redis.set(

      key,

      JSON.stringify(data),

      "EX",

      3600

    );

  };

export const getCachedAnalytics =
  async (key) => {

    const data =
      await redis.get(key);

    if (!data)
      return null;

    return JSON.parse(data);

  };