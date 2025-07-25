import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = parseInt(params.id, 10);
  const { email } = await req.json();

  if (!noteId || !email) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const userRes = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRes.rows[0].id;

    await db.query(
      "DELETE FROM note_shares WHERE note_id = $1 AND shared_to_id = $2",
      [noteId, userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Gagal unshare:", err);
    return NextResponse.json({ error: "Gagal membatalkan share" }, { status: 500 });
  }
}
