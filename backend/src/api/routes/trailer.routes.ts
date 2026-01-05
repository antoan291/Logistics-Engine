import { Router } from "express";
import { trailerController } from "../controllers/trailer.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All trailer routes require authentication
router.use(authenticate);

// Create trailer (all authenticated users can create)
router.post("/", (req, res) => trailerController.create(req, res));

// Get all trailers
router.get("/", (req, res) => trailerController.getAll(req, res));

// Get trailer by ID
router.get("/:id", (req, res) => trailerController.getById(req, res));

// Update trailer
router.patch("/:id", (req, res) => trailerController.update(req, res));

// Deactivate trailer
router.delete("/:id", (req, res) => trailerController.deactivate(req, res));

export default router;
