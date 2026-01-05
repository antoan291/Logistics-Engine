import { Response } from "express";
import { trailerService } from "../../core/trailer/trailer.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class TrailerController {
  // Create new trailer
  // POST /api/trailers
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        name,
        type,
        length,
        width,
        height,
        trailerCubes,
        maxWeight,
        maxAxleWeightFront,
        maxAxleWeightRear,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !type ||
        length === undefined ||
        width === undefined ||
        height === undefined ||
        trailerCubes === undefined ||
        maxWeight === undefined ||
        maxAxleWeightFront === undefined ||
        maxAxleWeightRear === undefined
      ) {
        res.status(400).json({
          error:
            "Missing required fields: name, type, length, width, height, trailerCubes, maxWeight, maxAxleWeightFront, maxAxleWeightRear",
        });
        return;
      }

      // Get user ID from authenticated request
      const createdBy = req.user!.userId;

      // Create trailer
      const trailer = await trailerService.create(
        {
          name,
          type,
          length: Number(length),
          width: Number(width),
          height: Number(height),
          trailerCubes: Number(trailerCubes),
          maxWeight: Number(maxWeight),
          maxAxleWeightFront: Number(maxAxleWeightFront),
          maxAxleWeightRear: Number(maxAxleWeightRear),
        },
        createdBy
      );

      res.status(201).json({
        message: "Trailer created successfully",
        data: trailer,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Get all trailers
  // GET /api/trailers
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const trailers = await trailerService.getAll();

      res.status(200).json({
        message: "Trailers retrieved successfully",
        data: trailers,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Get trailer by ID
  // GET /api/trailers/:id
  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const trailer = await trailerService.getById(id);

      if (!trailer) {
        res.status(404).json({ error: "Trailer not found" });
        return;
      }

      res.status(200).json({
        message: "Trailer retrieved successfully",
        data: trailer,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Update trailer
  // PATCH /api/trailers/:id
  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const trailer = await trailerService.update(id, updates);

      if (!trailer) {
        res.status(404).json({ error: "Trailer not found" });
        return;
      }

      res.status(200).json({
        message: "Trailer updated successfully",
        data: trailer,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Deactivate trailer
  // DELETE /api/trailers/:id
  async deactivate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await trailerService.deactivate(id);

      res.status(200).json({
        message: "Trailer deactivated successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export const trailerController = new TrailerController();
