import db from "../db/client";
import {
  Trailer,
  CreateTrailerInput,
  UpdateTrailerInput,
} from "../../types/trailer.types";

export class TrailerRepository {
  // Create new trailer
  async create(input: CreateTrailerInput, createdBy: string): Promise<Trailer> {
    const query = `
      INSERT INTO trailers (
        name, type, length, width, height, trailer_cubes,
        max_weight, max_axle_weight_front, max_axle_weight_rear, 
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      input.name,
      input.type,
      input.length,
      input.width,
      input.height,
      input.trailerCubes,
      input.maxWeight,
      input.maxAxleWeightFront,
      input.maxAxleWeightRear,
      createdBy,
    ];

    const result = await db.query<Trailer>(query, values);
    return result.rows[0];
  }

  // Find all trailers
  async findAll(): Promise<Trailer[]> {
    const query = `SELECT * FROM trailers WHERE is_active = true ORDER BY created_at DESC`;
    const result = await db.query<Trailer>(query);
    return result.rows;
  }

  // Find trailer by ID
  async findById(id: string): Promise<Trailer | null> {
    const query = `SELECT * FROM trailers WHERE id = $1`;
    const result = await db.query<Trailer>(query, [id]);
    return result.rows[0] || null;
  }

  // Update trailer
  async update(id: string, input: UpdateTrailerInput): Promise<Trailer | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(input.name);
    }

    if (input.type !== undefined) {
      fields.push(`type = $${paramIndex++}`);
      values.push(input.type);
    }

    if (input.length !== undefined) {
      fields.push(`length = $${paramIndex++}`);
      values.push(input.length);
    }

    if (input.width !== undefined) {
      fields.push(`width = $${paramIndex++}`);
      values.push(input.width);
    }

    if (input.height !== undefined) {
      fields.push(`height = $${paramIndex++}`);
      values.push(input.height);
    }

    if (input.trailerCubes !== undefined) {
      fields.push(`trailer_cubes = $${paramIndex++}`);
      values.push(input.trailerCubes);
    }

    if (input.maxWeight !== undefined) {
      fields.push(`max_weight = $${paramIndex++}`);
      values.push(input.maxWeight);
    }

    if (input.maxAxleWeightFront !== undefined) {
      fields.push(`max_axle_weight_front = $${paramIndex++}`);
      values.push(input.maxAxleWeightFront);
    }

    if (input.maxAxleWeightRear !== undefined) {
      fields.push(`max_axle_weight_rear = $${paramIndex++}`);
      values.push(input.maxAxleWeightRear);
    }

    if (input.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(input.is_active);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE trailers 
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query<Trailer>(query, values);
    return result.rows[0] || null;
  }

  // Deactivate trailer (soft delete)
  async deactivate(id: string): Promise<boolean> {
    const query = `
      UPDATE trailers 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export const trailerRepository = new TrailerRepository();
