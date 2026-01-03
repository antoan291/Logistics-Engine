import express from "express";
import cors from "cors";
import { config } from "./config/config";

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: true });
});

app.listen(config.PORT, () => {
  console.log(`API running on http://localhost:${config.PORT}`);
});
