import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import { extractErrorMessage } from "@/helper/error";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { name, email, password }: RegisterRequest = await req.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan kata sandi diperlukan" },
        { status: 400 }
      );
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash kata sandi
    const hashedPassword = await hash(password, 10);

    // Simpan pengguna ke database
    const query =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email, name";
    const result = await db.pool.query(query, [name, email, hashedPassword]);

    return NextResponse.json(
      { message: "Registrasi berhasil", user: result.rows[0] },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error during registration:", message);

    return NextResponse.json(
      { error: "Gagal melakukan registrasi: " + message },
      { status: 500 }
    );
  }
}