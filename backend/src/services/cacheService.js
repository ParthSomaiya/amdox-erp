import redis from "../config/redis.js";

// ================= GET CACHE =================

export const getCache =
  async (key) => {

    const data =
      await redis.get(key);

    return data
      ? JSON.parse(data)
      : null;

  };

// ================= SET CACHE =================

export const setCache =
  async (
    key,
    value,
    expiry = 300
  ) => {

    await redis.set(

      key,

      JSON.stringify(value),

      "EX",

      expiry

    );

  };

// ================= DELETE CACHE =================

export const deleteCache =
  async (key) => {

    await redis.del(key);

  };