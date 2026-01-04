import express from "express";
import cors from "cors";
import { config } from "./config/config";
import db from "./infra/db/client";
import { userRepository } from "./infra/repositories/user.repository";
import authRoutes from "./api/routes/auth.routes";
import { PasswordUtil } from "./core/auth/password.util";

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    // Test database connection
    const result = await db.query("SELECT NOW()");
    res.json({
      status: true,
      database: "connected",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

//TEST endpoint - remove this later
app.post("/test-create-user", async (req, res) => {
  try {
    const user = await userRepository.create({
      email: "test@example.com",
      password_hash: "hashed_password",
      full_name: "Test User",
      role: "dispatcher",
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

//Auth routes
app.use("/api/auth", authRoutes);

app.listen(config.PORT, () => {
  console.log(`API running on http://localhost:${config.PORT}`);
});
