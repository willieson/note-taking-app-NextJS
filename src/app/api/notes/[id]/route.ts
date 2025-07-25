import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const note = await db.query(
    `
    SELECT notes.*, users.name 
    FROM notes 
    JOIN users ON notes.user_id = users.id 
    WHERE notes.id = $1 AND is_public = true
  `,
    [params.id]
  );

  if (note.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(note.rows[0]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userIdString = cookies().get("userId")?.value;
  const userId = parseInt(userIdString || "", 10);
  const noteId = parseInt(params.id, 10);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Pastikan user hanya menghapus catatan miliknya
    const check = await db.query(
      `SELECT id FROM notes WHERE id = $1 AND user_id = $2`,
      [noteId, userId]
    );

    if (check.rows.length === 0) {
      return NextResponse.json(
        { error: "Catatan tidak ditemukan atau bukan milik Anda" },
        { status: 404 }
      );
    }

    await db.query(`DELETE FROM notes WHERE id = $1`, [noteId]);

    return NextResponse.json({ message: "Catatan berhasil dihapus" });
  } catch (error) {
    console.error("❌ Gagal delete catatan:", error);
    return NextResponse.json(
      { error: "Gagal menghapus catatan" },
      { status: 500 }
    );
  }
}
