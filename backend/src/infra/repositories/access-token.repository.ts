import db from "../db/client";

export interface RefreshToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export class RefreshTokenRepository {
  //save refresh token to db
  async create(userId: string, token: string, expiresAt: Date): Promise<void> {
    const query = `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`;
    await db.query(query, [userId, token, expiresAt]);
  }

  //find refresh token
  async findByToken(token: string): Promise<RefreshToken | null> {
    const query = `SELECT * FROM refresh_tokens WHERE token = $1`;
    const result = await db.query<RefreshToken>(query, [token]);
    return result.rows[0] || null;
  }

  //delete refresh token
  async deleteByToken(token: string): Promise<void> {
    const query = `DELETE FROM refresh_tokens WHERE token = $1`;
    await db.query(query, [token]);
  }

  //delete all tokens for user -> logout from all devices
  async deleteAllByUserId(userId: string): Promise<void> {
    const query = `DELETE FROM refresh_tokens WHERE user_id = $1`;
    await db.query(query, [userId]);
  }

  //delete expired tokens
  async deleteExpired(): Promise<void> {
    const query = `DELETE FROM refresh_tokens WHERE expires_at < NOW()`;
    await db.query(query);
  }
}
