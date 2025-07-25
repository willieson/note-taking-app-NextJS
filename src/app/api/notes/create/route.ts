import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { title, content, is_public } = await req.json();

    const result = await db.query(
      `INSERT INTO notes (user_id, title, content, is_public)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [decoded.userId, title, content, is_public]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Gagal membuat note:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
