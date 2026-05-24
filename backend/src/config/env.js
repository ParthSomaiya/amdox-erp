import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
];

requiredEnv.forEach((key) => {

  if (!process.env[key]) {

    throw new Error(
      `❌ Missing ENV: ${key}`
    );

  }

});

export default process.env;