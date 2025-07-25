import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // pastikan .env sudah ada
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
