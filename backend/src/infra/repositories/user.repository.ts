import db from "../db/client";
import { User, CreateUserInput, UpdateUserInput } from "../../types/user.types";

export class UserRepository {
  //create new user
  async create(input: CreateUserInput): Promise<User> {
    const query = `INSERT INTO users(email, password_hash, full_name, role, created_by)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *`;

    const values = [
      input.email,
      input.password_hash,
      input.full_name,
      input.role,
      input.created_by || null,
    ];

    const result = await db.query<User>(query, values);
    return result.rows[0];
  }

  //find user by email
  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query<User>(query, [email]);
    return result.rows[0] || null;
  }

  //find user by id
  async findById(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await db.query<User>(query, [id]);
    return result.rows[0] || null;
  }

  //update user
  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.full_name !== undefined) {
      fields.push(`full_name = $${paramIndex++}`);
      values.push(input.full_name);
    }

    if (input.role !== undefined) {
      fields.push(`role = $${paramIndex++}`);
      values.push(input.role);
    }

    if (input.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(input.is_active);
    }

    if (fields.length === 0) {
      return this.findById(id); // nothing to update, return current user
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE users SET ${fields.join(
      ", "
    )} WHERE id = $${paramIndex} RETURNING *`;

    const result = await db.query<User>(query, values);
    return result.rows[0] || null;
  }

  //delete( deactivate) user
  async delete(id: string): Promise<boolean> {
    const query = `UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1`;
    const result = await db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  //check if email exists
  async emailExists(email: string): Promise<boolean> {
    const query = `SELECT 1 FROM users WHERE email = $1`;
    const result = await db.query<{ exists: boolean }>(query, [email]);
    return result.rows[0].exists;
  }
}

export const userRepository = new UserRepository();
