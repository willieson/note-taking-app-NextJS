import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } // <- gunakan 'id' sesuai nama folder
) {
  const noteId = Number(params.id);
  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
  }

  try {
    const result = await db.query(
      `
      SELECT users.id, users.name, users.email
      FROM note_shares
      JOIN users ON users.id = note_shares.shared_to_id
      WHERE note_shares.note_id = $1
    `,
      [noteId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Gagal ambil shared users:", error);
    return NextResponse.json(
      { error: "Gagal mengambil shared users" },
      { status: 500 }
    );
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const noteId = Number(params.id);
    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }
  
    try {
      const { userId } = await req.json();
  
      if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }
  
      await db.query(
        `DELETE FROM note_shares WHERE note_id = $1 AND shared_to_id = $2`,
        [noteId, userId]
      );
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("❌ Gagal membatalkan share:", error);
      return NextResponse.json(
        { error: "Gagal membatalkan share" },
        { status: 500 }
      );
    }
  }
