import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate, requireOwner } from "../middleware/auth.middleware";

const router = Router();

// Public routes (no authentication required)
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refresh", (req, res) => authController.refresh(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));

// Protected routes (authentication required)
router.post("/logout-all", authenticate, (req, res) =>
  authController.logoutAll(req, res)
);

// Owner-only routes
router.post("/register", authenticate, requireOwner, (req, res) =>
  authController.register(req, res)
);

export default router;
