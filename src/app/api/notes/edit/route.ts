import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const { id, title, content, is_public } = await req.json();
  
      // Verifikasi bahwa note milik user ini
      const noteCheck = await db.query(`SELECT user_id FROM notes WHERE id = $1`, [id]);
      if (!noteCheck.rows.length || noteCheck.rows[0].user_id !== decoded.userId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
  
      const result = await db.query(
        `UPDATE notes SET title = $1, content = $2, is_public = $3 WHERE id = $4 RETURNING *`,
        [title, content, is_public, id]
      );
  
      return NextResponse.json(result.rows[0]);
    } catch (err) {
      console.error("Gagal edit note:", err);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }
  