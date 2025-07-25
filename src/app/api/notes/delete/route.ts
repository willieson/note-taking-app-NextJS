import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";


// app/api/notes/delete/route.ts
export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const { id } = await req.json();
  
      // Cek kepemilikan
      const check = await db.query(`SELECT user_id FROM notes WHERE id = $1`, [id]);
      if (!check.rows.length || check.rows[0].user_id !== decoded.userId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
  
      await db.query(`DELETE FROM notes WHERE id = $1`, [id]);
      return NextResponse.json({ message: "Deleted" });
    } catch (err) {
      console.error("Gagal hapus note:", err);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }
  