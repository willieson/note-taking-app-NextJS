import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // atau konfigurasi manual
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT notes.id, notes.title, notes.content, users.name
      FROM notes
      JOIN users ON notes.user_id = users.id
      WHERE notes.is_public = true
      ORDER BY notes.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Gagal ambil catatan publik:", error);
    return NextResponse.json(
      { error: "Gagal ambil catatan publik" },
      { status: 500 }
    );
  }
}
