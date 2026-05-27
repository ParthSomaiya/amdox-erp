import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

const app = express();

app.use(helmet());

app.use(hpp());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(morgan("dev"));

app.use(
  "/uploads",
  express.static("uploads")
);

export default app;