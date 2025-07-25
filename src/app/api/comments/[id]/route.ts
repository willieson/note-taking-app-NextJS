import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Ambil komentar berdasarkan note_id
export async function GET(req: Request, context: { params: { id: string } }) {
  const noteId = context.params.id;

  try {
    const result = await db.query(
      `SELECT comments.id, comments.content, comments.created_at, users.name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.note_id = $1
       ORDER BY comments.created_at ASC`,
      [noteId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Gagal mengambil komentar:", err);
    return NextResponse.json(
      { message: "Gagal mengambil komentar" },
      { status: 500 }
    );
  }
}

// Tambah komentar ke note_id
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let userId: string;
  let userName: string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      name: string;
    };
    userId = decoded.userId;
    userName = decoded.name;
  } catch (err) {
    return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
  }

  const noteId = params.id;
  const body = await req.json();
  const content = body.content;

  if (!content || content.trim() === "") {
    return NextResponse.json(
      { message: "Isi komentar tidak boleh kosong" },
      { status: 400 }
    );
  }

  try {
    const result = await db.query(
      `INSERT INTO comments (user_id, note_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`,
      [userId, noteId, content]
    );

    return NextResponse.json({
      ...result.rows[0],
      name: userName, // langsung dari JWT
    });
  } catch (err) {
    console.error("Gagal menambahkan komentar:", err);
    return NextResponse.json(
      { message: "Gagal menambahkan komentar" },
      { status: 500 }
    );
  }
}
