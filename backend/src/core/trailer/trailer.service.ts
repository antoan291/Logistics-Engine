import { trailerRepository } from "../../infra/repositories/trailer.repository";
import {
  CreateTrailerInput,
  UpdateTrailerInput,
  Trailer,
} from "../../types/trailer.types";

export class TrailerService {
  // Create new trailer with basic validation
  async create(input: CreateTrailerInput, createdBy: string): Promise<Trailer> {
    // Validate all fields are positive numbers
    if (input.length <= 0) {
      throw new Error("Length must be greater than 0");
    }
    if (input.width <= 0) {
      throw new Error("Width must be greater than 0");
    }
    if (input.height <= 0) {
      throw new Error("Height must be greater than 0");
    }
    if (input.trailerCubes <= 0) {
      throw new Error("Trailer cubes must be greater than 0");
    }
    if (input.maxWeight <= 0) {
      throw new Error("Max weight must be greater than 0");
    }
    if (input.maxAxleWeightFront <= 0) {
      throw new Error("Front axle weight must be greater than 0");
    }
    if (input.maxAxleWeightRear <= 0) {
      throw new Error("Rear axle weight must be greater than 0");
    }

    // Validate required fields
    if (!input.name || !input.type) {
      throw new Error("Name and type are required");
    }

    // Create trailer
    return await trailerRepository.create(input, createdBy);
  }

  // Get all trailers
  async getAll(): Promise<Trailer[]> {
    return await trailerRepository.findAll();
  }

  // Get trailer by ID
  async getById(id: string): Promise<Trailer | null> {
    return await trailerRepository.findById(id);
  }

  // Update trailer
  async update(id: string, input: UpdateTrailerInput): Promise<Trailer | null> {
    // Check if trailer exists
    const existing = await trailerRepository.findById(id);
    if (!existing) {
      throw new Error("Trailer not found");
    }

    // Validate updated fields if provided
    if (input.length !== undefined && input.length <= 0) {
      throw new Error("Length must be greater than 0");
    }
    if (input.width !== undefined && input.width <= 0) {
      throw new Error("Width must be greater than 0");
    }
    if (input.height !== undefined && input.height <= 0) {
      throw new Error("Height must be greater than 0");
    }
    if (input.trailerCubes !== undefined && input.trailerCubes <= 0) {
      throw new Error("Trailer cubes must be greater than 0");
    }
    if (input.maxWeight !== undefined && input.maxWeight <= 0) {
      throw new Error("Max weight must be greater than 0");
    }
    if (
      input.maxAxleWeightFront !== undefined &&
      input.maxAxleWeightFront <= 0
    ) {
      throw new Error("Front axle weight must be greater than 0");
    }
    if (input.maxAxleWeightRear !== undefined && input.maxAxleWeightRear <= 0) {
      throw new Error("Rear axle weight must be greater than 0");
    }

    return await trailerRepository.update(id, input);
  }

  // Deactivate trailer
  async deactivate(id: string): Promise<void> {
    const existing = await trailerRepository.findById(id);
    if (!existing) {
      throw new Error("Trailer not found");
    }

    const success = await trailerRepository.deactivate(id);
    if (!success) {
      throw new Error("Failed to deactivate trailer");
    }
  }
}

export const trailerService = new TrailerService();
