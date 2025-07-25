// src/app/api/comments/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  const { note_id, content } = await req.json();

  if (!note_id || !content) {
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
  }

  try {
    await db.query(
      "INSERT INTO comments (note_id, user_id, content) VALUES ($1, $2, $3)",
      [note_id, decoded.id, content]
    );
    return NextResponse.json({ message: "Komentar berhasil disimpan" });
  } catch (err) {
    console.error("Gagal simpan komentar:", err);
    return NextResponse.json({ message: "Gagal menyimpan komentar" }, { status: 500 });
  }
}
