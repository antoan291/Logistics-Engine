import { Pool, QueryResult, QueryResultRow } from "pg";
import { config } from "../../config/config";

//create connection pool
const pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("Database connected");
});

pool.on("error", (err) => {
  console.error("Unexpected database error", err);
  process.exit(-1);
});

export const db = {
  query: async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> => {
    const start = Date.now();
    try {
      const result = await pool.query<T>(text, params);
      const duration = Date.now() - start;
      console.log("Executed query", { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error("Database query error:", { text, error });
      throw error;
    }
  },

  // Get a client from pool (for transactions later)
  getClient: () => pool.connect(),
};

export default db;
