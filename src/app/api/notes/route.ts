import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let userId: number;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    userId = (decoded as any).id;
  } catch (err) {
    return NextResponse.json({ message: "Token invalid" }, { status: 401 });
  }

  try {
    // 🟢 My Notes
    const myNotesResult = await db.query(
      `SELECT 
         id, title, content, is_public, created_at, updated_at,
         false AS shared_with_me
       FROM notes
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    // 🟡 Shared with Me
    const sharedWithMeResult = await db.query(
      `SELECT 
         n.id, n.title, n.content, n.is_public, n.created_at, n.updated_at,
         true AS shared_with_me
       FROM notes n
       INNER JOIN note_shares ns ON n.id = ns.note_id
       WHERE ns.shared_to_id = $1
         AND n.user_id != $1
       ORDER BY n.created_at DESC`,
      [userId]
    );

    return NextResponse.json({
      myNotes: myNotesResult.rows,
      sharedWithMe: sharedWithMeResult.rows,
    });
  } catch (err) {
    console.error("❌ Query error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
