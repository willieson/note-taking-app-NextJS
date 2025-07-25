import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const res = await pool.query("SELECT NOW()");
    return NextResponse.json({ time: res.rows[0] });
  } catch (err: any) {
    console.error("❌ DB Test Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
