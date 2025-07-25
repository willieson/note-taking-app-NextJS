import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcrypt";

// Buat koneksi pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }

  try {
    // Cek apakah email sudah terdaftar
    const existing = await pool.query<{ id: number }>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    
    if (existing?.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ message: "Email already registered." }, { status: 409 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert user baru
    await pool.query(
      `INSERT INTO users (name, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [name, email, hashed]
    );

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
